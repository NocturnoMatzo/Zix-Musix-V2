const { Client, Collection } = require("discord.js");
const discordModals = require('discord-modals');
const { RateLimiter } = require('discord.js-rate-limiter');


const client = new Client({
    intents: 32767,
});
module.exports = client;

discordModals(client);

require('dotenv-flow').config();

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.rateLimiter = new RateLimiter(1, 5000);

client.config = require('./config')

require('./handler')(client)
client.login(process.env.TOKEN);
