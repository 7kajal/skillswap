export type HomeMember = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  teaches: string[];
  learning: string[];
};

export type HomeReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    avatar: string | null;
  };
  reviewed: {
    id: string;
    name: string;
  };
};

export type HomeData = {
  members: HomeMember[];
  reviews: HomeReview[];
  stats: {
    completedSwaps: number;
    peopleWhoSwapped: number;
    publishedReviews: number;
  };
};
