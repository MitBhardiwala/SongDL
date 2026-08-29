import { useState } from "react"
import { authClient } from "@/lib/auth-client"



export function useAuth() {
  const { data: session, isPending: isLoading } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)

  const signIn = () => {

    setIsPending(true)
    authClient.signIn.social({
      provider: "google",
      callbackURL: `${import.meta.env.VITE_APP_URL ?? "http://localhost:5173"}/songs`,
    })
  }

  const signOut = async () => {
    setIsPending(true)
    try {
      await authClient.signOut()
    } finally {
      setIsPending(false)
    }
  }

  return { session, isLoading, isPending, signIn, signOut }
}
