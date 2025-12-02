import { NextResponse } from "next/server"
import { getAvailablePaymentLink, assignPaymentLink } from "@/lib/db-utils"
import type { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, pdfId, pdfTitle } = body

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    if (!pdfId || !pdfTitle) {
      return NextResponse.json({ error: "PDF information required" }, { status: 400 })
    }

    const link = await getAvailablePaymentLink()

    if (!link) {
      return NextResponse.json(
        { error: "No payment links available at the moment. Please contact admin." },
        { status: 404 },
      )
    }

    await assignPaymentLink(link._id as ObjectId, userEmail)

    return NextResponse.json({ paymentLink: link.razorpayLink })
  } catch (error) {
    console.error("Get payment link error:", error)
    return NextResponse.json({ error: "Failed to get payment link" }, { status: 500 })
  }
}
