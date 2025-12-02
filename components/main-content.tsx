"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { PDFGrid } from "@/components/pdf-grid"
import type { BranchCode, Semester } from "@/lib/branches-data"

interface User {
  id: string
  email: string
  name: string
  isPremium: boolean
}

export function MainContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<BranchCode | "">("")
  const [selectedSemester, setSelectedSemester] = useState<Semester | "">("")
  const [selectedSubject, setSelectedSubject] = useState("")

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("[v0] Failed to fetch user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBranchChange = (branch: BranchCode | "") => {
    setSelectedBranch(branch)
    setSelectedSemester("")
    setSelectedSubject("")
  }

  const handleSemesterChange = (semester: Semester | "") => {
    setSelectedSemester(semester)
    setSelectedSubject("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} onAuthChange={fetchUser} loading={loading} />

      <div className="flex flex-1">
        <Sidebar
          selectedBranch={selectedBranch}
          selectedSemester={selectedSemester}
          selectedSubject={selectedSubject}
          onBranchChange={handleBranchChange}
          onSemesterChange={handleSemesterChange}
          onSubjectChange={setSelectedSubject}
        />

        <main className="flex-1 p-6">
          {!selectedBranch || !selectedSemester || !selectedSubject ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h2 className="mt-4 text-xl font-semibold">Welcome to LU FOET Notes Portal</h2>
                <p className="mt-2 text-muted-foreground">
                  Select your branch, semester, and subject from the sidebar to view available notes
                </p>
              </div>
            </div>
          ) : (
            <PDFGrid
              branch={selectedBranch}
              semester={selectedSemester}
              subject={selectedSubject}
              user={user}
              onAuthRequired={() => fetchUser()}
            />
          )}
        </main>
      </div>
    </div>
  )
}
