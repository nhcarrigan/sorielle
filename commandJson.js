import { ApplicationIntegrationType, ChannelType, InteractionContextType, SlashCommandBuilder } from "discord.js";

const about = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Get information about this application.")
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]);

const configure = new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Change your venting channel and timeout.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addChannelOption((option) =>
        option
            .setName("channel")
            .setDescription("The channel to use for venting.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
    .addIntegerOption((option) =>
        option
            .setName("timeout")
            .setDescription("The number of seconds to wait before deleting messages.")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(60 * 60 * 24 * 7));

console.log(JSON.stringify([
    about.toJSON(),
    configure.toJSON()
]));