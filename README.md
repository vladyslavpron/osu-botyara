# osu-botyara

install node.js and dotnet(6.0 tested)
then from cmd:

git clone https://github.com/vladyslavpron/osu-botyara.git \n
cd osu-botyara \n
npm i
git submodule init ! not sure about this
git submodule update
cd osu-tools\PerformanceCalculator
dotnet publish -c Release -r win10-x64
cd ..
cd ..
node index.js
