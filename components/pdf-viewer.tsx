"use client"

import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  url: string
  onClose: () => void
}

export function PDFViewer({ url, onClose }: PDFViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative h-full w-full max-w-6xl rounded-lg bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">PDF Viewer</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <iframe src={url} className="h-[calc(100%-60px)] w-full rounded-b-lg" title="PDF Viewer" />
      </div>
    </div>
  )
}
