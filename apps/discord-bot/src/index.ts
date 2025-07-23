import { User } from "@flugs/types";
import { databaseExample } from "@flugs/database";
import { utilsExample } from "@flugs/utils";

function main() {
  console.log("Discord bot starting...");

  const databaseExampleUser: User = databaseExample();
  const utilsExampleUser: User = utilsExample();

  console.log("databaseExampleUser:", databaseExampleUser);
  console.log("utilsExampleUser:", utilsExampleUser);
  console.log("All packages working correctly!");
}

main();
