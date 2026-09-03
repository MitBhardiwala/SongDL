import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDownloadMp3 } from "@/hooks/useDownloadMp3"
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LinkIcon,
} from "lucide-react"

export function DownloadForm() {
  const [url, setUrl] = useState("")
  const [includeLyrics, setIncludeLyrics] = useState(false)
  const mutation = useDownloadMp3()

  const handleDownload = () => {
    if (!url.trim()) return
    mutation.mutate({ youtubeUrl: url, includeLyrics })
  }

  // Reset success state when the user types a new URL
  useEffect(() => {
    if (mutation.isSuccess) {
      mutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-white/10 bg-card/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">
          YouTube to MP3
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Paste a YouTube link and download the audio as an MP3, with optional lyrics.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="relative">
          <LinkIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="youtube-url-input"
            className="h-11 border-border/60 bg-background/60 pl-9 transition-all placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={mutation.isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDownload()
            }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={includeLyrics}
            onChange={(event) => setIncludeLyrics(event.target.checked)}
            disabled={mutation.isPending}
            className="h-4 w-4 accent-primary"
          />
          Fetch and embed lyrics when available
        </label>

        {/* Download Button */}
        <Button
          id="download-btn"
          onClick={handleDownload}
          disabled={mutation.isPending || !url.trim()}
          className="h-11 w-full gap-2 font-semibold tracking-wide transition-all duration-200"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download MP3
            </>
          )}
        </Button>

        {/* Error State */}
        {mutation.isError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Something went wrong. Please try again."}
            </span>
          </div>
        )}

        {/* Success State */}
        {mutation.isSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Download started successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
