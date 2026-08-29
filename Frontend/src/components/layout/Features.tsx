import { Zap, ShieldCheck, Headphones, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    title: "Lightning Fast",
    description:
      "Processed on our servers in seconds — no waiting, no queues.",
  },
  {
    icon: <Headphones className="h-5 w-5 text-primary" />,
    title: "High Quality Audio",
    description:
      "Crystal-clear MP3 extracted at the highest available bitrate.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
    title: "Safe & Private",
    description:
      "No ads, no malware, no account needed. Your data stays yours.",
  },
  {
    icon: <Globe className="h-5 w-5 text-blue-400" />,
    title: "Works Everywhere",
    description:
      "Fully responsive — desktop, tablet, or phone, it just works.",
  },
];

export function Features() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-20 mb-10 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Why use SongDL?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Built for speed, quality, and simplicity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-background/70">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
