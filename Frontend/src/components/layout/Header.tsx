import { Music2, Moon, Sun, Library, BookMarked, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { NavLink } from "react-router-dom"
import { AuthControls } from "@/features/auth/AuthControls"
import { useAuth } from "@/hooks/useAuth"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

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
        <div className="flex items-center gap-6">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-r-border/40 bg-background/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5 pb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Music2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    Song<span className="text-primary">DL</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4 mt-4">
                <SheetClose>
                  <NavLink
                    to="/songs"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`
                    }
                  >
                    <Library className="h-5 w-5" />
                    Library
                  </NavLink>
                </SheetClose>

                {session && (
                  <SheetClose>
                    <NavLink
                      to="/collection"
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <BookMarked className="h-5 w-5" />
                      My Collection
                    </NavLink>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <NavLink
            to="/"
            className="hidden items-center gap-2.5 sm:flex"
            id="nav-home-link"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Music2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Song<span className="text-primary">DL</span>
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 sm:flex">
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
              Library
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
                My Collection
              </NavLink>
            )}
          </div>
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
