import { NextResponse } from "next/server"
import { approveActivationRequest } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { requestId, userId, pdfId } = await request.json()

    if (!requestId || !userId || !pdfId) {
      return NextResponse.json(
        {
          error:
            "Request ID, User ID, and PDF ID required. This request may be from an older version. Please ask the user to resubmit their payment request.",
        },
        { status: 400 },
      )
    }

    await approveActivationRequest(new ObjectId(requestId), new ObjectId(userId), new ObjectId(pdfId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Approval error:", error)
    return NextResponse.json({ error: "Failed to approve activation" }, { status: 500 })
  }
}
