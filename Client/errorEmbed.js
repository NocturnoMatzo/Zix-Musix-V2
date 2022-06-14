const {
    MessageEmbed
} = require("discord.js");
const client = require("../index");

function errorEmbed(title, description) {
  
    try {
        const errorembed = new MessageEmbed()
            .setDescription(
                description
            )
            .setColor("RED")
        if(title !== "") errorembed.setTitle(title)
        return errorembed;
    } catch (error) {
        console.log(error);
    }
}
module.exports = errorEmbed;