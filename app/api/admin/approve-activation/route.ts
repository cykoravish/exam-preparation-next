import { NextResponse } from "next/server"
import { approveActivationRequest } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { requestId, userId } = await request.json()

    if (!requestId || !userId) {
      return NextResponse.json({ error: "Request ID and User ID required" }, { status: 400 })
    }

    await approveActivationRequest(new ObjectId(requestId), new ObjectId(userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approval error:", error)
    return NextResponse.json({ error: "Failed to approve activation" }, { status: 500 })
  }
}
