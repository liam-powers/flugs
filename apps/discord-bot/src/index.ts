import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import { createRequire } from "module";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Extend the Client type to include custom properties
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
    cooldowns: Collection<string, any>;
  }
}

// Get __dirname equivalent for ES modules
const require = createRequire(import.meta.url);
const __dirname = path.dirname(require.resolve("./index.ts"));

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.log({ token });
    throw new Error("main.ts for bot: Couldn't find DISCORD_TOKEN!");
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.cooldowns = new Collection();
  client.commands = new Collection();

  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
      file.endsWith(".ts")
    );
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs.readdirSync(eventsPath).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  client.login(token);
  console.log("Client logged in!");
}

// Execute main function with proper error handling
main().catch((error) => {
  console.error("Failed to start the bot:", error);
  process.exit(1);
});
