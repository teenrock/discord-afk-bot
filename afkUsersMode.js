function afkUsersMode(message, prefix, client, fs, path, decache) {

  let command = message.content.split(' ')[0].slice(prefix.length);
  var isMentionned = message.mentions.members.first();
  var args = message.content.split(" ");
  var notAllowedChar = ["`", "``", "```", "\\"];
  var afkMSG_pres = args.slice(1).join(" ");

  if (message.author.bot) return;

  if (message.content.startsWith(prefix + 'afk')) {
    
    notAllowedChar.some(word=> { // use restriction of markdown
      if ((afkMSG_pres.startsWith(word))||(afkMSG_pres.includes(word))) {
        return message.reply(`cette commande ne permet pas l'utilsation de caractères spéciaux.\nVeuillez renouveler votre saisie sans caractères spécifiques.
Si malgré tout vous n'y parvenez pas, vous pouvez essayer de réinitialiser votre profilà l'aide de la commande : **!afk reset**`);
        afkMSGpres = "[default configuration]";
      } else {
        afkMSGpres = afkMSG_pres;
      }
    })

    if ((args[1] == "reset") && (args[2] != "all")) { // command IS afk reset configuration
      var extension = ".js";
      var folderEmplacement_1 = path.resolve(__dirname, ("./users_config/afk_status/"));
      var folderEmplacement_2 = path.resolve(__dirname, ("./users_config/afk_users_msgs/"));
      var userConfFile = folderEmplacement_1 + '/userID_' + message.author.id + '_conf' + extension;
      var userAfkMsgFile = folderEmplacement_2 + '/userID_' + message.author.id + '_afkMsg' + extension;
      var afk_stat_export = 'const afkUserStat = \'null\'\n\nmodule.exports = afkUserStat';
      var afk_msg_export = 'const afkUserMsg = \`null\`\n\nmodule.exports = afkUserMsg';

    if (!message.author.bot) {

      if (fs.existsSync(userAfkMsgFile)) {
        fs.writeFileSync(userAfkMsgFile, afk_msg_export)
        fs.writeFileSync(userConfFile, afk_stat_export)
        message.reply("les paramètres de votre profil AFK ont été réinitialisés avec succès !")

      } else {
        fs.createFile(userConfFile).catch(err=> console.log(err)).then(writeFileSync => {
          fs.writeFileSync(userConfFile, afk_stat_export)
        })

        fs.createFile(userAfkMsgFile).catch(err=> console.log(err)).then(writeFileSync => {
          fs.writeFileSync(userAfkMsgFile, afk_msg_export)
        })

        message.reply("les paramètres de votre profil AFK ont été créés avec succès !")
      }

    }

  } else if ((args[1] != "reset") && (args[2] != "all")) { // if command IS NOT afk reset configuraton
    const afk = require("./functions/afk.js")
    afk(message, prefix, args, afkMSGpres, fs, path, decache)
  }
  
  } // end of startsWith "!afk" command

  if (isMentionned) message.guild.members.forEach(member => { // For each member of guildMembers

    if (member.user.bot) return; // Exception for bot users

      if (member == isMentionned) { // Discriminate all except mentionned member
        console.log(` MENTIONNED MEMBER : ${member.user.username}\n`);

        if (fs.existsSync(path.resolve(__dirname, ("./users_config/afk_users_msgs/userID_" + member.id + "_afkMsg.js")))) {
          var fileConf_2 = path.resolve(__dirname, ("./users_config/afk_users_msgs/userID_" + member.id + "_afkMsg.js"));
          decache(fileConf_2)
          afkUserMsg = require(fileConf_2)
          console.log(' Personalised Message : ' + afkUserMsg)
        } else {
          afkUserMsg = `null`;
          console.log(' ERROR - fileConf_2 does not exist for this user.\n');
        }

        if (fs.existsSync(path.resolve(__dirname, ("./users_config/afk_status/userID_" + member.id + "_conf.js")))) {
          var fileConf_1 = path.resolve(__dirname, ("./users_config/afk_status/userID_" + member.id + "_conf.js"));
          decache(fileConf_1)
          afkUserStat = require(fileConf_1)
          console.log(' AFK Users Status : ' + afkUserStat)
        } else {
          afkUserStat = `none`
          console.log(' ERROR - fileConf_1 does not exist for this user.\n');
        }

        if (afkUserMsg == `[default configuration]`) {
          console.log(' afkUserMsg = [default configuration] 1\n')
          if (afkUserStat == `ON`) {
            console.log(' afkUserStat = ON\n')
            afkMsg = ` est en mode **AFK**. Il serait peut être préférable de ne pas le/la déranger...`;
            message.channel.send(`**${message.author}**, **${member.user.username}** ` + afkMsg)
            console.log(' ' + member.user.username + ' was mentionned by ' + message.author.username + '\n ' + member.user.username + ' AFK Status = [ON]\n')
          } else return console.log(' ' + member.user.username + ' was mentionned by ' + message.author.username + '\n ' + member.user.username + ' AFK Status = [OFF]\n')
    
        }

        if (afkUserMsg != `[default configuration]`) {
          console.log(' afkUserMsg != [default configuration] 1\n')

          if (afkUserStat == `ON`) {
            console.log(' afkUserStat = ON\n')
            decache(fileConf_2)
            afkUserMsg = require(fileConf_2)
            afkMsg = afkUserMsg;
            message.channel.send(`**${member.user.username}** ` + afkUserMsg)
            console.log(' ' + member.user.username + ' was mentionned by ' + message.author.username + '\n ' + member.user.username + ' AFK Status = [ON]\n')
          }

          if ((afkUserStat == `null`) || (afkUserStat == `OFF`)) {
            console.log(' afkUserStat = null / OFF\n')
            console.log(' ' + member.user.username + ' was mentionned by ' + message.author.username + '\n ' + member.user.username + ' AFK Status = [OFF]\n')
          }
        
        }

      }

  })

  // Reset all users to default configuration
  
    if (message.content == (prefix + 'afk reset all')) {

        client.users.forEach(user=>{

            var extension = '.js';
            var folderEmplacement_1 = path.resolve(__dirname, ("./users_config/afk_status/"));
            var folderEmplacement_2 = path.resolve(__dirname, ("./users_config/afk_users_msgs/"));
            var userConfFile_1 = folderEmplacement_1 + '/userID_' + user.id + '_conf' + extension;
            var userAfkMsgFile = folderEmplacement_2 + '/userID_' + user.id + '_afkMsg' + extension;

        if (fs.existsSync(userConfFile_1)) {

          if (!user.bot) {

            if (user.id == '1') return; 

            fs.createFile(userConfFile_1).catch(err=> console.log(err)).then(writeFileSync => {
              var afk_stat_export = 'const afkUserStat = ' + '\'null\'' + `\n\nmodule.exports = afkUserStat`;
              fs.writeFileSync(userConfFile_1, afk_stat_export)
            })

            fs.createFile(userAfkMsgFile).catch(err=> console.log(err)).then(writeFileSync => {
              var afk_msg_export = 'const afkUserMsg = ' + '\`null\`' + '\n\nmodule.exports = afkUserMsg';
              fs.writeFileSync(userAfkMsgFile, afk_msg_export)
            })

          } else {
            console.log(' UserID ' + user.id + ' is a bot. Config file not saved for this user.');
            message.channel.send(`L'utilisateur **${user.username}** ayant pour identifiant **${user.id}** est un bot.\nSon fichier de configuration n'a donc pas été créé. `)
          }

        } else {

          if (!user.bot) {
            
            if (user.id == '1') return; 

            fs.createFile(userConfFile_1).catch(err=> console.log(err)).then(writeFileSync => {
              var afk_stat_export = 'const afkUserStat = ' + '\'null\'' + `\n\nmodule.exports = afkUserStat`;
              fs.writeFileSync(userConfFile_1, afk_stat_export)
            })

            fs.createFile(userAfkMsgFile).catch(err=> console.log(err)).then(writeFileSync => {
              var afk_msg_export = 'const afkUserMsg = ' + '\`null\`' + '\n\nmodule.exports = afkUserMsg';
              fs.writeFileSync(userAfkMsgFile, afk_msg_export)
            })
            message.channel.send(`Les fichiers de configuration **AFK** viennent d'être créés pour l'utilisateur **${user.username}**`);

          } else {
            console.log(' UserID ' + user.id + ' is a bot. Config file not saved for this user.');
            message.channel.send(`L'utilisateur **${user.username}** ayant pour identifiant **${user.id}** est un bot.\nSon fichier de configuration n'a donc pas été créé. `)
          }
        }
      })
      message.channel.send(' Les profils **AFK** de chaque utilisateurs ont été réstaurés à leur état initial.')
      console.log(' All AFK users profils has been define as : [default configuration]')
    }
  

}

module.exports = afkUsersMode