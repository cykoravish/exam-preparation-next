import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getDatabase } from "@/lib/db-utils"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const db = await getDatabase()
    const userDoc = await db.collection("users").findOne({ _id: new ObjectId(user.id) })

    const purchasedPDFs = userDoc?.purchasedPDFs || []

    // Convert ObjectIds to strings for JSON serialization
    const purchasedPDFIds = purchasedPDFs.map((id: ObjectId) => id.toString())

    return NextResponse.json({ purchasedPDFs: purchasedPDFIds })
  } catch (error) {
    console.error("Failed to fetch purchased PDFs:", error)
    return NextResponse.json({ error: "Failed to fetch purchased PDFs" }, { status: 500 })
  }
}
