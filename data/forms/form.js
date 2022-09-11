const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");
const data = require("../config");

/**
 *
 * @param {Client} client
 * @param {data} data
 */
module.exports = async (client, data) => {
  // code

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      switch (interaction.commandName) {
        // HELP COMMAND
        case "help":
          {
            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Help!")
                  .setColor("#00FFFF")
                  .setFields([
                    { name: "Info Commands", value: "`/ping`, `/help`" },
                    { name: "Application Commands", value: "`/setup`" },
                    {
                      name: "Credits",
                      value: "[Made by Mahmodul Hassan]",
                    },
                  ]),
              ],
              ephemeral: true,
            });
          }
          break;

        // HELP COMMAND END
        case "setup":
          {
            let applyChannel = interaction.guild.channels.cache.get(
              data.applyChannel
            );
            if (!applyChannel) return;

            let btnrow = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("ap_apply")
                .setLabel("Apply")
                .setEmoji("📝"),
              new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("ap_help")
                .setLabel("Help!")
                .setEmoji("❓"),
            ]);
            applyChannel.send({
              embeds: [
                new MessageEmbed()
                  .setColor("#00FFFF")
                  .setTitle(`Leave Application Form`)
                  .setDescription(
                    "Click on the below apply button to fill the leave application form"
                  )
                  
                  .setFooter("MADE BY Mahmodul Hassan discord bot!"),
              ],
              components: [btnrow],
            });

            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#00FFFF")
                  .setTitle("✅ Application Sucess")
                  .setDescription(
                    `setup has been sucesfully completed in ${applyChannel} `
                  ),
              ],
            });
          }
          break;
        case "ping":
          {
            interaction.reply({
              content: `pong :: ${client.ws.ping}`,
              ephemeral: true,
            });
          }
          break;

        default:
          interaction.reply({
            content: `command not found ${interaction.commandName}`,
            ephemeral: true,
          });
          break;
      }
    }

    // for buttons
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "ap_help":
          {
            interaction.reply({
              embeds: [
                  new MessageEmbed()
                  .setTitle('How to apply?')
                  .setColor('#00FFFF')
                  .setDescription('Click on the above apply button and fill the form.')
              ],
              ephemeral: true,
            });
          }
          break;

        case "ap_apply":
          {
            let application_modal = new Modal()
              .setTitle(`Application System`)
              .setCustomId(`application_modal`);

            const user_name = new TextInputComponent()
              .setCustomId("ap_username")
              .setLabel(`What is your name ?`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(50)
              .setRequired(true)
              .setPlaceholder(`Your Name`)
              .setStyle("SHORT");
  
            const user_game_name = new TextInputComponent()
              .setCustomId("ap_usergamename")
              .setLabel(`What is your in game name ?`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(50)
              .setRequired(true)
              .setPlaceholder(`Your In Game Name`)
              .setStyle("SHORT");
              
            const user_game_uid = new TextInputComponent()
              .setCustomId("ap_usergameuid")
              .setLabel(`Give your game uid code ?`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(50)
              .setRequired(true)
              .setPlaceholder(`Your Game UID CODE ?`)
              .setStyle("SHORT");

            const user_why = new TextInputComponent()
              .setCustomId("ap_userwhy")
              .setLabel(`Why do you want to leave ?`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(100)
              .setRequired(true)
              .setPlaceholder(`Reason`)
              .setStyle("SHORT");

            let row_username = new MessageActionRow().addComponents(user_name);
            let row_usergamename = new MessageActionRow().addComponents(user_game_name);
            let row_usergameuid = new MessageActionRow().addComponents(user_game_uid);
            let row_userwhy = new MessageActionRow().addComponents(user_why);
            application_modal.addComponents(row_username, row_usergamename, row_usergameuid, row_userwhy);

            await interaction.showModal(application_modal);
          }
          break;
        case "ap_accept":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("GREEN");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user
              .send(`Your application has been approved by **${interaction.user.tag}**`)
              .catch((e) => {});

            await interaction.member.roles
              .add(data.acceptedRole)
              .catch((e) => {});
            await interaction.member.roles
              .remove(data.waitingRole)
              .catch((e) => {});
          }
          break;
        case "ap_reject":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("RED");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user
              .send(`Your application has been rejected by ${interaction.user.tag}`)
              .catch((e) => {});
            await interaction.member.roles
              .remove(data.waitingRole)
              .catch((e) => {});
          }
          break;
        default:
          break;
      }
    }

    // for modals
    if (interaction.isModalSubmit()) {
      let user_name = interaction.fields.getTextInputValue("ap_username");
      let user_game_name = interaction.fields.getTextInputValue("ap_usergamename");
      let user_game_uid = interaction.fields.getTextInputValue("ap_usergameuid");
      let user_why = interaction.fields.getTextInputValue("ap_userwhy");   

      let reviewChannel = interaction.guild.channels.cache.get(
        data.reviewChannel
      );
      if (!reviewChannel) return;
      let btnrow = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle("SUCCESS")
          .setCustomId("ap_accept")
          .setLabel("Accpet")
          .setEmoji("✅"),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("ap_reject")
          .setLabel("Reject")
          .setEmoji("❌"),
      ]);

      reviewChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#00FFFF")
            .setTitle(`Application From ${interaction.user.tag}`)
            .setDescription(
              `${interaction.user} <t:${Math.floor(Date.now() / 1000)}:R>`
            )
            .addFields([
              {
                name: `What is your name ?`,
                value: `> ${user_name}`,
              },
              {
                name: `What is your in game name ?`,
                value: `> ${user_game_name}`,
              },
              {
                name: `Give your game uid code ?`,
                value: `> ${user_game_uid}`,
              },
              {
                name: `Why do you want to leave ?`,
                value: `> ${user_why}`,
              },
            ])
            .setFooter({
              text: `${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
        components: [btnrow],
      });

      interaction.reply({
        content: `your application send for review`,
        ephemeral: true,
      });

      await interaction.member.roles.add(data.waitingRole).catch((e) => {});
    }
  });
};
