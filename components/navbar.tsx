"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"

interface NavbarProps {
  user: { name: string; isPremium: boolean } | null
  onAuthChange: () => void
  loading: boolean
}

export function Navbar({ user, onAuthChange, loading }: NavbarProps) {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "signup" | null>(null)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      onAuthChange()
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  return (
    <>
      <nav className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xl font-bold">LU FOET Notes Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.isPremium && <span className="text-xs font-medium text-primary">Premium</span>}
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowAuthModal("login")}>
                  Login
                </Button>
                <Button onClick={() => setShowAuthModal("signup")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal mode={showAuthModal} onClose={() => setShowAuthModal(null)} onSuccess={onAuthChange} />
      )}
    </>
  )
}
