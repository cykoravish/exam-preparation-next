import { NextResponse } from "next/server"
import { getAllPDFs } from "@/lib/db-utils"

export async function GET() {
  try {
    const pdfs = await getAllPDFs()
    return NextResponse.json({ pdfs })
  } catch (error) {
    console.error("[v0] Failed to fetch all PDFs:", error)
    return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 })
  }
}
