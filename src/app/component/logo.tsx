import { HeartHandshake } from "lucide-react";

export function Logo() {
  return (
    <a href="#" className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <HeartHandshake className="h-5 w-5" strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
      </div>

      <span className="text-xl font-black tracking-[-0.04em] text-slate-950">
        SkillSwap
      </span>
    </a>
  );
}
