// src/features/auth/AuthControls.tsx
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Loader2 } from "lucide-react"

export function AuthControls() {
  const { session, isLoading, isPending, signIn, signOut } = useAuth()

  // Skeleton while session resolves
  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            className="h-8 w-8 rounded-full border border-border/50 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {session.user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}

        {/* Name */}
        <span className="hidden text-sm font-medium sm:block">
          {session.user.name}
        </span>

        {/* Sign out */}
        <Button
          id="auth-sign-out-btn"
          variant="outline"
          size="sm"
          onClick={signOut}
          disabled={isPending}
          className="gap-1.5 rounded-xl border-border/60 text-sm"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          {isPending ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    )
  }

  return (
    <Button
      id="auth-sign-in-btn"
      size="sm"
      onClick={signIn}
      disabled={isPending}
      className="gap-1.5 rounded-xl shadow-sm shadow-primary/20"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogIn className="h-3.5 w-3.5" />
      )}
      {isPending ? "Signing in…" : "Sign in"}
    </Button>
  )
}
