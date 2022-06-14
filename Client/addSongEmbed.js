const { MessageEmbed } = require("discord.js");
const client = require("../index");

function addSongEmbed(queue) {
  const song = queue.songs[1];
  try {
    const addsong = new MessageEmbed()
      .setColor("#7289da")
      .setTitle("Ajout de la Musique :")
      .setDescription(
        `[\`${song.name}\`](${song.url})\nDémandée par ${song.user}`
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
      .setImage(song.thumbnail)
      .setFooter({
        text: `${song.likes} 👍  ${song.dislikes} 👎 ${song.views} 👀`,
      });
    return addsong;
  } catch (error) {
    console.log(error);
  }
}
module.exports = addSongEmbed;
