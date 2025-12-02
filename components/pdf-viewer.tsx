"use client"

import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  url: string
  onClose: () => void
}

export function PDFViewer({ url, onClose }: PDFViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
      <div className="relative h-full w-full max-w-6xl rounded-lg bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b p-3 sm:p-4">
          <h3 className="text-base font-semibold sm:text-lg">PDF Viewer</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <iframe
          src={url}
          className="h-[calc(100%-48px)] w-full rounded-b-lg sm:h-[calc(100%-60px)]"
          title="PDF Viewer"
        />
      </div>
    </div>
  )
}
