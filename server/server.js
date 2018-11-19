const Discord = require('discord.js');
const tokens = require('./tokens.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Discord bot Logged in as ${client.user.tag}!`);
});

client.login(tokens.discord.token);

function respond(user){
	const array = [];
	client.guilds.forEach(guild => guild.members.forEach(member => array.push({
        name: member.user.username,
        image: member.user.avatarURL,
    })));
	sendDataToClient(user, array);
}

const WebSocket = require('ws');
const PORT = process.env.PORT || 6060;
const wss = new WebSocket.Server({
    port: PORT
});

wss.on('connection', function connection(ws, req) {
    console.log("someone reached the server", getDateTime());
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user = {
        ip: ip,
        socket: ws,
    };

    ws.on('message', function(data) {
        respond(user);
    });
});

function getDateTime() {
    const date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

function sendDataToClient(user, data){
	console.log("sending", data)
    user.socket.send(JSON.stringify(data));
}