"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/** Hidden field — bots fill it; humans never see it. */
export function HoneypotField({ value, onChange }: Props) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
    />
  );
}
