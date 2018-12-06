"use strict";

const TYPE = {
    MSG_SEND_USERNAME: 			        1,
    MSG_SEND_GET_ALL_CARDS:             2,
    MSG_SEND_CONNECTED: 			    3,
    MSG_SEND_DISCONNECTED: 		        4,
    MSG_SEND_JOIN_QUEUE:                5,
    MSG_SEND_LEAVE_QUEUE:               6,
    MSG_SEND_SURRENDER:                 7,
    MSG_SEND_END_TURN: 	                8,
    MSG_SEND_PLAY_CARDS:                9,
    SPLITTER:                           "-->",
    MSG_RECEIVE_MATCH_START:	        20,
    MSG_RECEIVE_TURN_START:	            21,
    MSG_RECEIVE_DRAW_CARDS:           	22,
    MSG_RECEIVE_DISCARD_CARDS:        	23,
    MSG_RECEIVE_PLAY_CARDS:           	24,
    MSG_RECEIVE_DEAD_CARDS:           	25,
    MSG_RECEIVE_ONLINE_USERS:           26,
    MSG_RECEIVE_ALL_CARDS:  		    27,
};

const socket = new WebSocket('ws://localhost:9091');

socket.addEventListener('open', function(event) {
    console.log("connected succesfully");
    socket.send(TYPE.MSG_SEND_CONNECTED);
    socket.send(TYPE.MSG_SEND_GET_ALL_CARDS);
});
socket.addEventListener('close', function(event) {
    console.log("disconnected...");
});
socket.addEventListener('error', function(event) {
    console.log("an error has occured!");
});


function receivedAllCards(members){
    const container = document.getElementsByClassName("container")[0];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
	
    members.forEach(element => {
        element.image = "https://cdn.discordapp.com/avatars/93872440244969472/f977f194d987d21a6adbc6ec8423c1a9.webp";
        const obj = {
            attack: element.attack,
            defense: element.defense,
            currentDefense: element.defense,
            level: element.level,
            description: element.description,
            image: element.image,
            name: element.name,
            id: element.id,
            isSpecial: element.isSpecial,
            position: element.position,
        }
        createCard(obj);
    });
}

function extractType(string, splitter){
    return string.split(splitter)[0];
}

function extractValue(string, splitter){
    if(!string.split(splitter)[1]){
        return undefined;
    }
    return JSON.parse(string.split(splitter)[1]);
}

function rndNumBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function createCard(user){
	const container = document.getElementsByClassName("container")[0];
    
    const shot = document.createElement("div");
    shot.setAttribute("class", "screenshot-container");

    const card = document.createElement("div");
    card.setAttribute("class", "card-container");

    const level = document.createElement("div");
    level.setAttribute("class", "level-container");
    level.appendChild(document.createTextNode(user.level));
	
	const userImageBorder = document.createElement("div");
    userImageBorder.setAttribute("class", "user-image-border");

    const userImage2Border = document.createElement("div");
    userImage2Border.setAttribute("class", "user-image2-border");

    const userImage = document.createElement("img");
    userImage.setAttribute("class", "user-image");
    userImage.setAttribute("src", user.image);

    const userImage2 = document.createElement("img");
    userImage2.setAttribute("class", "user-image2");
    userImage2.setAttribute("src", user.image);

    const name = document.createElement("div");
    name.setAttribute("class", "name-container");
    name.appendChild(document.createTextNode(user.name));

    const text = document.createElement("div");
    text.setAttribute("class", "text-container");
    text.appendChild(document.createTextNode(user.description));

    const attackContainer = document.createElement("div");
    attackContainer.setAttribute("class", "attack-image-container");

    const attack = document.createElement("img");
    attack.setAttribute("class", "attack-image");
    attack.setAttribute("src", "assets/attack.png");

    const attackText = document.createElement("div");
    attackText.setAttribute("class", "image-text");
    attackText.appendChild(document.createTextNode(user.attack));

    const defenseContainer = document.createElement("div");
    defenseContainer.setAttribute("class", "defense-image-container");

    const defense = document.createElement("img");
    defense.setAttribute("class", "defense-image");
    defense.setAttribute("src", "assets/defense.png");

    const defenseText = document.createElement("div");
    defenseText.setAttribute("class", "image-text");
    defenseText.appendChild(document.createTextNode(user.defense));

    attackContainer.appendChild(attack);
    attackContainer.appendChild(attackText);

    defenseContainer.appendChild(defense);
    defenseContainer.appendChild(defenseText);

    const hiddenData = document.createElement("div");
    hiddenData.setAttribute("class", "hidden");
    hiddenData.appendChild(document.createTextNode(JSON.stringify(user)));

    card.appendChild(hiddenData);
    card.appendChild(level);
	card.appendChild(userImageBorder);
    card.appendChild(userImage2Border);
    card.appendChild(userImage);
    card.appendChild(userImage2);
    card.appendChild(name);
    card.appendChild(text);
    card.appendChild(attackContainer);
    card.appendChild(defenseContainer);

    shot.appendChild(card);

    container.appendChild(shot);
}

function chosenOption(num){
    const option = document.getElementById("option");
    option.style.visibility = "hidden";
    option.style.display = "none";

    if(!num){
        const canvas=document.getElementById("canvas");
        canvas.style.visibility = "visible";
        const ctx=canvas.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("Waiting for Cards to Load...",50,50);

        const container = document.getElementsByClassName("container")[0];
        container.style.visibility = "visible";

        const interval = setInterval(()=>{
            const container = document.getElementsByClassName("container")[0];
            if(container.children.length > 1){
                clearInterval(interval);
                createCards();
            }
        }, 500);
    }else{
        const canvas=document.getElementById("canvas");
        canvas.style.visibility = "visible";
        canvas.style.display = "none";

        const container = document.getElementsByClassName("container")[0];
        container.style.visibility = "visible";

        document.body.style.overflow = "auto";
    }
}