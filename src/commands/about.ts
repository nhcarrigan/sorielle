/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} from "discord.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/about` command interaction.
 * @param _sorielle - Sorielle's Discord instance (unused).
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const about: Command = async(_sorielle, interaction) => {
  try {
    const components = [
      new ContainerBuilder().
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("# About Sorielle"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(

            "Hi there~! I am Sorielle, a bot that shares ASCII art.",
          ),
        ).
        addSeparatorComponents(
          new SeparatorBuilder().
            setSpacing(SeparatorSpacingSize.Small).
            setDivider(true),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## What can I do?"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "To get started, you will need to purchase the server subscription from my Discord store. Then you, or any of your server admins, can configure a venting channel and a timeout. Once your settings are configured, any message that gets sent in your specified venting channel will be automatically deleted after the timeout period.",
          ),
        ).
        addSeparatorComponents(
          new SeparatorBuilder().
            setSpacing(SeparatorSpacingSize.Small).
            setDivider(true),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## What if I need help?"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "My deepest apologies if I have made a mistake! Please reach out to us in our Discord server or on the forum, and we will do our best to assist you.",
          ),
        ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().
          setStyle(ButtonStyle.Link).
          setLabel("Discord Server").
          setURL("https://chat.nhcarrigan.com"),
        new ButtonBuilder().
          setStyle(ButtonStyle.Link).
          setLabel("Forum").
          setURL("https://forum.nhcarrigan.com"),
      ),
    ];
    await interaction.reply({
      components: components,
      flags:      MessageFlags.IsComponentsV2,
    });
  } catch (error) {
    await errorHandler(error, "about command");
    await interaction.reply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
