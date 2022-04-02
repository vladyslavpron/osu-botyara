async function help(ctx) {
  ctx.reply(`/reg [user] - connect account
/unreg [user] - delete account
/stats [user] - show player's profile stats
/last [user] (№) - show user's last (№) play
/recent [user] (№) - alias for last
/c [user] (+mods) - show user's play on map
/score [user] (+mods) - show user's play on map 
/top (№) [user] (+mods) - show user's top (№) plays
/conf (+mods) - show all scores of chat on beatmap
/bestrecent [user] - show best recent play (in last 24h)
/You can use any command without [user] if you /reg before
/You must reply on beatmap link with /c /score /conf to use it properly`);
}

module.exports = help;
