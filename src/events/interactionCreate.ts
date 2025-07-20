/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { about } from "../commands/about.js";
import { config } from "../commands/config.js";
import type { Command } from "../interfaces/command.js";
import type { Sorielle } from "../interfaces/sorielle.js";
import type { ChatInputCommandInteraction } from "discord.js";

const handlers: { _default: Command } & Record<string, Command> = {
  _default: async(_, interaction): Promise<void> => {
    await interaction.reply({
      content: `Unknown command: ${interaction.commandName}`,
    });
  },
  about:  about,
  configure: config,
};

/**
 * Processes a slash command.
 * @param sorielle - Sorielle's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
const chatInputInteractionCreate = async(
  sorielle: Sorielle,
  interaction: ChatInputCommandInteraction<"cached">,
): Promise<void> => {
  const name = interaction.commandName;
  // eslint-disable-next-line no-underscore-dangle -- We use _default as a fallback handler.
  const handler = handlers[name] ?? handlers._default;
  await handler(sorielle, interaction);
};

export { chatInputInteractionCreate };
