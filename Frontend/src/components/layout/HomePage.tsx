import { DownloadForm } from "./DownloadForm"
import { Features } from "./Features"
import { HeroSection } from "./HeroSection"

function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col items-center px-4 pb-24">
      <HeroSection />

      <div className="w-full max-w-lg">
        <DownloadForm />
      </div>

      <Features />
    </main>
  )
}

export default HomePage
