import clientPromise from "./mongodb"
import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  isPremium: boolean
  createdAt: Date
}

export interface PDF {
  _id?: ObjectId
  title: string
  branch: string
  semester: number
  subject: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  isFree: boolean
  uploadedAt: Date
}

export interface PaymentRequest {
  _id?: ObjectId
  userId: ObjectId
  userEmail: string
  userName: string
  status: "pending" | "approved" | "rejected"
  requestedAt: Date
  processedAt?: Date
}

export interface PaymentLink {
  _id?: ObjectId
  razorpayLink: string
  isUsed: boolean
  usedBy?: string // user email
  usedAt?: Date
  createdAt: Date
}

export interface ActivationRequest {
  _id?: ObjectId
  userId: ObjectId
  userEmail: string
  userName: string
  linkId: ObjectId
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  processedAt?: Date
}

export async function getDatabase() {
  const client = await clientPromise
  return client.db("lu-foet-notes")
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ email })
}

export async function createUser(user: Omit<User, "_id" | "createdAt">) {
  const db = await getDatabase()
  return db.collection<User>("users").insertOne({
    ...user,
    createdAt: new Date(),
  })
}

export async function updateUserPremium(userId: ObjectId) {
  const db = await getDatabase()
  return db.collection<User>("users").updateOne({ _id: userId }, { $set: { isPremium: true } })
}

export async function getPDFs(branch: string, semester: number, subject: string) {
  const db = await getDatabase()
  return db.collection<PDF>("pdfs").find({ branch, semester, subject }).sort({ uploadedAt: -1 }).toArray()
}

export async function getAllPDFs() {
  const db = await getDatabase()
  return db.collection<PDF>("pdfs").find().sort({ uploadedAt: -1 }).toArray()
}

export async function createPDF(pdf: Omit<PDF, "_id" | "uploadedAt">) {
  const db = await getDatabase()
  return db.collection<PDF>("pdfs").insertOne({
    ...pdf,
    uploadedAt: new Date(),
  })
}

export async function deletePDF(id: ObjectId) {
  const db = await getDatabase()
  return db.collection<PDF>("pdfs").deleteOne({ _id: id })
}

export async function updatePDFFreeStatus(id: ObjectId, isFree: boolean) {
  const db = await getDatabase()
  return db.collection<PDF>("pdfs").updateOne({ _id: id }, { $set: { isFree } })
}

export async function createPaymentLink(razorpayLink: string) {
  const db = await getDatabase()
  return db.collection<PaymentLink>("payment_links").insertOne({
    razorpayLink,
    isUsed: false,
    createdAt: new Date(),
  })
}

export async function getAllPaymentLinks() {
  const db = await getDatabase()
  return db.collection<PaymentLink>("payment_links").find().sort({ createdAt: -1 }).toArray()
}

export async function getAvailablePaymentLink() {
  const db = await getDatabase()
  return db.collection<PaymentLink>("payment_links").findOne({ isUsed: false })
}

export async function assignPaymentLink(linkId: ObjectId, userEmail: string) {
  const db = await getDatabase()
  return db
    .collection<PaymentLink>("payment_links")
    .updateOne({ _id: linkId }, { $set: { isUsed: true, usedBy: userEmail, usedAt: new Date() } })
}

export async function getAssignedPaymentLink(userEmail: string) {
  const db = await getDatabase()
  return db.collection<PaymentLink>("payment_links").findOne({ usedBy: userEmail })
}

export async function deletePaymentLink(id: ObjectId) {
  const db = await getDatabase()
  return db.collection<PaymentLink>("payment_links").deleteOne({ _id: id })
}

export async function createActivationRequest(userId: ObjectId, userEmail: string, userName: string, linkId: ObjectId) {
  const db = await getDatabase()
  return db.collection<ActivationRequest>("activation_requests").insertOne({
    userId,
    userEmail,
    userName,
    linkId,
    status: "pending",
    createdAt: new Date(),
  })
}

export async function getPendingActivationRequests() {
  const db = await getDatabase()
  return db
    .collection<ActivationRequest>("activation_requests")
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getAllActivationRequests() {
  const db = await getDatabase()
  return db.collection<ActivationRequest>("activation_requests").find().sort({ createdAt: -1 }).toArray()
}

export async function approveActivationRequest(requestId: ObjectId, userId: ObjectId) {
  const db = await getDatabase()

  // Update user to premium
  await db.collection<User>("users").updateOne({ _id: userId }, { $set: { isPremium: true } })

  // Mark request as approved
  await db
    .collection<ActivationRequest>("activation_requests")
    .updateOne({ _id: requestId }, { $set: { status: "approved", processedAt: new Date() } })
}

export async function rejectActivationRequest(requestId: ObjectId) {
  const db = await getDatabase()
  return db
    .collection<ActivationRequest>("activation_requests")
    .updateOne({ _id: requestId }, { $set: { status: "rejected", processedAt: new Date() } })
}
