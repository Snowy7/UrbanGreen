import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = v.object({
  clerkId: v.string(),

  firstName: v.string(),
  lastName: v.string(),
  
  email: v.string(),
  phone: v.string(),
  
  imageUrl: v.string(),
  pushToken: v.optional(v.string()),

  isAdmin: v.boolean(),
  isActive: v.boolean(),
});

export const GreenSpace = v.object({
  name: v.string(),
  entryPrice: v.number(),
  plantInfo: v.string(),
  workingTime: v.string(),
  workingDays: v.string(),
  description: v.string(),
  location: v.string(),
  facilities: v.string(),
  images: v.array(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const Event = v.object({
  name: v.string(),
  category: v.string(),
  date: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  description: v.string(),
  location: v.string(),
})

export const ContentRequest = v.object({
  // Common fields
  type: v.string(), // "Add Event", "Add Green Space", "Update Green Space"
  userId: v.id("users"),
  status: v.string(), // "pending", "approved", "rejected"
  createdAt: v.string(),
  updatedAt: v.string(),

  // Event fields
  name: v.optional(v.string()),
  category: v.optional(v.string()),
  date: v.optional(v.string()),
  startTime: v.optional(v.string()),
  endTime: v.optional(v.string()),
  eventDescription: v.optional(v.string()),
  eventLocation: v.optional(v.string()),

  // Green Space fields
  greenSpaceName: v.optional(v.string()),
  entryPrice: v.optional(v.number()),
  plantInfo: v.optional(v.string()),
  workingTime: v.optional(v.string()),
  workingDays: v.optional(v.string()),
  greenSpaceDescription: v.optional(v.string()),
  greenSpaceLocation: v.optional(v.string()),
  facilities: v.optional(v.string()),
  images: v.optional(v.array(v.string())),
});

export const Favorite = v.object({
  userId: v.string(),
  greenSpaceId: v.id("greenSpaces"),
  createdAt: v.string(),
});

export default defineSchema({
  users: defineTable(User).index("byClerkId", ["clerkId"]),
  greenSpaces: defineTable(GreenSpace),
  events: defineTable(Event),
  contentRequests: defineTable(ContentRequest),
  eventRegistrations: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    registeredAt: v.string(),
  }).index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),
  favorites: defineTable(Favorite)
    .index("by_user", ["userId"])
    .index("by_greenspace", ["greenSpaceId"])
    .index("by_user_and_greenspace", ["userId", "greenSpaceId"]),
});
