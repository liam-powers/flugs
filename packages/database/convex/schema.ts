import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		discordID: v.number(),
		steamID: v.number(),
		nicknameUpdates: v.boolean(),
		avatar: v.string(),
		score: v.optional(v.number()),
		globalRankLB: v.optional(v.number()),
		globalRankUB: v.optional(v.number()),
	}).index("by_discordID", ["discordID"]),
});
