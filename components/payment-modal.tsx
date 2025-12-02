"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  onClose: () => void
  userEmail: string
}

export function PaymentModal({ onClose, userEmail }: PaymentModalProps) {
  const [step, setStep] = useState<"info" | "payment" | "waiting">("info")
  const [loading, setLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState("")

  const handleProceedToPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/get-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "No payment links available. Please contact admin.")
        return
      }

      setPaymentLink(data.paymentLink)

      // Open payment link in new tab
      window.open(data.paymentLink, "_blank")
      setStep("payment")
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to get payment link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestActivation = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/request-activation", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to submit activation request")
      }

      setStep("waiting")
    } catch (error) {
      console.error("Activation request error:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-gradient-to-br from-white to-indigo-50 p-6 shadow-2xl dark:from-gray-800 dark:to-indigo-950">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            Upgrade to Premium
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {step === "info" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:border-indigo-800 dark:from-indigo-950 dark:to-purple-950">
              <h3 className="mb-3 font-semibold text-indigo-900 dark:text-indigo-100">What you get:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Access to ALL premium PDFs</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Lifetime access - Pay once, use forever</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">All branches and semesters covered</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">New PDFs added regularly</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Amount:</strong> ₹{process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || "499"}
              </p>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">One-time payment for lifetime access</p>
            </div>

            <Button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {loading ? "Loading..." : "Proceed to Payment"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">Secure payment powered by Razorpay</p>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Payment Link Opened</h3>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Complete your payment of ₹{process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || "499"} in the new tab.
              </p>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
              <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">Next Steps:</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                <li>Complete payment in the opened tab</li>
                <li>Click "I've Completed Payment" below</li>
                <li>Admin will verify and activate your premium access</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleRequestActivation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {loading ? "Submitting..." : "I've Completed Payment"}
              </Button>
              <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "waiting" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Activation Request Submitted</h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your payment activation request has been submitted successfully. Admin will verify your payment and
                activate your premium access soon.
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Note:</strong> Activation typically takes a few minutes to a few hours. You'll get instant
                access once admin verifies your payment.
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
