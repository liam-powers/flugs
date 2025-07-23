import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

async function deployCommands() {
  const clientid = process.env.DISCORD_CLIENT_ID;
  const token = process.env.DISCORD_TOKEN;
  if (!clientid || !token) {
    throw new Error("Couldn't find .env variables for deploy-commands.ts!");
  }

  // Get __dirname equivalent for ES modules
  const require = createRequire(import.meta.url);
  const __dirname = path.dirname(
    path.dirname(require.resolve("./deployCommands.ts")),
  );

  const commands = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
      file.endsWith(".ts")
    );
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(token);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      // The put method fully refreshes all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationCommands(clientid),
        { body: commands },
      ) as any[];

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  })();
}

// Execute deployCommands function with proper error handling
deployCommands().catch((error) => {
  console.error("Failed to deploy commands:", error);
  process.exit(1);
});
