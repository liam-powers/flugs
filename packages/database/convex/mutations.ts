import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addUser = mutation({
  args: {
    discordID: v.number(),
    steamID: v.number(),
    nicknameUpdates: v.boolean(),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("users", {
      discordID: args.discordID,
      steamID: args.steamID,
      nicknameUpdates: args.nicknameUpdates,
      avatar: args.avatar,
    });

    return taskId;
  },
});

export const updateUser = mutation({
  args: {
    discordID: v.number(),
    steamID: v.optional(v.number()),
    nicknameUpdates: v.optional(v.boolean()),
    avatar: v.optional(v.string()),
    score: v.optional(v.number()),
    globalRankLB: v.optional(v.number()),
    globalRankUB: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // need GenericId for updating
    const user = await ctx.db
      .query("users")
      .withIndex("by_discordID", (q) => q.eq("discordID", args.discordID))
      .first();

    if (user) {
      // Extract discordID from args and create update object with remaining fields
      const { discordID, ...updateFields } = args;

      // Only include fields that were actually provided (not undefined)
      const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) =>
          value !== undefined
        ),
      );

      await ctx.db.patch(user._id, fieldsToUpdate);
    }
  },
});

export const deleteUser = mutation({
  args: { discordID: v.number() },
  handler: async (ctx, args) => {
    // need GenericId for deletion
    const user = await ctx.db
      .query("users")
      .withIndex("by_discordID", (q) => q.eq("discordID", args.discordID))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});
