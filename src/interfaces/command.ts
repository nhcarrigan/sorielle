/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import type { Sorielle } from "./sorielle.js";
import type { ChatInputCommandInteraction } from "discord.js";

export type Command = (
  sorielle: Sorielle,
  interaction: ChatInputCommandInteraction<"cached">
)=> Promise<void>;
