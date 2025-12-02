"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { getBranches, getSemesters, getSubjects, type BranchCode, type Semester } from "@/lib/branches-data"

interface PDF {
  _id: string
  title: string
  branch: string
  semester: number
  subject: string
  cloudinaryUrl: string
  isFree: boolean
  uploadedAt: string
}

interface PaymentRequest {
  _id: string
  userId: string
  userEmail: string
  userName: string
  status: "pending" | "approved" | "rejected"
  requestedAt: string
}

interface ActivationRequest {
  _id: string
  userId: string
  userEmail: string
  userName: string
  linkId: string
  pdfId: string // Add pdfId field
  pdfTitle: string // Add pdfTitle field
  status: "pending" | "approved" | "rejected"
  createdAt: string
  processedAt?: string
}

interface PaymentLink {
  _id: string
  razorpayLink: string
  isUsed: boolean
  usedBy?: string
  usedAt?: string
  createdAt: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([])
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [newPaymentLink, setNewPaymentLink] = useState("")
  const [linkLoading, setLinkLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "pdfs" | "links" | "activations">("upload")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")
  const [uploadForm, setUploadForm] = useState<any>({
    title: "",
    branch: "",
    semester: "",
    subject: "",
    isFree: false,
  })
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    fetchAllPDFs()
    fetchPaymentLinks()
    fetchActivationRequests()
  }, [])

  const fetchAllPDFs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/pdfs")
      const data = await response.json()
      setPdfs(data.pdfs || [])
    } catch (error) {
      console.error("Failed to fetch PDFs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    if (file) {
      setFilePreview(file.name)
    } else {
      setFilePreview("")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError("")
    setUploadSuccess("")

    if (!uploadFile) {
      setUploadError("Please select a PDF file")
      return
    }

    if (!uploadForm.title || !uploadForm.branch || !uploadForm.semester || !uploadForm.subject) {
      setUploadError("Please fill all fields")
      return
    }

    setUploadLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("title", uploadForm.title)
      formData.append("branch", uploadForm.branch)
      formData.append("semester", uploadForm.semester.toString())
      formData.append("subject", uploadForm.subject)
      formData.append("isFree", uploadForm.isFree.toString())

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setUploadSuccess("PDF uploaded successfully!")
      setUploadForm({
        title: "",
        branch: "",
        semester: "",
        subject: "",
        isFree: false,
      })
      setUploadFile(null)
      setFilePreview("")
      const fileInput = document.getElementById("file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      fetchAllPDFs()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return

    try {
      const response = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      fetchAllPDFs()
    } catch (error) {
      alert("Failed to delete PDF")
    }
  }

  const toggleFreeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/toggle-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFree: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Update failed")
      }

      fetchAllPDFs()
    } catch (error) {
      alert("Failed to update PDF status")
    }
  }

  const fetchPaymentRequests = async () => {
    try {
      const response = await fetch("/api/admin/payment-requests")
      const data = await response.json()
      setPaymentRequests(data.requests || [])
    } catch (error) {
      console.error("Failed to fetch payment requests:", error)
    }
  }

  const fetchActivationRequests = async () => {
    try {
      const response = await fetch("/api/admin/activation-requests")
      const data = await response.json()
      console.log("[v0] Fetched activation requests:", data)
      setActivationRequests(data.requests || [])
    } catch (error) {
      console.error("[v0] Failed to fetch activation requests:", error)
    }
  }

  const handleApproveActivation = async (requestId: string, userId: string, pdfId: string) => {
    try {
      if (!pdfId) {
        alert("This request is missing PDF information. Please ask the user to create a new payment request.")
        return
      }

      const response = await fetch("/api/admin/approve-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, userId, pdfId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to approve")
      }

      alert("User activated successfully! They now have access to the PDF.")
      fetchActivationRequests()
    } catch (error) {
      console.error("Approval failed:", error)
      alert(`Failed to approve: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleRejectActivation = async (requestId: string) => {
    if (!confirm("Reject this activation request?")) return

    try {
      const response = await fetch("/api/admin/reject-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject activation")
      }

      fetchActivationRequests()
    } catch (error) {
      alert("Failed to reject activation")
    }
  }

  const fetchPaymentLinks = async () => {
    try {
      const response = await fetch("/api/admin/payment-links")
      const data = await response.json()
      setPaymentLinks(data.links || [])
    } catch (error) {
      console.error("Failed to fetch payment links:", error)
    }
  }

  const handleAddPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPaymentLink.trim()) return

    setLinkLoading(true)
    try {
      const response = await fetch("/api/admin/add-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpayLink: newPaymentLink }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add payment link")
      }

      setNewPaymentLink("")
      fetchPaymentLinks()
      alert("Payment link added successfully!")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add payment link")
    } finally {
      setLinkLoading(false)
    }
  }

  const handleDeletePaymentLink = async (id: string) => {
    if (!confirm("Delete this payment link?")) return

    try {
      const response = await fetch("/api/admin/delete-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete payment link")
      }

      fetchPaymentLinks()
    } catch (error) {
      alert("Failed to delete payment link")
    }
  }

  const subjects = uploadForm.branch && uploadForm.semester ? getSubjects(uploadForm.branch, uploadForm.semester) : []

  const pendingActivationsCount = activationRequests.filter((a) => a.status === "pending").length

  const availableLinks = paymentLinks.filter((link) => !link.isUsed).length
  const usedLinks = paymentLinks.filter((link) => link.isUsed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 sm:w-auto bg-transparent"
          >
            Logout
          </Button>
        </div>

        <div className="mb-4 overflow-x-auto sm:mb-6">
          <div className="mb-4 flex min-w-max gap-2 rounded-lg bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              onClick={() => setActiveTab("upload")}
              className="whitespace-nowrap text-sm sm:text-base"
            >
              Upload PDF
            </Button>
            <Button
              variant={activeTab === "pdfs" ? "default" : "ghost"}
              onClick={() => setActiveTab("pdfs")}
              className="whitespace-nowrap text-sm sm:text-base"
            >
              Manage PDFs ({pdfs.length})
            </Button>
            <Button
              variant={activeTab === "links" ? "default" : "ghost"}
              onClick={() => setActiveTab("links")}
              className="whitespace-nowrap text-sm sm:text-base"
            >
              Payment Links ({paymentLinks.filter((l) => !l.isUsed).length}/{paymentLinks.length})
            </Button>
            <Button
              variant={activeTab === "activations" ? "default" : "ghost"}
              onClick={() => setActiveTab("activations")}
              className="whitespace-nowrap text-sm sm:text-base"
            >
              User Activations ({activationRequests.filter((r) => r.status === "pending").length})
            </Button>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <Card className="overflow-hidden border-indigo-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-indigo-900/20 dark:bg-gray-800/90 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">Upload New PDF</h2>
            <form onSubmit={handleUpload} className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 2025 Expected Questions"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <select
                    id="branch"
                    value={uploadForm.branch}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        branch: e.target.value as BranchCode,
                        subject: "",
                      })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select branch</option>
                    {getBranches().map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <select
                    id="semester"
                    value={uploadForm.semester}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        semester: e.target.value ? (Number(e.target.value) as Semester) : "",
                        subject: "",
                      })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select semester</option>
                    {getSemesters().map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    disabled={!subjects.length}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50"
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="file">PDF File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                  {filePreview && (
                    <div className="mt-2 flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 p-2 text-sm dark:border-indigo-800 dark:bg-indigo-950">
                      <svg
                        className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="flex-1 truncate text-indigo-700 dark:text-indigo-300">{filePreview}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={uploadForm.isFree}
                    onChange={(e) => setUploadForm({ ...uploadForm, isFree: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isFree" className="cursor-pointer">
                    Make this PDF free
                  </Label>
                </div>
              </div>
              {uploadError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{uploadError}</div>
              )}

              {uploadSuccess && (
                <div className="rounded-md bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {uploadSuccess}
                </div>
              )}

              <Button
                type="submit"
                disabled={uploadLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {uploadLoading ? "Uploading..." : "Upload PDF"}
              </Button>
            </form>
          </Card>
        )}

        {/* Manage PDFs Tab */}
        {activeTab === "pdfs" && (
          <Card className="overflow-hidden border-indigo-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-indigo-900/20 dark:bg-gray-800/90 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">Manage PDFs ({pdfs.length})</h2>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {loading ? (
                  <div className="py-12 text-center">Loading...</div>
                ) : pdfs.length === 0 ? (
                  <div className="rounded-lg bg-slate-50 p-8 text-center dark:bg-gray-900">
                    <p className="text-muted-foreground">No PDFs uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pdfs.map((pdf) => (
                      <div
                        key={pdf._id}
                        className="flex items-center justify-between rounded-lg border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/50 p-3 dark:border-indigo-800 dark:from-gray-800 dark:to-indigo-950/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{pdf.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pdf.branch} - Sem {pdf.semester} - {pdf.subject}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={pdf.isFree ? "default" : "outline"}
                            onClick={() => toggleFreeStatus(pdf._id, pdf.isFree)}
                            className={pdf.isFree ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {pdf.isFree ? "Free" : "Premium"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(pdf._id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Payment Links Tab */}
        {activeTab === "links" && (
          <Card className="overflow-hidden border-indigo-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-indigo-900/20 dark:bg-gray-800/90 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">
              Payment Links ({paymentLinks.filter((l) => !l.isUsed).length} available / {paymentLinks.length} total)
            </h2>

            {/* Add new payment link */}
            <div className="mb-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3 dark:from-indigo-950/30 dark:to-purple-950/30 sm:p-4">
              <Label htmlFor="newLink" className="mb-2 block text-sm font-medium">
                Add New Razorpay Payment Link
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="newLink"
                  type="url"
                  placeholder="https://rzp.io/rzp/xxxxx"
                  value={newPaymentLink}
                  onChange={(e) => setNewPaymentLink(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  onClick={handleAddPaymentLink}
                  disabled={linkLoading || !newPaymentLink}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 sm:w-auto"
                >
                  {linkLoading ? "Adding..." : "Add Link"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {paymentLinks.length === 0 ? (
                  <div className="rounded-lg bg-slate-50 p-8 text-center dark:bg-gray-900">
                    <p className="text-muted-foreground">No payment links added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paymentLinks.map((link) => (
                      <div
                        key={link._id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          link.isUsed
                            ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                            : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm">{link.razorpayLink}</code>
                            {link.isUsed ? (
                              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                Used
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                                Available
                              </span>
                            )}
                          </div>
                          {link.isUsed && link.usedBy && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Used by: {link.usedBy} on {new Date(link.usedAt!).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleDeletePaymentLink(link._id)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* User Activations Tab */}
        {activeTab === "activations" && (
          <Card className="overflow-hidden border-indigo-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-indigo-900/20 dark:bg-gray-800/90 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">
              User Activation Requests ({activationRequests.filter((r) => r.status === "pending").length} pending)
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {activationRequests.length === 0 ? (
                  <div className="rounded-lg bg-slate-50 p-8 text-center dark:bg-gray-900">
                    <p className="text-muted-foreground">No activation requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activationRequests.map((request) => (
                      <div
                        key={request._id}
                        className={`rounded-lg border p-3 sm:p-4 ${
                          request.status === "pending"
                            ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                            : request.status === "approved"
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                              : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                        }`}
                      >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="truncate font-semibold text-sm sm:text-base">{request.userEmail}</h3>
                            <p className="text-xs text-muted-foreground sm:text-sm">{request.userName}</p>
                            <p className="mt-1 truncate text-xs font-medium text-indigo-600 dark:text-indigo-400 sm:text-sm">
                              PDF: {request.pdfTitle}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Requested: {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`self-start rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 ${
                              request.status === "pending"
                                ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                : request.status === "approved"
                                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleApproveActivation(request._id, request.userId, request.pdfId)
                              }}
                              disabled={!request.pdfId}
                              className="w-full bg-green-600 hover:bg-green-700 sm:w-auto text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Approve & Grant Access
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectActivation(request._id)}
                              className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 sm:w-auto text-xs sm:text-sm"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
