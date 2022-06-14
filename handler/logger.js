const moment = require("moment");
const Discord = require('discord.js')
const fs = require('fs');

exports.log = async (msg, type = 'log') => {
    /**
      * @VARiables
      * @var {filename} Filename if you want to log the logs into a file put in var file_log = true [default = false]
      * @var {dateNow} Timestamp if you want to get the exact time of logged string put in var date = true [default = true]
      * 
      * CONFIG
    */
    var dateNow = `[${moment().format("DD-MM-YY ~ H:m:s")}]`; // timestamp format
    var fileName = `${moment().format('DD-MM-YY')}.log` // filename formatt
    var file_log = true // if you want to logged things log into the file  it's like a transcript
    var log_path = `./logs/` + `${fileName}` // the log path
    var _webhook = true
    var __webhook = {
        error: {
            id: client.config.webhook.discord.error.id, // the webhook id
            token: client.config.webhook.discord.error.token // the webhook token
        },
        warn: {
            id: client.config.webhook.discord.warn.id, // the webhook id
            token: client.config.webhook.discord.warn.token // the webhook token
        }
    }
    var colors = {
        // text colors
        log: '\u001b[37;1m',// white
        info: '\u001b[96m', //cyan
        success: '\u001b[32;1m', // green
        error: '\u001b[31;1m', // red
        warn: '\u001b[33;1m', // yellow
        event: '\u001b[34;1m', //blue
        debug: '\u001b[35;1m', //magenta

        timestamp: '\u001b[34;1m', // Timestamp Color [xx-xx-xxx ~ xx:xx:xx]
        logtype: '\u001b[34;1m', // Log Type Color [log]
        filename: '\u001b[36;1m', // File Name Color [filename.js]
        reset: '\u001b[0m' // Reset

        /**
         * View
         * [01-01-0000 00:00:00] - [log] ~ [filename.js] Some text of you logged
        */
    } // Colors Settings Please Use ASNI Colors Because I Don't Want to Install An Package Fot Colors If You Want Fell Free To Do It Just Put The Colors Here.

    /**
     * @function Functions Just Making Some Functions Uwu
    */
    function type0(level) {
        var types;
        level = level.toLowerCase(); // make it all toLowerCase()
        types = ['log', 'info', 'success', 'error', 'warn', 'event', 'debug']
        if (!types.includes(level)) {
            level = undefined // if type is not in types then return undefined
        }
        return level; // return it
    } // check logging type function

    function content(message) {
        if (message.trim().length === 0) { // check if msg isn't empty
            message = undefined // if true return undefined
        }
        return message; // return it
    } // check content function

    function timestamp() { // lazy to delete 
        var output = dateNow;
        return output;
    } // it was an function but removed lazy to change all

    function transcript() { // make transcript
        msg = `${timestamp()} - [${type0(type)}] ~ ${_filename()} ${content(msg)}`
        if (file_log === true) { // check if user want transcript
            fs.writeFileSync(`${log_path}`,
                msg + "\n",
                {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
        }
    } // transcript

    function _filename() {
        var filename;
        var _pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        try {
            var err = new Error();
            var callerfile;
            var currentfile;

            currentfile = err.stack.shift().getFileName();

            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();

                if (currentfile !== callerfile) {
                    filename = callerfile;
                    break;
                }
            }
        } catch (err) { }
        Error.prepareStackTrace = _pst;

        filename = `[` + filename.split(/[\\/]/).pop() + `]` // add [] to filename and remove the tree
        return filename;
    }

    function webhook(type) { // webhook
        if (!_webhook === true) return; // check if want to run function
        if (!type0(type)) throw new Error("Type Is Undefined"); // check if type is there
        if (__webhook.error.id.trim().length === 0 || __webhook.warn.id.trim().length === 0) throw new Error("One of the id is undefined"); // check id's
        if (__webhook.error.token.trim().length === 0 || __webhook.warn.token.trim().length === 0) throw new Error("One of the token is undefined"); // check token's

        if (type0(type) === 'error') { // send error
            const webhook = new Discord.WebhookClient({
                id: __webhook.error.id,
                token: __webhook.error.token
            });
            /**
            * @EDIT EDIT HERE!
            */
            const embed = new Discord.MessageEmbed()
                .setColor(client.config.embeds.colors.error)
                .setTitle('Error')
                .addFields(
                    { name: 'Promise:', value: `\`\`\`${Promise.resolve(content)}\`\`\``, inline: true },
                    { name: 'Error:', value: `\`\`\`${content(msg)}\`\`\``, inline: false },
                    { name: 'Info:', value: `\`\`\`${timestamp()} ~ ${_filename()}\`\`\``, inline: false },
                )
            /**
            * @NOEDIT END OF EDIT HERE!
*           */
            webhook.send({
                embeds: [embed]
            });
        }
        if (type0(type) === 'warn') { // send warn
            const webhook = new Discord.WebhookClient({
                id: __webhook.warn.id,
                token: __webhook.warn.token
            });

            /**
             * @EDIT EDIT HERE!
             */
            const embed = new Discord.MessageEmbed()
                .setColor(client.config.embeds.colors.warn) // color
                .setTitle('Warning')
                .addFields(
                    { name: 'Warn:', value: `\`\`\`${content(msg)}\`\`\``, inline: false },
                    { name: 'Info:', value: `\`\`\`${timestamp()} ~ ${_filename()}\`\`\``, inline: false },
                )
            /**
            * @NOEDIT END OF EDIT HERE!
            */
            webhook.send({
                embeds: [embed]
            });
        }
    }

    /**
     * Logger
    */
    switch (type0(type)) {
        case "log": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.log}${content(msg)}${colors.reset}`)
            transcript()
            //log it
            // make transcript it can be disabled at file_log
            return;
        }

        case "info": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.info}${content(msg)}${colors.reset}`)
            transcript()
            return;
        }

        case "success": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.success}${content(msg)}${colors.reset}`)
            transcript()
            return;
        }

        case "error": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.error}${content(msg)}${colors.reset}`)
            transcript()
            webhook('error')
            return;
        }

        case "warn": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.warn}${content(msg)}${colors.reset}`)
            transcript()
            webhook('warn')
            return;
        }

        case "event": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.event}${content(msg)}${colors.reset}`)
            transcript()
            return;
        }

        case "debug": {
            console.log(`${colors.timestamp}${timestamp()}${colors.reset} - ${colors.logtype} [${type0(type)}]${colors.reset} ~ ${colors.filename}${_filename()}${colors.reset} ${colors.debug}${content(msg)}${colors.reset}`)
            transcript()
            return;
        }
        default: throw new TypeError('You\'r Using The Wrong Type Of Logger')
    }
}

exports.info = (...args) => this.log(...args, 'info');
exports.success = (...args) => this.log(...args, 'success');
exports.error = (...args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, 'warn');
exports.event = (...args) => this.log(...args, 'event');
exports.debug = (...args) => this.log(...args, 'debug');