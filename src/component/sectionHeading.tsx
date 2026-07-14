export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] text-slate-950 sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base font-medium leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
