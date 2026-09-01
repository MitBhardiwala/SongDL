import { Music2, Moon, Sun, Library, BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { NavLink } from "react-router-dom"
import { AuthControls } from "@/features/auth/AuthControls"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { session } = useAuth()

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo + nav */}
        <div className="flex items-center gap-2 sm:gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2.5"
            id="nav-home-link"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Music2 className="h-5 w-5" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline-block">
              Song<span className="text-primary">DL</span>
            </span>
          </NavLink>

          <NavLink
            to="/songs"
            id="nav-library-link"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </NavLink>

          {session && (
            <NavLink
              to="/collection"
              id="nav-collection-link"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">My Collection</span>
            </NavLink>
          )}
        </div>

        {/* Right side: theme toggle then auth */}
        <div className="flex items-center gap-2">
          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-accent/80"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </Button>

          <AuthControls />
        </div>
      </div>
    </header>
  )
}
