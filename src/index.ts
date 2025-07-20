/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { PrismaClient } from "@prisma/client";
import {
  Client,
  Events,
  GatewayIntentBits,
} from "discord.js";
import { chatInputInteractionCreate } from "./events/interactionCreate.js";
import { messageCreate } from "./events/messageCreate.js";
import { instantiateServer } from "./server/serve.js";
import { logger } from "./utils/logger.js";
import type { Sorielle } from "./interfaces/sorielle.js";

const sorielle: Sorielle = {
  database: new PrismaClient(),
  discord:  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ],
  }),

};

sorielle.discord.once(Events.ClientReady, () => {
  void logger.log(
    "debug",
    `Logged in as ${sorielle.discord.user?.username ?? "unknown"}`,
  );
});

sorielle.discord.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (!interaction.inCachedGuild()) {
      void interaction.reply({
        content: "How did you get here? This command is not available in DMs.",
      });
      return;
    }
    void chatInputInteractionCreate(sorielle, interaction);
  }
});

sorielle.discord.on(Events.MessageCreate, (message) => {
  if (!message.inGuild()) {
    return;
  }
  void messageCreate(sorielle, message);
});

await sorielle.database.$connect();
await sorielle.discord.login(process.env.DISCORD_TOKEN);
instantiateServer();
