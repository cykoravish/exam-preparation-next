import { type NextRequest, NextResponse } from "next/server"
import { getPDFs } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get("branch")
    const semester = searchParams.get("semester")
    const subject = searchParams.get("subject")

    if (!branch || !semester || !subject) {
      return NextResponse.json({ error: "Branch, semester, and subject are required" }, { status: 400 })
    }

    const pdfs = await getPDFs(branch, Number(semester), subject)

    return NextResponse.json({ pdfs })
  } catch (error) {
    console.error("[v0] Failed to fetch PDFs:", error)
    return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 })
  }
}
