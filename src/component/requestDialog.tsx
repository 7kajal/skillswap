"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosPrivate from "@/lib/axiosPrivate";
import type { RequestDialogProps } from "@/types/discover";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function RequestDialog({
  ownProfile,
  swapUser,
  onClose,
  onSuccess,
}: RequestDialogProps) {
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownTeachingSkills =
    ownProfile?.userSkills
      .filter((item) => item.type === "teach")
      .map((item) => item.skill.name) || [];

  useEffect(() => {
    if (swapUser) {
      const skillsTheyTeach = swapUser.userSkills
        .filter((item) => item.type === "teach")
        .map((item) => item.skill.name);

      setTeachSkill(
        swapUser.skillsICanTeachThem[0] || ownTeachingSkills[0] || "",
      );
      setLearnSkill(
        swapUser.skillsTheyCanTeachMe[0] || skillsTheyTeach[0] || "",
      );
      setMessage("");
      setError(null);
    }
  }, [swapUser]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const sendRequest = async () => {
    if (!swapUser || !teachSkill || !learnSkill) return;
    setSending(true);
    setError(null);

    try {
      const response = await axiosPrivate.post("/api/swapRequest", {
        receiverId: swapUser.id,
        teachSkillName: teachSkill,
        learnSkillName: learnSkill,
        message,
      });
      const result = response.data;

      if (result.success) {
        onSuccess(swapUser.id);
        onClose();
      } else {
        setError(result.message || "Unable to send the request.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(msg || "Unable to send the request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={Boolean(swapUser)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(95dvh-1rem)] w-full sm:min-w-md overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7">
        <DialogHeader className="p-0 space-y-0 text-left">
          <DialogTitle className="text-xl font-black text-slate-950">
            Request a skill swap with
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-600">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
              You will teach
            </label>
            <div className="mt-2">
              <Select
                value={teachSkill}
                onValueChange={(v) => v && setTeachSkill(v)}
              >
                <SelectTrigger className="h-15 w-full px-3 py-5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent className="p-3">
                  {ownTeachingSkills.map((skill) => (
                    <SelectItem className="p-2" key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
              You want to learn
            </label>
            <div className="mt-2">
              <Select
                value={learnSkill}
                onValueChange={(v) => v && setLearnSkill(v)}
              >
                <SelectTrigger className="h-15 w-full px-3 py-5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent className="p-3">
                  {swapUser &&
                    swapUser.userSkills
                      .filter((item) => item.type === "teach")
                      .map((item) => (
                        <SelectItem
                          className="p-2"
                          key={item.skill.name}
                          value={item.skill.name}
                        >
                          {item.skill.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
              Message{" "}
              <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              placeholder="Introduce yourself and suggest what you could work on together..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={sendRequest}
            disabled={sending || !teachSkill || !learnSkill}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <HeartHandshake className="h-4 w-4" />
            {sending ? "Sending..." : "Send request"}
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" /> You can manage this request in
          Swap center
        </p>
      </DialogContent>
    </Dialog>
  );
}
