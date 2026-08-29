import React from "react"

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Top-left orb */}
      <div className="pointer-events-none fixed top-[-15%] left-[-10%] h-[55vh] w-[55vh] rounded-full bg-indigo-400/35 blur-[130px] dark:bg-primary/10" />
      {/* Bottom-right orb */}
      <div className="pointer-events-none fixed right-[-10%] bottom-[-15%] h-[55vh] w-[55vh] rounded-full bg-violet-400/30 blur-[130px] dark:bg-indigo-500/10" />
      {/* Center subtle glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[40vh] w-[70vw] max-w-2xl rounded-full bg-sky-300/25 blur-[100px] dark:bg-violet-500/5" />
      </div>

      {/* Noise texture overlay for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  )
}
