import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: "gold" | "light" | "outline";
};

type LinkButtonProps = SharedProps & {
  href: string;
  type?: never;
};

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, className = "", variant = "gold", href, ...buttonProps } =
    props;
  const styles = {
    gold: "bg-kd-gold text-kd-black hover:bg-kd-warm-gold",
    light: "bg-kd-cream text-kd-black hover:bg-kd-white",
    outline:
      "border border-current bg-transparent hover:border-kd-gold hover:text-kd-gold",
  };

  const classes = [
    "inline-flex min-h-12 items-center justify-center px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
    "transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kd-gold",
    styles[variant],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
