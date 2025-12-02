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

    if (user.isPremium) {
      return NextResponse.json({ error: "Already a premium user" }, { status: 400 })
    }

    const link = await getAssignedPaymentLink(user.email)

    if (!link) {
      return NextResponse.json({ error: "No payment link found. Please get a payment link first." }, { status: 404 })
    }

    const userObjectId = new ObjectId(user.id)
    const linkObjectId = link._id as ObjectId

    await createActivationRequest(userObjectId, user.email, user.name, linkObjectId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment request error:", error)
    return NextResponse.json({ error: "Failed to create activation request" }, { status: 500 })
  }
}
