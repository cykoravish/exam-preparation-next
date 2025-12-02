import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createActivationRequest, getAssignedPaymentLink } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { pdfId } = body

    if (!pdfId) {
      return NextResponse.json({ error: "PDF ID required" }, { status: 400 })
    }

    const link = await getAssignedPaymentLink(user.email)

    if (!link) {
      return NextResponse.json({ error: "No payment link found. Please get a payment link first." }, { status: 404 })
    }

    const { getDatabase } = await import("@/lib/db-utils")
    const db = await getDatabase()
    const pdf = await db.collection("pdfs").findOne({ _id: new ObjectId(pdfId) })

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    const userObjectId = new ObjectId(user.id)
    const linkObjectId = link._id as ObjectId
    const pdfObjectId = new ObjectId(pdfId)

    await createActivationRequest(userObjectId, user.email, user.name, linkObjectId, pdfObjectId, pdf.title)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment request error:", error)
    return NextResponse.json({ error: "Failed to create activation request" }, { status: 500 })
  }
}
