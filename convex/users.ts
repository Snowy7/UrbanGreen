import { v } from "convex/values";
import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getAllUsers = query({
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    imageUrl: v.string(),
    isAdmin: v.boolean(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log("~ createUser ~ args:", args);
    const userId = await ctx.db.insert("users", {
      ...args,
    });
    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    return user;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const user = await ctx.db.get(id);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// IDENTITY CHECK
// https://docs.convex.dev/auth/database-auth#mutations-for-upserting-and-deleting-users

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", externalId))
    .unique();
}
