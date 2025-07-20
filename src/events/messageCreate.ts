/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { checkGuildEntitlement } from "../utils/checkEntitlement.js";
import type { Sorielle } from "../interfaces/sorielle.js";
import type { Message } from "discord.js";

/**
 * Processes a slash command.
 * @param sorielle - Sorielle's Discord instance.
 * @param message - The message payload from Discord.
 */
const messageCreate = async(
  sorielle: Sorielle,
  message: Message<true>,
): Promise<void> => {
  const isEntitled = await checkGuildEntitlement(sorielle, message.guild);
  if (!isEntitled) {
    return;
  }
  const serverRecord = await sorielle.database.vents.findUnique({
    where: {
      serverId: message.guild.id,
    },
  });
  if (!serverRecord) {
    return;
  }
  if (serverRecord.channelId !== message.channel.id) {
    return;
  }
  setTimeout(() => {
    void message.delete().catch(() => {
      return null;
    });
  }, serverRecord.ttl * 1000);
};

export { messageCreate };
