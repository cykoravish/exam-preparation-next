import { NextResponse } from "next/server"
import { rejectActivationRequest } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    await rejectActivationRequest(new ObjectId(requestId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Rejection error:", error)
    return NextResponse.json({ error: "Failed to reject activation" }, { status: 500 })
  }
}
