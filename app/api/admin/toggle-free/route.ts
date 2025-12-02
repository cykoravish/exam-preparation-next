import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { updatePDFFreeStatus } from "@/lib/db-utils"

export async function POST(request: NextRequest) {
  try {
    const { id, isFree } = await request.json()

    if (!id || typeof isFree !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await updatePDFFreeStatus(new ObjectId(id), isFree)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Toggle free error:", error)
    return NextResponse.json({ error: "Failed to update PDF" }, { status: 500 })
  }
}
