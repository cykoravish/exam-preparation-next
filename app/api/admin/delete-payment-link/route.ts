import { NextResponse } from "next/server"
import { deletePaymentLink } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 })
    }

    await deletePaymentLink(new ObjectId(id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete payment link:", error)
    return NextResponse.json({ error: "Failed to delete payment link" }, { status: 500 })
  }
}
