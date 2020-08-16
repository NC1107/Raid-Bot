const Settings = require("./Setup.json");
const Discord = require("discord.js");
const FileSystem = require("fs");
const HTTPS = require('https');
const path = require('path');


const Bot = new Discord.Client();
const Prefix = Settings.prefix;
let Command;
let URL;

var Counter = 1;

Bot.on("ready", async () => {
    console.log(Bot.user.username + ' is online.\n');

    FileSystem.access("./Unprocessed Images", error => {
        if (!error) {
            console.log("Setup folder already exists.\n")
        } else {
            FileSystem.mkdir("./Unprocessed Images", function () {
                console.log("Folder Created.\n")
            });
        }
    });

    Bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log("BOT INVITE LINK:\n" + link);
    }).catch(err => {
        console.log(err.stack);
    });
    await Bot.generateInvite(["ADMINISTRATOR"]);

});


Bot.on("message", async message => {

    if (message.attachments.size > 0) {
        message.channel.send("Raid received :)")
        message.attachments.forEach(function (attachment) {
            URL = attachment.url;
            //${Date.now()}
            const file = FileSystem.createWriteStream(`Log${Counter}.jpg`);

            const request = HTTPS.get(URL, function (response) {
                response.pipe(file);
            });

            var tempFile = path.basename(`./Log${Counter}.jpg`);
            var destLocation = path.resolve('C:\\Users\\18862\\Desktop\\Raid Bot\\Unprocessed Images', tempFile)

            FileSystem.rename(tempFile, destLocation, (err) => {
                if (err) console.log(err.stack);
                else console.log(`Moved: Log${Counter}.jpg`);
            })


        });
        Counter++;
    }
    //IGNORE NON-PREFIX MESSAGES
    if (!message.content.startsWith(Prefix) || message.author.bot) return;
    //CHECK FOR CORRECT TEXT CHANNEL USAGE
    if (message.channel.name === "raid-logs") {
        //COMMAND SETUP
        if (message.content.startsWith(Prefix)) {
            const args = message.content.slice(Prefix.length).trim().split(/ +/g);
            Command = args.shift().toLowerCase();
            console.log("Given Command: " + Command)
        }

    }
});


Bot.login(Settings.token);