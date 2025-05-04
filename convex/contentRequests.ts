import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const contentRequests = await ctx.db.query("contentRequests").collect();
    const contentRequestsWithImages = [];
    for (const request of contentRequests) {
      if (request.images) {
        const images = [];
        for (const image of request.images) {
          const imageUrl = await ctx.storage.getUrl(image);
          images.push(imageUrl);
        }
        contentRequestsWithImages.push({ ...request, images });
      } else {
        contentRequestsWithImages.push(request);
      }
    }
    return contentRequestsWithImages;
  },
});

export const getByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const contentRequests = await ctx.db
      .query("contentRequests")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return contentRequests;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    // Parse the description JSON
    const descriptionData = JSON.parse(args.description);
    
    // Create the content request object based on type
    const contentRequestData = {
      type: args.type,
      userId: user._id,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add fields based on request type
    if (args.type === "Add Event") {
      Object.assign(contentRequestData, {
        name: descriptionData.name,
        category: descriptionData.category,
        date: descriptionData.date,
        startTime: descriptionData.startTime,
        endTime: descriptionData.endTime,
        eventDescription: descriptionData.eventDescription,
        eventLocation: descriptionData.eventLocation,
      });
    } else if (args.type === "Add Green Space") {
      Object.assign(contentRequestData, {
        greenSpaceName: descriptionData.name,
        entryPrice: descriptionData.entryPrice,
        plantInfo: descriptionData.plantInfo,
        workingTime: descriptionData.workingTime,
        workingDays: descriptionData.workingDays,
        greenSpaceDescription: descriptionData.description,
        greenSpaceLocation: descriptionData.location,
        facilities: descriptionData.facilities,
        images: descriptionData.images,
      });
    } else if (args.type === "Update Green Space") {
      Object.assign(contentRequestData, {
        greenSpaceId: descriptionData.greenSpaceId,
        greenSpaceName: descriptionData.name,
        entryPrice: descriptionData.entryPrice,
        plantInfo: descriptionData.plantInfo,
        workingTime: descriptionData.workingTime,
        workingDays: descriptionData.workingDays,
        greenSpaceDescription: descriptionData.description,
        greenSpaceLocation: descriptionData.location,
        facilities: descriptionData.facilities,
        images: descriptionData.images,
      });
    }

    const contentRequestId = await ctx.db.insert("contentRequests", contentRequestData);
    return contentRequestId;
  },
});

export const update = mutation({
  args: {
    id: v.id("contentRequests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const contentRequest = await ctx.db.get(id);

    if (!contentRequest) {
      throw new Error("Content request not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return id;
  },
}); 