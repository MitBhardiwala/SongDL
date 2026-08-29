import React from "react"
import { Background } from "@/components/layout/Background"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Background>
      <Header />
      {children}
      <Footer />
    </Background>
  )
}
