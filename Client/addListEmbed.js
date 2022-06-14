const { MessageEmbed } = require("discord.js");
const client = require("../index");

function addListEmbed(queue, playlist) {
  try {
    const addlist = new MessageEmbed()
      .setDescription(
        `\n\n Nom : (${playlist.name})[${playlist.url}]\n\nChansons : ${playlist.songs.lenght}, Durée : ${playlist.formattedDuration}\n\nDémandée par ${playlist.member}`
      )
      .setColor("#7289da")
      .setTitle(`Ajout d'une playlist a la file d'attente :`)
      .setImage(playlist.thumbnail)
      .setFooter({ text: `${playlist.source}` });
    return addlist;
  } catch (error) {
    console.log(error);
  }
}
module.exports = addListEmbed;
