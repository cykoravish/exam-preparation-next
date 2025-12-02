import { NextResponse } from "next/server"
import { createPaymentLink } from "@/lib/db-utils"

export async function POST(request: Request) {
  try {
    const { razorpayLink } = await request.json()

    if (!razorpayLink) {
      return NextResponse.json({ error: "Payment link required" }, { status: 400 })
    }

    // Validate link format
    if (!razorpayLink.includes("razorpay") && !razorpayLink.includes("rzp.io")) {
      return NextResponse.json({ error: "Invalid Razorpay link" }, { status: 400 })
    }

    await createPaymentLink(razorpayLink)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to add payment link:", error)
    return NextResponse.json({ error: "Failed to add payment link" }, { status: 500 })
  }
}
