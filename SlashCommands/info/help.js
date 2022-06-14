const {
  Client,
  ContextMenuInteraction,
  MessageEmbed,
  MessageSelectMenu,
  Permissions
} = require("discord.js");
const {
  readdirSync
} = require("fs");
const Delay = require("../../Client/delay");

module.exports = {
  name: "help",
  description: "Show All Commands",
  aliases: ["aide"],
  options: [{
    name: "nom",
    description: "nom de la commande",
    type: "STRING",
    required: false,
  }],
  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return await interaction.reply({
        content: 'je n\'ai pas les perms nécessaires !'
      })
    }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return await interaction.reply({
        content: 'je n\'ai pas les perms nécessaires !'
      })
    }

    if (!args[0]) {
      let categories = [];

      readdirSync("./SlashCommands/").forEach((dir) => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../SlashCommands/${dir}/${command}`);

          if (!file.name) return "Aucun de nom";
          let name = file.name

          let description = file.description;


          return `\`${name}\` : ${description} \n`;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "En progrès" : cmds.join(" "),
        };

        categories.push(data);
      });


      const embed = new MessageEmbed()
        .setTitle(" Besoin D'aide ? Voici toutes mes commandes:")
        .addFields(categories)
        .setDescription(
          `Utilise \`/help\` suivis du nom d'une commande pour obtenir des informations supplémentaires. Par exemple: \`/help ping\`.`
        )
        .setTimestamp()
        .setColor('PURPLE');

      return interaction.reply({
        embeds: [embed]
      });
    } else {
      const command =
        client.slashCommands.get(args[0].toLowerCase()) ||
        client.slashCommands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(
            `Commande invalide! Utilise \`/help\` pour voir toute les commandes!`
          )
          .setColor("FF0000");
        const msg = await interaction.reply({
          embeds: [embed]
        })
        Delay(5000)
        msg.delete()
        return
      }

      //console.log(command.options)
      let cmdss = command.options.filter((c) => c.type === 'SUB_COMMAND')
      const embed = new MessageEmbed()
        .setTitle("Détails de la commande:")
        .addField("PREFIX:", `\`/\``)
        .addField(
          "COMMANDE:",
          command.name ? `\`${command.name}\`` : "Aucun nom"
        )
        .addField(
          "ALIASES:",
          command.aliases ?
          `\`${command.aliases.join("` `")}\`` :
          "Aucun alias"
        )
        .addField(
          "USAGE:",
          command.usage ?
          `\`/${command.name} ${command.usage}\`` :
          `\`/${command.name}\``
        )
        .addField(
          "DESCRIPTION:",
          command.description ?
          command.description :
          "Aucune description"
        )
        .addField(
          "SUB COMMANDS:",
          cmdss ?
          cmdss.map((c) => c.name).join(', ') :
          "Aucune description"
        )

        .setTimestamp()
        .setColor('PURPLE');
      return interaction.reply({
        embeds: [embed]
      });
    }
  },
};