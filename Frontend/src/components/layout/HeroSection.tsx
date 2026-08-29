import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        Free · No account required · Instant downloads
      </div>

      {/* Heading */}
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Download any song
        <br />
        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
          in seconds.
        </span>
      </h1>

      {/* Sub-heading */}
      <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
        Convert YouTube videos to high-quality MP3 audio instantly — no sign-up, no watermarks, just your music.
      </p>

      {/* Down arrow */}
      <div className="mt-10 flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs uppercase tracking-widest font-medium">Paste your link below</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
