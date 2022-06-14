const { Client, Collection } = require("discord.js");
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { Op } = require('sequelize');
const { Guilds } = require('./handler/dbObjects.js');
const {Sequelize} = require('sequelize');
const discordModals = require('discord-modals');

const client = new Client({
    intents: 32767,
});
module.exports = client;

discordModals(client);

require('dotenv-flow').config();

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

client.config = require('./config')
client.log = require('./handler/logger')

client.login(process.env.TOKEN);
