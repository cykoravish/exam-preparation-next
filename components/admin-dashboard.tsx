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
  const [uploadForm, setUploadForm] = useState({
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

  const handleApproveActivation = async (requestId: string, userId: string) => {
    console.log("[v0] Approving activation:", { requestId, userId })

    if (!confirm("Approve this activation and grant premium access?")) return

    try {
      const response = await fetch("/api/admin/approve-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          userId,
        }),
      })

      const data = await response.json()
      console.log("[v0] Approval response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Approval failed")
      }

      alert("User activated successfully!")
      fetchActivationRequests()
    } catch (error) {
      console.error("[v0] Approval error:", error)
      alert(`Failed to approve activation: ${error.message}`)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Admin Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === "upload" ? "default" : "outline"}
            onClick={() => setActiveTab("upload")}
            className={activeTab === "upload" ? "bg-gradient-to-r from-indigo-600 to-purple-600" : ""}
          >
            Upload PDF
          </Button>
          <Button
            variant={activeTab === "pdfs" ? "default" : "outline"}
            onClick={() => setActiveTab("pdfs")}
            className={activeTab === "pdfs" ? "bg-gradient-to-r from-indigo-600 to-purple-600" : ""}
          >
            Manage PDFs ({pdfs.length})
          </Button>
          <Button
            variant={activeTab === "links" ? "default" : "outline"}
            onClick={() => setActiveTab("links")}
            className={activeTab === "links" ? "bg-gradient-to-r from-indigo-600 to-purple-600" : ""}
          >
            Payment Links ({availableLinks} available)
          </Button>
          <Button
            variant={activeTab === "activations" ? "default" : "outline"}
            onClick={() => setActiveTab("activations")}
            className={activeTab === "activations" ? "bg-gradient-to-r from-indigo-600 to-purple-600" : ""}
          >
            User Activations
            {pendingActivationsCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {pendingActivationsCount}
              </span>
            )}
          </Button>
        </div>

        {activeTab === "upload" && (
          <Card className="border-indigo-100 bg-white/80 p-6 backdrop-blur-sm dark:border-indigo-900 dark:bg-gray-800/80">
            <h2 className="mb-4 text-xl font-bold text-indigo-900 dark:text-indigo-100">Upload New PDF</h2>
            <form onSubmit={handleUpload} className="space-y-4">
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

        {activeTab === "pdfs" && (
          <Card className="border-indigo-100 bg-white/80 p-6 backdrop-blur-sm dark:border-indigo-900 dark:bg-gray-800/80">
            <h2 className="mb-4 text-xl font-bold text-indigo-900 dark:text-indigo-100">All PDFs ({pdfs.length})</h2>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : pdfs.length === 0 ? (
              <p className="text-muted-foreground">No PDFs uploaded yet</p>
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
          </Card>
        )}

        {activeTab === "links" && (
          <Card className="border-indigo-100 bg-white/80 p-6 backdrop-blur-sm dark:border-indigo-900 dark:bg-gray-800/80">
            <h2 className="mb-4 text-xl font-bold text-indigo-900 dark:text-indigo-100">Payment Links Management</h2>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                <div className="text-sm text-green-700 dark:text-green-300">Available Links</div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">{availableLinks}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className="text-sm text-gray-700 dark:text-gray-300">Used Links</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{usedLinks}</div>
              </div>
            </div>

            <form onSubmit={handleAddPaymentLink} className="mb-6 space-y-3">
              <Label htmlFor="paymentLink">Add New Razorpay Payment Link</Label>
              <div className="flex gap-2">
                <Input
                  id="paymentLink"
                  placeholder="https://rzp.io/rzp/xxxxxxxx"
                  value={newPaymentLink}
                  onChange={(e) => setNewPaymentLink(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={linkLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {linkLoading ? "Adding..." : "Add Link"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Create payment links in Razorpay Dashboard and paste them here. Each link will be used once.
              </p>
            </form>

            <div className="space-y-2">
              <h3 className="font-semibold">All Payment Links</h3>
              {paymentLinks.length === 0 ? (
                <p className="text-muted-foreground">No payment links added yet</p>
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
          </Card>
        )}

        {activeTab === "activations" && (
          <Card className="border-indigo-100 bg-white/80 p-6 backdrop-blur-sm dark:border-indigo-900 dark:bg-gray-800/80">
            <h2 className="mb-4 text-xl font-bold text-indigo-900 dark:text-indigo-100">
              User Activation Requests ({pendingActivationsCount} pending)
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Users who completed payment and are waiting for premium activation
            </p>

            {activationRequests.length === 0 ? (
              <p className="text-muted-foreground">No activation requests yet</p>
            ) : (
              <div className="space-y-3">
                {activationRequests.map((request) => (
                  <div
                    key={request._id}
                    className={`rounded-lg border p-4 ${
                      request.status === "pending"
                        ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                        : request.status === "approved"
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{request.userEmail}</h3>
                        <p className="text-sm text-muted-foreground">{request.userName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Requested: {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const reqId = request._id
                            const usrId = request.userId
                            console.log("[v0] Button click - Request data:", {
                              reqId,
                              usrId,
                              fullRequest: request,
                            })

                            if (!reqId || !usrId) {
                              console.error("[v0] Missing IDs:", { reqId, usrId })
                              alert("Invalid request data - missing IDs")
                              return
                            }

                            handleApproveActivation(reqId, usrId)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve & Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const reqId = request._id
                            if (reqId) {
                              handleRejectActivation(reqId)
                            }
                          }}
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
