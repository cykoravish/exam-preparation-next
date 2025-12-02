import { cookies } from "next/headers"
import { getUserByEmail } from "./db-utils"

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function setAuthCookie(userId: string, email: string, name: string) {
  const cookieStore = await cookies()
  const userData = JSON.stringify({ userId, email, name })
  cookieStore.set("auth", userData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth")
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth")

  if (!authCookie) return null

  try {
    const userData = JSON.parse(authCookie.value)
    const user = await getUserByEmail(userData.email)

    if (!user) return null

    return {
      _id: user._id!.toString(),
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      isPremium: user.isPremium,
    }
  } catch (error) {
    return null
  }
}

export function checkAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}
