import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { ObjectId } from "mongodb"
import { getDatabase, deletePDF } from "@/lib/db-utils"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Get PDF info to delete from Cloudinary
    const db = await getDatabase()
    const pdf = await db.collection("pdfs").findOne({ _id: new ObjectId(id) })

    if (pdf && pdf.cloudinaryPublicId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(pdf.cloudinaryPublicId, {
        resource_type: "raw",
      })
    }

    // Delete from database
    await deletePDF(new ObjectId(id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete PDF" }, { status: 500 })
  }
}
