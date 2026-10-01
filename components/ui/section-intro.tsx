import type { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  inverse?: boolean;
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  copy,
  inverse = false,
  className = "",
}: SectionIntroProps) {
  return (
    <div className={className}>
      <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${inverse ? "text-kd-gold" : "text-kd-gold-dark"}`}>
        {eyebrow}
      </p>
      <h2 className="font-display mt-6 max-w-4xl text-5xl font-medium leading-[0.96] tracking-[-0.025em] md:text-7xl">
        {title}
      </h2>
      {copy ? (
        <p className={`mt-7 max-w-2xl text-base leading-8 md:text-lg ${inverse ? "text-white/55" : "text-kd-gray"}`}>
          {copy}
        </p>
      ) : null}
    </div>
  );
}
