import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { UserSkill } from "@/models/userSkill";
import { SwapRequest } from "@/models/swapRequest";
import { Review } from "@/models/review";
import { UserBadge } from "@/models/userBadge";
import { Badge } from "@/models/badge";
import { Session } from "@/models/session";
import mongoose from "mongoose";

export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number;
    reviewCount: number;
    completedSwaps: number;
    trustScore: number;
    totalHoursShared: number;
    currentStreak: number;
    longestStreak: number;
    verifiedSkills: string[];
  };
  stats: {
    skillsTaught: number;
    skillsLearned: number;
    completedSwaps: number;
    hoursShared: number;
    averageRating: number;
    currentStreak: number;
  };
  badges: { name: string; icon: string; description: string; earned: boolean }[];
  recentActivity: {
    type: string;
    description: string;
    date: string;
  }[];
  upcomingSessions: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    otherUser: { name: string; avatar: string | null };
  }[];
  achievements: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
    progress: number;
    target: number;
  }[];
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  const mySkills = await UserSkill.find({ userId }).populate("skillId", "name").lean();
  const skillsTaught = mySkills.filter((s) => s.type === "teach").length;
  const skillsLearned = mySkills.filter((s) => s.type === "learn").length;

  const now = new Date();

  const upcomingSessionsRaw = await Session.find({
    $or: [{ organizerId: userId }, { participantId: userId }],
    date: { $gte: now },
    status: "scheduled",
  })
    .populate("organizerId", "name avatar")
    .populate("participantId", "name avatar")
    .sort({ date: 1 })
    .limit(5)
    .lean();

  const upcomingSessions = upcomingSessionsRaw.map((s) => {
    const other = (s.organizerId as any)._id.toString() === userId
      ? s.participantId
      : s.organizerId;
    return {
      id: s._id.toString(),
      title: s.title,
      date: s.date.toISOString(),
      startTime: s.startTime,
      endTime: s.endTime,
      otherUser: {
        name: (other as any).name,
        avatar: (other as any).avatar,
      },
    };
  });

  const streak = await computeStreak(userId);

  const allBadges = await Badge.find().lean();
  const userBadges = await UserBadge.find({ userId }).populate("badgeId", "name icon description").lean();
  const earnedBadgeNames = new Set(userBadges.map((ub) => (ub.badgeId as any)?.name));

  const badges = allBadges.map((b) => ({
    name: b.name,
    icon: b.icon,
    description: b.description,
    earned: earnedBadgeNames.has(b.name),
  }));

  const totalHours = user.totalHoursShared || 0;

  const achievements = [
    { id: "first_swap", name: "First Swap", icon: "🤝", description: "Complete your first skill exchange", unlocked: user.completedSwaps >= 1, progress: Math.min(user.completedSwaps, 1), target: 1 },
    { id: "streak_7", name: "Week Warrior", icon: "🔥", description: "Maintain a 7-day learning streak", unlocked: streak.longest >= 7, progress: Math.min(streak.current, 7), target: 7 },
    { id: "streak_10", name: "10-Day Streak", icon: "🔥", description: "Maintain a 10-day learning streak", unlocked: streak.longest >= 10, progress: Math.min(streak.current, 10), target: 10 },
    { id: "swaps_5", name: "Top Mentor", icon: "🎓", description: "Complete 5 skill exchanges", unlocked: user.completedSwaps >= 5, progress: Math.min(user.completedSwaps, 5), target: 5 },
    { id: "hours_100", name: "100 Hours", icon: "💯", description: "Share 100 hours of learning", unlocked: totalHours >= 100, progress: Math.min(totalHours, 100), target: 100 },
    { id: "rating_45", name: "Rising Star", icon: "⭐", description: "Maintain a 4.5+ average rating", unlocked: user.rating >= 4.5 && user.reviewCount >= 3, progress: user.reviewCount >= 3 ? Math.round(user.rating * 20) : 0, target: 90 },
    { id: "teach_5", name: "Knowledge Sharer", icon: "📚", description: "Teach 5 different skills", unlocked: skillsTaught >= 5, progress: Math.min(skillsTaught, 5), target: 5 },
    { id: "verified", name: "Verified Pro", icon: "✅", description: "Verify 3 skills", unlocked: (user.verifiedSkills?.length || 0) >= 3, progress: Math.min(user.verifiedSkills?.length || 0, 3), target: 3 },
  ];

  const recentActivity: { type: string; description: string; date: string }[] = [];

  const recentSwaps = await SwapRequest.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    status: "completed",
  })
    .populate("teachSkillId", "name")
    .populate("learnSkillId", "name")
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  recentSwaps.forEach((s) => {
    recentActivity.push({
      type: "swap_completed",
      description: `Completed skill exchange: ${(s.teachSkillId as any)?.name} ↔ ${(s.learnSkillId as any)?.name}`,
      date: s.updatedAt?.toISOString?.() || "",
    });
  });

  const recentReviews = await Review.find({ reviewedId: userId })
    .populate("reviewerId", "name")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  recentReviews.forEach((r) => {
    recentActivity.push({
      type: "review_received",
      description: `Received ${r.rating}-star review from ${(r.reviewerId as any)?.name}`,
      date: r.createdAt?.toISOString?.() || "",
    });
  });

  recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      rating: user.rating,
      reviewCount: user.reviewCount,
      completedSwaps: user.completedSwaps,
      trustScore: user.trustScore,
      totalHoursShared: totalHours,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      verifiedSkills: user.verifiedSkills || [],
    },
    stats: {
      skillsTaught,
      skillsLearned,
      completedSwaps: user.completedSwaps,
      hoursShared: totalHours,
      averageRating: user.rating,
      currentStreak: streak.current,
    },
    badges,
    recentActivity: recentActivity.slice(0, 10),
    upcomingSessions,
    achievements,
  };
}

async function computeStreak(userId: string): Promise<{ current: number; longest: number }> {
  const user = await User.findById(userId).lean();
  if (!user) return { current: 0, longest: 0 };

  const completedSwaps = await SwapRequest.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    status: "completed",
  })
    .sort({ updatedAt: -1 })
    .lean();

  if (completedSwaps.length === 0) {
    return { current: 0, longest: user.longestStreak || 0 };
  }

  const dates = [...new Set(
    completedSwaps.map((s) => {
      const d = new Date(s.updatedAt || s.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  )].sort().reverse();

  let current = 0;
  let longest = 0;
  let streak = 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0 && dates[i] === todayStr) {
      streak = 1;
    } else if (i > 0) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i - 1]);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        longest = Math.max(longest, streak);
        streak = 1;
      }
    }
  }

  longest = Math.max(longest, streak);
  if (dates[0] === todayStr) current = streak;

  if (user.longestStreak && user.longestStreak > longest) longest = user.longestStreak;

  return { current, longest };
}
