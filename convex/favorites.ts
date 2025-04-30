import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";

export const getByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get the actual green spaces and events
    const greenSpaces = await Promise.all(
      favorites.map(async (f) => {
        const space = await ctx.db.get(f.greenSpaceId);
        return space;
      })
    );

    return greenSpaces.filter(Boolean);
  },
});

export const add = mutation({
  args: {
    greenSpaceId: v.id("greenSpaces"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("greenSpaceId"), args.greenSpaceId))
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const favoriteId = await ctx.db.insert("favorites", {
      userId: user._id,
      greenSpaceId: args.greenSpaceId,
      createdAt: new Date().toISOString(),
    });

    return favoriteId;
  },
});

export const remove = mutation({
  args: {
    greenSpaceId: v.id("greenSpaces"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const favorite = await ctx.db
      .query("favorites")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("greenSpaceId"), args.greenSpaceId))
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }

    return favorite?._id;
  },
});

export const getFavorites = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get all favorites for the user
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get the green space details for each favorite
    const greenSpaces = await Promise.all(
      favorites.map(async (favorite) => {
        const greenSpace = await ctx.db.get(favorite.greenSpaceId);

        // get the image from the green space
        const images = [];
        for (const image of greenSpace.images) {
          const imageUrl = await ctx.storage.getUrl(image);
          images.push(imageUrl);
        }

        const { images: _, ...rest } = greenSpace;

        return {
          ...rest,
          images,
          favoritedAt: favorite.createdAt,
        };
      })
    );

    return greenSpaces.filter(Boolean);
  },
});

export const toggleFavorite = mutation({
  args: {
    greenSpaceId: v.id("greenSpaces"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { greenSpaceId, userId } = args;

    // Check if already favorited
    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_greenspace", (q) =>
        q.eq("userId", userId).eq("greenSpaceId", greenSpaceId)
      )
      .first();

    if (existingFavorite) {
      // Remove favorite
      await ctx.db.delete(existingFavorite._id);
      return { success: true, message: "Removed from favorites" };
    }

    // Add favorite
    await ctx.db.insert("favorites", {
      userId,
      greenSpaceId,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "Added to favorites" };
  },
});

export const isFavorited = query({
  args: {
    greenSpaceId: v.id("greenSpaces"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { greenSpaceId, userId } = args;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_greenspace", (q) =>
        q.eq("userId", userId).eq("greenSpaceId", greenSpaceId)
      )
      .first();

    return !!favorite;
  },
});
