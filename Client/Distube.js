const DisTube = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { MessageEmbed } = require("discord.js");
const client = require("../index");
const { SpotifyPlugin } = require("@distube/spotify");
const delay = require("./delay");
const nowPlayingEmbed = require("./nowPlayingEmbed");
const addSongEmbed = require("./addSongEmbed");
const addListEmbed = require("./addListEmbed");
const playSongEmbed = require("./playsong");

const distube = new DisTube.default(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  searchSongs: 15,
  emitAddSongWhenCreatingQueue: false,
  youtubeDL: false,
  youtubeCookie: process.env.COOKIE,
  plugins: [ new SpotifyPlugin({
    parallel: true,
    emitEventsAfterFetching: true,
    api: {
      clientId: "41d9168ff25e42aba627c44b73717264",
      clientSecret: "a4af246afc764ffbaca771ea57a14416",
    },
  }),, new YtDlpPlugin() ],
  ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    },
    customFilters: {
      rickroll:
        "bass=g=33,apulsator=hz=0.06,vibrato=f=2.5,tremolo,asetrate=48000*0.8",
      clear: "dynaudnorm=f=200",
      bassboost: "bass=g=20,dynaudnorm=f=200",
      "8d": "apulsator=hz=0.08",
      vaporwave: "aresample=48000,asetrate=48000*0.8",
      nightcore: "aresample=48000,asetrate=48000*1.25",
      phaser: "aphaser=in_gain=0.4",
      purebass: "bass=g=20,dynaudnorm=f=200,asubboost",
      tremolo: "tremolo",
      vibrato: "vibrato=f=6.5",
      reverse: "areverse",
      treble: "treble=g=5",
      surround: "surround",
      pulsator: "apulsator=hz=1",
      subboost: "asubboost",
      karaoke: "stereotools=mlev=0.03",
      flanger: "flanger",
      gate: "agate",
      haas: "haas",
      mcompand: "mcompand",
      cursed: "vibrato=f=6.5,tremolo,aresample=48000,asetrate=48000*1.25",
      earwaxe: "earwaxe"
    }})


distube
  .on("playSong", async (queue, song) => {
    let msg = await queue.textChannel.send({ embeds: [playSongEmbed(queue, song)] })
    setTimeout(function(){
      msg.delete()
  },10000);
      
  })
  .on("addSong", async(queue, song) => {
    let msg = await queue.textChannel.send({ embeds: [playSongEmbed(queue, song)] });
    setTimeout(function(){
      msg.delete()
  },10000);
  })
  .on("error", async(textChannel, error) => {
    try {
       console.error(error);
       textChannel.send(`Nous avons butté sur un obstacle: ${error}`);
    } catch (e) {
      console.log(e)
    }
   
  });

module.exports = distube;
