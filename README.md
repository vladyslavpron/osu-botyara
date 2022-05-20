# osu-botyara

# osu! bot for telegram @osu_botyara_bot

# commands 
/reg [user] - connect account  
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
/You must reply on beatmap link with /c /score /conf to use it properly 

# plans  
map stats after map link sent in chat   
rewrite app with Nest
:heavy_check_mark: buttons  
:heavy_check_mark: improve /conf (fonts, style etc.)  
:heavy_check_mark: /top   
:heavy_check_mark: /conf  
:heavy_check_mark: best score of day  

# how to run
install node.js and dotnet(6.0 works for sure)
then from cmd:

git clone https://github.com/vladyslavpron/osu-botyara.git  
cd osu-botyara   
npm i  
git submodule init ! not sure about this  
git submodule update    
cd osu-tools\PerformanceCalculator  
dotnet publish -c Release -r win10-x64  
cd ..  
cd ..  
node index.js  
