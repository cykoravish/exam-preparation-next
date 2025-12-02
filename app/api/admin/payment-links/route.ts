import { NextResponse } from "next/server"
import { getAllPaymentLinks } from "@/lib/db-utils"

export async function GET() {
  try {
    const links = await getAllPaymentLinks()
    return NextResponse.json({ links })
  } catch (error) {
    console.error("Failed to fetch payment links:", error)
    return NextResponse.json({ error: "Failed to fetch payment links" }, { status: 500 })
  }
}
