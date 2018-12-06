const tokens = require('./tokens.json');
const Player = require('./src/player.js');
const BattleRoom = require('./src/battleRoom.js');
const Card = require('./src/card.js');
const Queue = require('./src/queue.js');
const MongoDB = require('./src/mongoDB.js');
const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws');

const ROOMS = [];
const ALLCARDS = [];
let ONLINEUSERS = [];
const DECKSIZE = 30;
const QUEUE = new Queue(0);
const TYPE = {
    MSG_RECEIVE_USERNAME: 			1,
	MSG_RECEIVE_GET_ALL_CARDS:		2,
    MSG_RECEIVE_CONNECTED: 			3,
    MSG_RECEIVE_DISCONNECTED: 		4,
    MSG_RECEIVE_JOIN_QUEUE:         5,
    MSG_RECEIVE_LEAVE_QUEUE:        6,
    MSG_RECEIVE_SURRENDER:          7,
    MSG_RECEIVE_END_TURN: 	        8,
    MSG_RECEIVE_PLAY_CARDS:         9,
    SPLITTER:                       "-->",
    MSG_SEND_MATCH_START:	        20,
    MSG_SEND_TURN_START:	        21,
    MSG_SEND_DRAW_CARDS:           	22,
    MSG_SEND_DISCARD_CARDS:        	23,
    MSG_SEND_PLAY_CARDS:           	24,
    MSG_SEND_DEAD_CARDS:           	25,
    MSG_SEND_ONLINE_USERS:          26,
    MSG_SEND_ALL_CARDS:				27,
    MSG_SEND_OPPONENT_DRAW_CARDS:    30,
    MSG_SEND_OPPONENT_DISCARD_CARDS: 31,
    MSG_SEND_OPPONENT_PLAY_CARDS:    32,
    MSG_SEND_OPPONENT_DEAD_CARDS:    33,
};
const UNIQUE = {
	id:0
};

const dataBase = new MongoDB(MongoClient, tokens.mongoDB.name, tokens.mongoDB.url.replace("<PASSWORD>", tokens.mongoDB.password));

const PORT = process.env.PORT || 9091;
const wss = new WebSocket.Server({
    port: PORT
});

wss.on('connection', function connection(ws, req) {
    console.log("someone reached the server", getDateTime());
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    addCards(dataBase.getCollectionObjAsArray(), ALLCARDS);
    //addCards([new Card(0, "name", "image.png", 1, 1, 2, "description", false)], ALLCARDS);

    UNIQUE.id++;
    const user = new Player(UNIQUE.id, ws, ip, ALLCARDS, DECKSIZE, TYPE);

	console.log("online users", ONLINEUSERS.length);
    ONLINEUSERS.push(user);

	ws.on('error', (err) => {
		console.log(err);
	});
	
	ws.on('close', () => {
        ONLINEUSERS = userDisconnected(ONLINEUSERS, QUEUE, user);
    });
	
    ws.on('message', function(data) {
        const type = parseInt(extractType(data, TYPE.SPLITTER));
        switch(type){
            case TYPE.MSG_RECEIVE_CONNECTED: userConnected(ONLINEUSERS);
            break;
            case TYPE.MSG_RECEIVE_JOIN_QUEUE: userJoinQueue(QUEUE, user);
            break;
            case TYPE.MSG_RECEIVE_USERNAME: 0;
            break;
            case TYPE.MSG_RECEIVE_DISCONNECTED: userDisconnected(ONLINEUSERS, QUEUE, user);
            break;
            case TYPE.MSG_RECEIVE_LEAVE_QUEUE: userLeavesQueue(QUEUE, user);
            break;
            case TYPE.MSG_RECEIVE_SURRENDER: userSurrenders(user, ROOMS);
            break;
            case TYPE.MSG_RECEIVE_END_TURN: userEndsTurn(user, ROOMS);
            break;
            case TYPE.MSG_RECEIVE_PLAY_CARDS: userPlaysCards(user, data, TYPE.SPLITTER);
            break;
			case TYPE.MSG_RECEIVE_GET_ALL_CARDS: userRequestsAllCards(user, ALLCARDS);
			break;
            default: console.log("type not found", data);
        }
    });
});

setInterval(()=>{
    if(matchPossible(QUEUE)){
        startMatch(ROOMS, QUEUE);
    }
}, 1000);

function userRequestsAllCards(player){
	player.sendAllCards();
}

function nextTurn(room){
    room.getPlayers().forEach(element=>element.sendEndOfTurnData());
    cardsFight(room.getPlayers());
    room.getPlayers().forEach(element=>element.sendEndOfTurnData());
    room.getPlayers().forEach(element => element.beginTurn());
    room.getPlayers().forEach(element => element.drawCards());
}

function cardsFight(players){
    console.log("cards fighting")
    for(let ii = 0; ii < 5; ii++){
        const p1Card = players[0].getCardInPlay(ii);
        const p2Card = players[1].getCardInPlay(ii);
        if(p1Card && p2Card){
            p1Card.lowerDefense(p2Card.attack);
            p2Card.lowerDefense(p1Card.attack);
        }
    }

    players.forEach(element => {
        element.getInPlay().forEach((card, index) => {
            if(card && card.isDead()){
                element.removeDeadCards(card, index);
            }
        });
    });
}

function matchPossible(queue){
    return queue.getLength() > 1;
}

function startMatch(rooms, queue){
    const battle = new BattleRoom(0, queue.getPlayer(), queue.getPlayer());
    rooms.push(battle);
    const players = battle.getPlayers();
    players.forEach(element => {
        element.shuffleAllCards();
        element.readyDeck(Card);
        element.shuffleDeck();
		sendMatchStarted(element, players.filter(value => ![players].includes(value))[0]);
        element.drawCards();
    });
	
}

function sendMatchStarted(player, opponent){
    const obj = {
        player: {
			id: player.id,
			discordID: player.discordID,
			deckSize: player.deckSize,
			hand: player.hand,
			discarded: player.discarded,
			inPlay: player.inPlay,
			mustPlay: player.mustPlay,
		}, 
		opponent:{
			id: opponent.id,
			discordID: opponent.discordID,
			deckSize: opponent.deckSize,
			hand: opponent.hand.length,
			discarded: opponent.discarded,
			inPlay: opponent.inPlay,
		}
    }
    const data = TYPE.MSG_SEND_MATCH_START + TYPE.SPLITTER + JSON.stringify(obj);
    player.sendToSocket(data);
}

function getUniqueID(id){
    return id++;
}

function userPlaysCards(player, data, splitter){
    console.log("user plays cards");
    const value = extractValue(data, splitter);
    player.playCards(value);
}

function userEndsTurn(player, rooms){
    console.log("user ends turn");
    const room = findPlayerRoom(player, rooms);
    room.getPlayer(player.id).setEndTurn();
    room.getPlayer(player.id).discardCards();

    if(room.getPlayersEndedTurn()){
        nextTurn(room);
    }
}

function userSurrenders(player, rooms){
    console.log("user surrenders");
    const room = findPlayerRoom(player, rooms);

    room.endRoom();
    rooms = removeElementsFromArray(rooms, [room]);
}

function userDisconnected(array, queue, user){
    console.log("user disconnected");
	queue.removePlayer([user]);
    return removeElementsFromArray(array, [user]);
}

function userConnected(allUsers){
    const data = TYPE.MSG_SEND_ONLINE_USERS + TYPE.SPLITTER + JSON.stringify(allUsers.length);
    broadcastMessage(allUsers, data)
}

function userLeavesQueue(queue, player){
    console.log("user leaves queue");
    queue.removePlayer([player]);
}

function userJoinQueue(queue, player){
    console.log("user joins queue");
    queue.addPlayer(player);
}

function broadcastMessage(users, data){
    users.forEach((user) => {
        user.sendToSocket(data);
    });
};

function findPlayerRoom(player, rooms){
    const room = rooms.find(element =>{
        return element.checkPlayerInRoom(player);
    });

    return room;
}

function extractType(string, splitter){
    return string.split(splitter)[0];
}

function extractValue(string, splitter){
    return JSON.parse(string.split(splitter)[1]);
}

function addCards(array, allCards){
    allCards.length = 0;
    array.forEach(element => {
        allCards.push(new Card(
            element.id,
            element.card.name,
            element.card.image,
            element.card.attack,
            element.card.defense, 
            element.card.level,
            element.card.description,
            false,
        ));
    });
}

function removeElementsFromArray(fromArray, toRemove){
    const removed = fromArray.filter(element => !toRemove.includes(element));
    return removed;
}

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