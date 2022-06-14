const { MessageEmbed } = require("discord.js");
const client = require("../index");
const distube = require("./Distube");

function nowPlayingEmbed(queue) {
  const config = client.config
    const disque = queue.textChannel.client.emojis.cache.find(
      (emoji) => emoji.id === config.disque
    )

  const song = queue.songs[0];
  try {
    const nowplayingembed = new MessageEmbed()
      .setDescription(
        `[${song.name}](${song.url})\nDémandée par ${song.user}`
      )
      .addField("⏱ Durée:", ` \`${song.formattedDuration}\``, true)
      .addField(
        "🌀 File:",
        `\`${queue.songs.length} musique(s) - ${queue.formattedDuration}\``,
        true
      )
      .addField("🔊 Volume:", `\`${queue.volume} %\``, true)
      .addField(
        "♾ Répétition:",
        `  \`${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "✅ File"
              : "✅ Musique"
            : "❌"
        }\``,
        true
      )
      .addField(
        "↪️ Lecture Automatique:",
        `\`${queue.autoplay ? "✅" : "❌"}\``,
        true
      )
      .addField("❔ Filtre(s):", `\`${queue.filter || "❌"}\``, true)
      .setColor("PURPLE")
      .setTitle(`${disque} | Musique En Cours :`)
      .setImage(song.thumbnail)
      .setFooter({
        text: `${song.likes} 👍  ${song.dislikes} 👎 ${song.views} 👀`,
      });
    return nowplayingembed;
  } catch (error) {
    console.log(error);
  }
}
module.exports = nowPlayingEmbed;
