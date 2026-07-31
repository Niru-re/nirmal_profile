"use client";

export function BackgroundGradient() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-accent-purple/8 blur-[120px] animate-pulse-glow" />
      <div className="absolute -top-[20%] -right-[20%] h-[60%] w-[50%] rounded-full bg-accent-blue/6 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-[30%] left-[20%] h-[50%] w-[40%] rounded-full bg-accent-cyan/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 noise opacity-50" />
    </div>
  );
}
