"use strict";
const socket = new WebSocket('wss://get-members.herokuapp.com');

socket.addEventListener('open', function(event) {
    console.log("connected succesfully");
    socket.send("ass");
});
socket.addEventListener('close', function(event) {
    console.log("disconnected...");
});
socket.addEventListener('error', function(event) {
    console.log("an error has occured!");
});
socket.addEventListener('message', function(event) {
    const members = JSON.parse(event.data);
    const container = document.getElementsByClassName("container")[0];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    members.forEach(element => {
        const attack = rndNumBetween(1, 15);
        const defense = rndNumBetween(1, 15);
        createCard({
            name: element.name,
            image: element.image,
            attack: attack,
            defense: defense,
            description:"skefj slkfj asdlkf jsdaf",
            level: Math.floor((attack+defense)/2),
        });
    });
});

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

    card.appendChild(level);
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