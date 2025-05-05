import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";

export const getByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const joinedEvents = await ctx.db
      .query("eventRegistrations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get the actual events
    const events = await Promise.all(
      joinedEvents.map(async (joined) => {
        const event = await ctx.db.get(joined.eventId);
        return event;
      })
    );

    return events.filter(Boolean);
  },
});

export const join = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if already joined
    const existing = await ctx.db
      .query("eventRegistrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("eventId"), args.eventId)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const joinedEventId = await ctx.db.insert("eventRegistrations", {
      userId: user._id,
      eventId: args.eventId,
      registeredAt: new Date().toISOString(),
    });

    return joinedEventId;
  },
});

export const leave = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const joinedEvent = await ctx.db
      .query("eventRegistrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("eventId"), args.eventId)
        )
      )
      .first();

    if (joinedEvent) {
      await ctx.db.delete(joinedEvent._id);
    }

    return joinedEvent?._id;
  },
}); 