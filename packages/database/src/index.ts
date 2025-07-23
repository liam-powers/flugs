// import { User } from "@flugs/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

export const flugsConvexAPI = api;

// dotenv.config({ path: ".env.local" });

// const client = new ConvexHttpClient(process.env["CONVEX_URL"]!);

// console.log("querying something...");
// client.query(api.queries.getAllUsers).then(console.log);
// console.log("queried!");

// console.log("getting two users by discordID...");
// client.query(api.queries.getUsersByDiscordIDs, {
// 	discordIDs: [123456789012345678, 345678901234567890],
// }).then(console.log);

// console.log("about to update user");
// client.mutation(api.mutations.updateUser, {
// 	discordID: 123456789012345678,
// 	score: 9999,
// });
