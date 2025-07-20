/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { sendUnentitledResponse } from "../modules/sendUnentitledResponse.js";
import { checkGuildEntitlement } from "../utils/checkEntitlement.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/config` command interaction.
 * @param _sorielle - Sorielle's Discord instance (unused).
 * @param interaction - The command interaction payload from Discord.
 */

/**
 * Handles the `/config` command interaction.
 * @param sorielle - Sorielle's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const config: Command = async(sorielle, interaction) => {
  try {
    const isEntitled = await checkGuildEntitlement(sorielle, interaction.guild);
    if (!isEntitled) {
      await sendUnentitledResponse(interaction);
      return;
    }
    await interaction.deferReply({
      flags: [ MessageFlags.Ephemeral ],
    });
    const channel = interaction.options.getChannel("channel", true, [
      ChannelType.GuildText,
    ]);
    const permissions = interaction.guild.members.me?.permissionsIn(channel);
    const hasAllPermissions
      = permissions !== undefined
      && permissions.has(PermissionFlagsBits.ManageMessages)
      && permissions.has(PermissionFlagsBits.ViewChannel)
      && permissions.has(PermissionFlagsBits.ReadMessageHistory);
    if (!hasAllPermissions) {
      await interaction.editReply({
        content:
          // eslint-disable-next-line stylistic/max-len -- Big boi string.
          "I do not have permission to manage messages in that channel. Please ensure I have the `Manage Messages`, `View Channel`, and `Read Message History` permissions.",
      });
      return;
    }
    const seconds = interaction.options.getInteger("timeout", true);
    await sorielle.database.vents.upsert({
      create: {
        channelId: channel.id,
        serverId:  interaction.guild.id,
        ttl:       seconds,
      },
      update: {
        channelId: channel.id,
        ttl:       seconds,
      },
      where: {
        serverId: interaction.guild.id,
      },
    });
    const components = [
      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Messages in <#${
            channel.id
          }> will be deleted after ${seconds.toLocaleString("en-GB")} seconds.`,
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
    await interaction.editReply({
      components: components,
      flags:      [ MessageFlags.IsComponentsV2 ],
    });
  } catch (error) {
    await errorHandler(error, "config command");
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- We want to ensure the interaction is replied to.
    interaction.replied
      ? await interaction.editReply({
        content:
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "An error occurred while processing your request. Please try again later.",
      })
      : await interaction.reply({
        content:
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "An error occurred while processing your request. Please try again later.",
        flags: [ MessageFlags.Ephemeral ],
      });
  }
};
