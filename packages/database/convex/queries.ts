import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAllUsers = query({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    return allUsers;
  },
});

export const getUsersByDiscordIDs = query({
  args: { discordIDs: v.array(v.number()) },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.discordIDs.map((discordID) =>
        ctx.db
          .query("users")
          .withIndex("by_discordID", (q) => q.eq("discordID", discordID))
          .first()
      ),
    );
    return users.filter((user) => user !== null);
  },
});
