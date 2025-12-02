import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { createPDF } from "@/lib/db-utils"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/^-+|-+$/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const branch = formData.get("branch") as string
    const semester = Number(formData.get("semester"))
    const subject = formData.get("subject") as string
    const isFree = formData.get("isFree") === "true"

    if (!file || !title || !branch || !semester || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const safeBranch = slugify(branch)
    const safeSubject = slugify(subject)
    const safeTitle = slugify(title)

    const publicId = `${safeBranch}-${semester}-${safeSubject}-${Date.now()}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "lu-foet-notes",
            public_id: publicId,
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    // Save to database
    await createPDF({
      title,
      branch,
      semester,
      subject,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      isFree,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
