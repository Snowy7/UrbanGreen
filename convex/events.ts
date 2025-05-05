import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Query to get all events
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events;
  },
});

export const getById = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    return event;
  },
});

// Mutation to create a new event
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", args);
    return eventId;
  },
});

export const joinEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { eventId, userId } = args;

    // Check if user is already registered using the compound index
    const existingRegistration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event_and_user", (q) => q.eq("eventId", eventId).eq("userId", userId))
      .first();

    if (existingRegistration) {
      return { success: false, message: "You are already registered for this event" };
    }

    // Create new registration
    await ctx.db.insert("eventRegistrations", {
      eventId,
      userId,
      registeredAt: new Date().toISOString(),
    });

    return { success: true, message: "Successfully joined the event" };
  },
});

// Mutation to update an event
export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const event = await ctx.db.get(id);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const getJoinedEvents = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get all registrations for the user
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get the event details for each registration
    const events = await Promise.all(
      registrations.map(async (registration) => {
        const event = await ctx.db.get(registration.eventId);
        return {
          ...event,
          registrationDate: registration.registeredAt,
        };
      })
    );

    return events;
  },
});
