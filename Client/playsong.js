const { MessageEmbed } = require("discord.js");
const client = require("../index");

function playSongEmbed(queue, song) {
  try {
    const playsong = new MessageEmbed()
      .setDescription(
        `[${song.name}](${song.url})`
      )
      .setColor("PURPLE")
      .setTitle(`🎶 - Nouvelle Musique !`)
      .setImage(song.thumbnail)
      .addField('Publié Par', `[${song.uploader.name}](${song.uploader.url})`, true)
      .addField('Demandé par', `${song.user}`, true)
      .addField('Volume', `${queue.volume} %`, true)
      .addField('Lecture automatique', song.autoPlay ? "Activé" : "Désactivé", true)
      .addField('Filtre(s)', `${queue.filters.join(", ") || "Normal"}`, true)
      .addField('Durée', song.formattedDuration, true)
    return playsong;
  } catch (error) {
    console.log(error);
  }
}
module.exports = playSongEmbed;
