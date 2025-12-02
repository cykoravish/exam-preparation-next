"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"
import { PaymentModal } from "@/components/payment-modal"
import { PDFViewer } from "@/components/pdf-viewer"
import type { BranchCode, Semester } from "@/lib/branches-data"

interface PDF {
  _id: string
  title: string
  cloudinaryUrl: string
  isFree: boolean
  uploadedAt: string
}

interface PDFGridProps {
  branch: BranchCode
  semester: Semester
  subject: string
  user: { isPremium: boolean; email: string } | null
  onAuthRequired: () => void
}

export function PDFGrid({ branch, semester, subject, user, onAuthRequired }: PDFGridProps) {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null)
  const [viewingPDF, setViewingPDF] = useState<string | null>(null)
  const [purchasedPDFs, setPurchasedPDFs] = useState<string[]>([])

  useEffect(() => {
    fetchPDFs()
    if (user) {
      fetchPurchasedPDFs()
    }
  }, [branch, semester, subject, user])

  const fetchPurchasedPDFs = async () => {
    try {
      const response = await fetch("/api/user/purchased-pdfs")
      const data = await response.json()
      setPurchasedPDFs(data.purchasedPDFs || [])
    } catch (error) {
      console.error("Failed to fetch purchased PDFs:", error)
    }
  }

  const fetchPDFs = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/pdfs?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(subject)}`,
      )
      const data = await response.json()
      setPdfs(data.pdfs || [])
    } catch (error) {
      console.error("Failed to fetch PDFs:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasAccessToPDF = (pdf: PDF) => {
    if (pdf.isFree) return true
    if (!user) return false
    return purchasedPDFs.includes(pdf._id)
  }

  const handleView = (pdf: PDF) => {
    if (hasAccessToPDF(pdf)) {
      setViewingPDF(pdf.cloudinaryUrl)
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedPDF(pdf)
    setShowPaymentModal(true)
  }

  const handleDownload = async (pdf: PDF) => {
    if (hasAccessToPDF(pdf)) {
      downloadPDF(pdf.cloudinaryUrl, pdf.title)
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedPDF(pdf)
    setShowPaymentModal(true)
  }

  const downloadPDF = async (url: string, title: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `${title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download PDF")
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (pdfs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-3 text-sm text-muted-foreground">No PDFs available for this subject yet</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            {subject}
          </h2>
          <span className="text-xs text-muted-foreground sm:text-sm">
            {pdfs.length} {pdfs.length === 1 ? "PDF" : "PDFs"} available
          </span>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <Card
              key={pdf._id}
              className="group relative flex flex-col overflow-hidden border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 p-3 transition-all hover:shadow-lg hover:shadow-indigo-100 dark:border-indigo-900 dark:from-gray-800 dark:to-indigo-950/30 dark:hover:shadow-indigo-900/20 sm:p-4"
            >
              <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl" />

              <div className="relative mb-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold leading-tight text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    {pdf.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(pdf.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex-shrink-0">
                  {pdf.isFree ? (
                    <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm sm:px-2.5 sm:py-1">
                      Free
                    </span>
                  ) : hasAccessToPDF(pdf) ? (
                    <span className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm sm:px-2.5 sm:py-1">
                      Owned
                    </span>
                  ) : (
                    <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm sm:px-2.5 sm:py-1">
                      Paid
                    </span>
                  )}
                </div>
              </div>

              <div className="relative mt-auto flex gap-2">
                <Button
                  onClick={() => handleView(pdf)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-xs sm:text-sm"
                  size="sm"
                >
                  <svg
                    className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View
                </Button>
                <Button
                  onClick={() => handleDownload(pdf)}
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950 p-2"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          mode="login"
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            onAuthRequired()
          }}
        />
      )}

      {showPaymentModal && selectedPDF && (
        <PaymentModal
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPDF(null)
          }}
          userEmail={user?.email || ""}
          pdfId={selectedPDF._id}
          pdfTitle={selectedPDF.title}
        />
      )}

      {viewingPDF && <PDFViewer url={viewingPDF} onClose={() => setViewingPDF(null)} />}
    </>
  )
}
