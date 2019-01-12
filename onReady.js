function onReady(message, client) {

  var memberCount = client.users.size;
  var serverCount = client.guilds.size;
  const guildNames = client.guilds.map(g => g.name).join("\n");
  var startMsg = `\n ${client.user.username}@client [Started] ${new Date()}
 --------------------------------------\n Utilisateurs: ${memberCount}\n Serveur(s): ${serverCount}\n ${guildNames}\n --------------------------------------\n`;

  client.user.setUsername(`${client.user.username}`);
  client.user.setActivity(`!afk`, {type: "WATCHING"});
  client.user.setStatus("online"); // online / dnd / idle / invisible
  console.log(startMsg);

}

module.exports = onReady