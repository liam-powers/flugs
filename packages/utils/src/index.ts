import { User } from "@flugs/types";

export function utilsExample(): User {
  const userExample: User = {
    discordID: 1,
    steamID: 1,
    nicknameUpdates: true,
    score: 1,
    globalRankLB: 1,
    globalRankUB: 1,
    avatar: "hi",
  };

  return userExample;
}
