// Mock data for the application

export type ItemStatus = "lost" | "found" | "claimed" | "resolved"
export type ClaimStatus = "pending" | "approved" | "rejected"

export interface Item {
  id: string
  title: string
  description: string
  category: string
  status: ItemStatus
  location: string
  date: string
  createdAt: string
  reportedBy: string
  images: string[]
  contactInfo?: string
}

export interface Claim {
  id: string
  itemId: string
  itemTitle: string
  claimantId: string
  claimantName: string
  status: ClaimStatus
  description: string
  createdAt: string
  proofDescription?: string
}

export interface User {
  id: string
  name: string
  email: string
  studentId: string
  regionalCenter: string
  avatar?: string
  role: "user" | "admin"
}

export const categories = [
  "Electronics",
  "Accessories",
  "Bags",
  "Documents",
  "Keys",
  "Clothing",
  "Books",
  "Other",
]

export const locations = [
  "Main Library, Block A",
  "Main Library, Block B",
  "Cafeteria, Ground Floor",
  "Exam Hall 1",
  "Exam Hall 2",
  "Exam Hall 3",
  "Sports Complex",
  "Administrative Block",
  "Computer Lab",
  "Parking Area",
  "Bus Stand",
  "Hostel Block A",
  "Hostel Block B",
]

export const currentUser: User = {
  id: "user-1",
  name: "Rahul Verma",
  email: "rahul.verma@ignou.ac.in",
  studentId: "2024123456",
  regionalCenter: "Delhi RC",
  role: "user",
}

export const mockItems: Item[] = [
  {
    id: "item-1",
    title: "Black Leather Wallet",
    description: "A black leather wallet with multiple card slots. Contains some cash and ID cards. Brand appears to be Tommy Hilfiger.",
    category: "Accessories",
    status: "found",
    location: "Main Library, Block A",
    date: "2025-01-22",
    createdAt: "2025-01-22T10:30:00Z",
    reportedBy: "user-2",
    images: [],
  },
  {
    id: "item-2",
    title: "Samsung Galaxy Phone",
    description: "Samsung Galaxy S23 in black color with a clear case. Found on a cafeteria table. Phone is locked.",
    category: "Electronics",
    status: "found",
    location: "Cafeteria, Ground Floor",
    date: "2025-01-22",
    createdAt: "2025-01-22T08:15:00Z",
    reportedBy: "user-3",
    images: [],
  },
  {
    id: "item-3",
    title: "Blue Backpack with Books",
    description: "Blue Wildcraft backpack containing MBA textbooks and notebooks. Found after exam.",
    category: "Bags",
    status: "found",
    location: "Exam Hall 3",
    date: "2025-01-21",
    createdAt: "2025-01-21T16:45:00Z",
    reportedBy: "user-4",
    images: [],
  },
  {
    id: "item-4",
    title: "Silver Wristwatch",
    description: "Titan silver wristwatch with leather strap. Found near the sports complex entrance.",
    category: "Accessories",
    status: "found",
    location: "Sports Complex",
    date: "2025-01-21",
    createdAt: "2025-01-21T14:20:00Z",
    reportedBy: "user-5",
    images: [],
  },
  {
    id: "item-5",
    title: "Laptop Charger (Dell)",
    description: "Dell laptop charger 65W. Black color with standard plug.",
    category: "Electronics",
    status: "found",
    location: "Computer Lab",
    date: "2025-01-20",
    createdAt: "2025-01-20T11:00:00Z",
    reportedBy: "user-6",
    images: [],
  },
  {
    id: "item-6",
    title: "Student ID Card",
    description: "IGNOU student ID card. Name visible: Amit Kumar, Enrollment: 2023XXXXXX",
    category: "Documents",
    status: "claimed",
    location: "Administrative Block",
    date: "2025-01-20",
    createdAt: "2025-01-20T09:30:00Z",
    reportedBy: "user-7",
    images: [],
  },
  {
    id: "item-7",
    title: "House Keys with Keychain",
    description: "Set of 3 keys on a red keychain with a small teddy bear charm.",
    category: "Keys",
    status: "found",
    location: "Parking Area",
    date: "2025-01-19",
    createdAt: "2025-01-19T17:30:00Z",
    reportedBy: "user-8",
    images: [],
  },
  {
    id: "item-8",
    title: "Prescription Glasses",
    description: "Black frame prescription glasses in a brown case. Brand: Ray-Ban.",
    category: "Accessories",
    status: "resolved",
    location: "Main Library, Block B",
    date: "2025-01-18",
    createdAt: "2025-01-18T13:15:00Z",
    reportedBy: "user-9",
    images: [],
  },
]

export const mockUserItems: Item[] = [
  {
    id: "user-item-1",
    title: "Red Notebook",
    description: "Red spiral notebook with handwritten notes for BCA course. Very important exam notes inside.",
    category: "Books",
    status: "lost",
    location: "Main Library, Block A",
    date: "2025-01-21",
    createdAt: "2025-01-21T14:00:00Z",
    reportedBy: "user-1",
    images: [],
    contactInfo: "rahul.verma@ignou.ac.in",
  },
  {
    id: "user-item-2",
    title: "Wireless Earbuds",
    description: "Black JBL wireless earbuds in charging case. Lost somewhere between library and cafeteria.",
    category: "Electronics",
    status: "lost",
    location: "Cafeteria, Ground Floor",
    date: "2025-01-20",
    createdAt: "2025-01-20T16:30:00Z",
    reportedBy: "user-1",
    images: [],
    contactInfo: "rahul.verma@ignou.ac.in",
  },
]

export const mockClaims: Claim[] = [
  {
    id: "claim-1",
    itemId: "item-1",
    itemTitle: "Black Leather Wallet",
    claimantId: "user-1",
    claimantName: "Rahul Verma",
    status: "pending",
    description: "This is my wallet. I lost it yesterday while studying in the library. It has my PAN card and driving license inside.",
    createdAt: "2025-01-23T09:00:00Z",
    proofDescription: "Can provide details of cards inside and approximate cash amount.",
  },
  {
    id: "claim-2",
    itemId: "item-5",
    itemTitle: "Laptop Charger (Dell)",
    claimantId: "user-1",
    claimantName: "Rahul Verma",
    status: "approved",
    description: "This is my Dell laptop charger. I use a Dell Inspiron 15 laptop.",
    createdAt: "2025-01-21T10:00:00Z",
    proofDescription: "Can show matching laptop model.",
  },
]

export function getItemById(id: string): Item | undefined {
  return [...mockItems, ...mockUserItems].find((item) => item.id === id)
}

export function getItemsByStatus(status: ItemStatus): Item[] {
  return mockItems.filter((item) => item.status === status)
}

export function getUserItems(userId: string): Item[] {
  return mockUserItems.filter((item) => item.reportedBy === userId)
}

export function getUserClaims(userId: string): Claim[] {
  return mockClaims.filter((claim) => claim.claimantId === userId)
}
