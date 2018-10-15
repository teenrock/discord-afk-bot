
function afk(message, prefix, args, afkMSGpres, fs, path, decache) {

  if (message.author.bot) return;
  if ((afkMSGpres == "reset")||(afkMSGpres == "reset all")) return;
  let cmd = message.content.split(' ')[0].slice(prefix.length);
  var username = message.author.username;
  var userID = message.author.id;
  const repondeurMSG = `L'état du répondeur de **${username}** est passé de : `;
  var extension = '.js';
  var folderEmplacement_1 = path.resolve(__dirname, ("../users_config/afk_status/"));
  var folderEmplacement_2 = path.resolve(__dirname, ("../users_config/afk_users_msgs/"));
  const userConfFile_1 = folderEmplacement_1 + '/userID_' + message.author.id + '_conf' + extension;
  const userConfFile_2 = folderEmplacement_2 + '/userID_' + message.author.id + '_afkMsg' + extension;

  var AFK_CHANGE_STATUS = function(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg) {
    fs.writeFileSync(userConfFile_2, afk_users_msgs)
    fs.writeFileSync(userConfFile_1, afk_stat_export)
      if (afkMSGpres) {
        message.channel.send(afkConfMsg)
      } else {
        message.channel.send(userChangeAfkMsg)
      }
    
    };

  var CREATE_AFK_CONF = function(repStat, afkMSGpres, afk_stat_export, afk_users_msgs, afkConfMsg) {
    var fileConf_1 = userConfFile_1;
    var fileConf_2 = userConfFile_2;
    (fs.createFile(userConfFile_1) && fs.createFile(userConfFile_2)).catch(err=> console.log(err))
    .then(writeFileSync => {
        fs.writeFileSync(userConfFile_1, afk_stat_export)
        fs.writeFileSync(userConfFile_2, afk_users_msgs)
        message.channel.send(afkConfMsg)
        .then(send=> {
          console.log(' ' + message.author.username + ` configuration files does not exists. It has been generated successfully !\n\n AFK User Status is now [ENABLED] with message : ` + afkMSGpres + '\n');
          console.log(' AFK Status Config File Emplacement : ' + userConfFile_1 + '\n\n AFK Message Config File Emplacement : ' + userConfFile_2 + '\n');
      })
    })
  };

  // NO configuration file exists for the author of the "afk" command OR First configuration
  if (!fs.existsSync(`${userConfFile_1}`)) {

    if (afkMSGpres) {
      var repStat = 'ON'
      var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
      var afk_users_msgs = `const afkUserMsg = \`${afkMSGpres}\`\n\nmodule.exports = afkUserMsg`;
      var afkConfMsg = `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n\nVotre message personnalisé est :   **\` ${afkMSGpres} \`**`;
      CREATE_AFK_CONF(repStat, afkMSGpres, afk_stat_export, afk_users_msgs, afkConfMsg);

    } else {
      var repStat = 'null'
      var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
      var afk_users_msgs = `const afkUserMsg = \`[default configuration]\`\n\nmodule.exports = afkUserMsg`;
      var afkConfMsg = `Le répondeur de **${message.author.username}** est dès à présent disponible.\n\nSon status actuel est **[UNDEFINED]**.\n\n**Pour l'activer :**\n
->  Répondeur par défaut:       **!afk**\n->  Répondeur personnalisé:   **!afk écrivez votre message personnel ici**`;
      CREATE_AFK_CONF(repStat, afkMSGpres, afk_stat_export, afk_users_msgs, afkConfMsg)
    }

  // Configuration file exists for the author of the "afk" command
  } else if (fs.existsSync(`${userConfFile_1}`)) {
    var fileConf_1 = userConfFile_1;
    decache(fileConf_1)
    var afkUserStat = require(fileConf_1);

    if (fs.existsSync(`${userConfFile_2}`)) {
      var fileConf_2 = userConfFile_2;
      decache(fileConf_2)
      var afkUserMsg = require(fileConf_2);
    

    if (afkUserStat == 'null') {

      if (!afkMSGpres) {
        var repStat = 'ON'
        var userChangeAfkMsg = repondeurMSG + `**[UNDEFINED]** à **[` + repStat + ']**\n(configuration par défaut)';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`[default configuration]\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg =  `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n\n`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)
      } else {
        var repStat = 'ON'
        var userChangeAfkMsg = repondeurMSG + `**[UNDEFINED]** à **[` + repStat + ']**';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`${afkMSGpres}\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg = `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n\nVotre message personnalisé est :   **\` ${afkMSGpres} \`**`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)
      }

    }

    if (afkUserStat == 'ON') {

      if (!afkMSGpres) {
        var repStat = 'OFF'
        var userChangeAfkMsg = repondeurMSG + `**[ON]** à **[` + repStat + ']**';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`${afkMSGpres}\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg =  `Le répondeur de **${message.author.username}** est désenclenché **[${repStat}]**\n\n`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)

      } else {
        var repStat = 'ON'
        var userChangeAfkMsg = repondeurMSG + `**[ON]** (configuration par défaut) à **[` + repStat + ']** (message personnalisé)';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`${afkMSGpres}\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg = `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n\nVotre message personnalisé est :   **\` ${afkMSGpres} \`**`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)
      }
    }

    if (afkUserStat == 'OFF') {

      if (!afkMSGpres) {
        var repStat = 'ON'
        var userChangeAfkMsg = repondeurMSG + `**[OFF]** à **[` + repStat + ']**';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`[default configuration]\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg = `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n(configuration par défaut)\n\n`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)

      } else {
        var repStat = 'ON'
        var userChangeAfkMsg = repondeurMSG + `**[OFF]** à **[` + repStat + ']**';
        var afk_stat_export = `const afkUserStat = '${repStat}'\n\nmodule.exports = afkUserStat`;
        var afk_users_msgs = `const afkUserMsg = \`${afkMSGpres}\`\n\nmodule.exports = afkUserMsg`;
        var afkConfMsg = `Le répondeur de **${message.author.username}** est enclenché **[${repStat}]**\n\nVotre message personnalisé est :   **\` ${afkMSGpres} \`**`;
        AFK_CHANGE_STATUS(repStat, userChangeAfkMsg, afk_stat_export, afk_users_msgs, afkConfMsg)
      }

    }

  } else console.log('fileConf_2 does not exist for this user.')

}
}

module.exports = afk