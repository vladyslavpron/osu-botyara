# osu-botyara

# osu! bot for telegram @osu_botyara_bot

# commands 
reg - connect account
unreg - delete account
stats - show player's profile stats
last - show user's last play
recent - show user's last play
c - show user's play on map
score - show user's play on map
top - show user's top 5 plays
conf - show all scores of chat on beatmap
bestrecent - show best recent play (in last 24h)

# palns 
map info after map link sent in chat
/top
<span style="color:green">/conf</span>
<span style="color:green">best score of day</span>

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
