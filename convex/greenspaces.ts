import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Query to get all green spaces
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const greenSpaces = await ctx.db.query("greenSpaces").collect();
    const greenSpacesWithImages = [];
    for (const greenSpace of greenSpaces) {
      const images = [];
      for (const image of greenSpace.images) {
        const imageUrl = await ctx.storage.getUrl(image);
        images.push(imageUrl);
      }
      greenSpacesWithImages.push({ ...greenSpace, images, imageIds: greenSpace.images });
    }
    return greenSpacesWithImages;
  },
});

// Query to get a single green space by ID
export const getById = query({
  args: {
    id: v.id("greenSpaces"),
  },
  handler: async (ctx, args) => {
    const greenSpace = await ctx.db.get(args.id);

    if (!greenSpace) {
      throw new Error("Green Space not found");
    }

    const images = [];
    for (const image of greenSpace.images) {
      const imageUrl = await ctx.storage.getUrl(image);
      images.push(imageUrl);
    }
    return { ...greenSpace, images };
  },
});

// Mutation to create a new green space
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const greenSpaceId = await ctx.db.insert("greenSpaces", {
      ...args,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return greenSpaceId;
  },
});

// Mutation to update a green space
export const update = mutation({
  args: {
    id: v.id("greenSpaces"),
    name: v.optional(v.string()),
    entryPrice: v.optional(v.number()),
    plantInfo: v.optional(v.string()),
    workingTime: v.optional(v.string()),
    workingDays: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    facilities: v.optional(v.string()),
    images: v.optional(v.array(v.id("_storage"))),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const greenSpace = await ctx.db.get(id);

    if (!greenSpace) {
      throw new Error("Green Space not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return id;
  },
});

// image mutation
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Mutation to delete a green space
export const remove = mutation({
  args: { id: v.id("greenSpaces") },
  handler: async (ctx, args) => {
    const greenSpace = await ctx.db.get(args.id);

    if (!greenSpace) {
      throw new Error("Green Space not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
