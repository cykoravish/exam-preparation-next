import { NextResponse } from "next/server"
import { getAllActivationRequests } from "@/lib/db-utils"

export async function GET() {
  try {
    const requests = await getAllActivationRequests()

    const serializedRequests = requests.map((req) => {
      const serialized = {
        _id: req._id?.toString() || "",
        userId: req.userId?.toString() || "",
        userEmail: req.userEmail || "",
        userName: req.userName || "",
        linkId: req.linkId?.toString() || "",
        status: req.status,
        createdAt: req.createdAt?.toISOString(),
        processedAt: req.processedAt?.toISOString(),
      }
      return serialized
    })

    return NextResponse.json({ requests: serializedRequests })
  } catch (error) {
    console.error("[v0] Failed to fetch activation requests:", error)
    return NextResponse.json({ error: "Failed to fetch activation requests" }, { status: 500 })
  }
}
