//////////////////////////////////////////////////////////////////////////////////////////
// AFK BOT
/////////////////////////////////////////////////////////////////////////////////////////
const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true, max_message_cache: 0, disableEveryone: true});
var EventEmitter = require('events').EventEmitter.defaultMaxListeners = 0;
const config = require("./config.json");
const fs = require('fs-extra');
const decache = require('decache');
const path = require("path");
var prefix = config.prefix;

client.on("ready", (message) => {
  const onReady = require("./onReady.js")
  onReady(message, client)
});

client.on('guildMemberAdd', (member) => {

  if ((member.user.bot) || (member.user.id == '1')) return;
  var extension = '.js';
  var folderEmplacement_1 = path.resolve(__dirname, ("./users_config/afk_status/"));
  var folderEmplacement_2 = path.resolve(__dirname, ("./users_config/afk_users_msgs/"));
  var userConfFile = folderEmplacement_1 + '/userID_' + member.id + '_conf' + extension;
  var afkUserMsg = folderEmplacement_2 + '/userID_' + member.id + '_afkMsg' + extension;

  fs.createFile(userConfFile).catch(err=> console.log(err)).then(writeFileSync => {
    let afk_stat_export = 'const afkUserStat = \'null\'\n\nmodule.exports = afkUserStat';
    fs.writeFileSync(userConfFile, afk_stat_export)
  })

  fs.createFile(afkUserMsg).catch(err=> console.log(err)).then(writeFileSync => {
    let afk_msg_export = 'const afkUserMsg = \`null\`\n\nmodule.exports = afkUserMsg';
    fs.writeFileSync(afkUserMsg, afk_msg_export)
  })

});

client.on('message', (message) => {

  if ((message.channel != undefined) && (!message.author.bot)) {
    const afkUsersMode = require("./afkUsersMode.js");
    afkUsersMode(message, prefix, client, fs, path, decache)
  }

});

client.login(config.token)