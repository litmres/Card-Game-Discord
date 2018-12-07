module.exports = class Player{
    constructor(id, socket, ip, allCards, deckSize, TYPE){
        this.socket = socket;
        this.ip = ip;
        this.id = id;
        this.discordID = null;
        this.allCards = allCards;
        this.deckSize = deckSize;
        this.deadCards = [];
        this.deck = [];
        this.hand = [];
        this.discarded = [];
        this.inPlay = [];
        this.mustPlay = 1;
        this.endTurn = false;
        this.TYPE = TYPE;
        this.opponent = undefined;
    }
    setOpponent(opponent){
        console.log("set opponent");
        this.opponent = opponent;
    }
    setDiscordID(discordID){
        console.log("set discord id");
        this.discordID = discordID;
    }
    beginTurn(){
        console.log("begin turn");
        this.endTurn = false;
        const data = this.TYPE.MSG_SEND_TURN_START + this.TYPE.SPLITTER;
        this.sendToSocket(data);
    }
	setEndTurn(){
		this.endTurn = true;
	}
    getCard(index){
        return this.hand[index];
    }
    getCardInPlay(index){
        return this.inPlay[index];
    }
    getInHand(){
        return this.hand;
    }
    getInPlay(){
        return this.inPlay;
    }
    shuffleAllCards(){
        shuffleArray(this.allCards);
    }
    shuffleDeck(){
        shuffleArray(this.deck);
    }
    readyDeck(Card){
        console.log("readying deck");
        this.allCards.forEach(element=>{
            this.deck.push(new Card(
                element.id,
                element.name,
                element.image,
                element.attack,
                element.defense, 
                element.level,
                element.description,
                false,
            ));
        });
        if(this.deck.length < this.deckSize){
            this.readyDeck(Card);
        }
        this.deck.length = this.deckSize;
        //this.deck = this.deck.filter(element=> element !== null);
    }
    drawCards(amount = 5){
        console.log("drawing cards");
        for(let ii = 0; ii < amount; ii++){
            this.hand.push(this.deck.pop());
        }
        const data = this.TYPE.MSG_SEND_DRAW_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand);
        this.sendToSocket(data);

        const opponentData = this.TYPE.MSG_SEND_OPPONENT_DRAW_CARDS + this.TYPE.SPLITTER + JSON.stringify(amount);
        this.opponent.sendToSocket(opponentData);
    }
    discardCards(){
        console.log("discarding cards");
        const data = this.TYPE.MSG_SEND_DISCARD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand);

        while(this.hand.length > 0){
            this.discarded.push(this.hand.pop());
        }

        this.sendToSocket(data);

        const opponentData = this.TYPE.MSG_SEND_OPPONENT_DISCARD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand.length);
        this.opponent.sendToSocket(opponentData);
    }
    playCards(chosenCards){
        console.log("playing cards");
        const array = getCardsByID(this.hand, chosenCards);
        addElementsToArray(this.inPlay, array);
        removeElementsFromArray(this.hand, array);
        //const data = this.TYPE.MSG_SEND_PLAY_CARDS + this.TYPE.SPLITTER + JSON.stringify(array);
        //this.sendToSocket(data);

        const opponentData = this.TYPE.MSG_SEND_OPPONENT_PLAY_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.inPlay);
        this.opponent.sendToSocket(opponentData);
    }
    removeDeadCards(card, index){
        console.log("removing dead cards");
        this.discarded.push(this.inPlay[index]);
        this.inPlay[index] = undefined;

        this.deadCards.push(card);
        
        const data = this.TYPE.MSG_SEND_DEAD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.deadCards);
        this.sendToSocket(data);

        const opponentData = this.TYPE.MSG_SEND_OPPONENT_DISCARD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.deadCards);
        this.opponent.sendToSocket(opponentData);

        this.deadCards.length = 0;
    }
	sendAllCards(){
        console.log("send all cards");
		const data = this.TYPE.MSG_SEND_ALL_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.allCards);
		this.sendToSocket(data);
    }
    sendEndOfTurnData(){
        console.log("send end of turn data");
        const playCardsData = this.TYPE.MSG_SEND_PLAY_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.inPlay);
        //this.sendToSocket(playCardsData);

        const inHandData = this.TYPE.MSG_SEND_PLAY_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand);
        //this.sendToSocket(inHandData);

        const discardedData = this.TYPE.MSG_SEND_DISCARD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.discarded);
        //this.sendToSocket(discardedData);
    }
    sendToSocket(data){
        this.socket.send(data);
    }
}

function shuffleArray(array){
    for (let ii = array.length - 1; ii > 0; ii--) {
        const rnd = Math.floor(Math.random() * (ii + 1));
        [array[ii], array[rnd]] = [array[rnd], array[ii]];
    }
  
    return array
}

/*
function removeCards(from, to, selection){
    const add = from.filter(value => selection.includes(value.id));
    add.forEach(element => {
        to.push(element);
    });
    
    const removed = from.filter(value => !selection.includes(value.id));
    to = removed;
}
*/

function addElementsToArray(toArray, toAdd){
    toAdd.forEach((element, index) =>{
        toArray[index] = element;
    })
}

function removeElementsFromArray(fromArray, toRemove){
    const array = [];

    fromArray.forEach(element=>{
        if(!checkIdInArray(toRemove, element.id)){
            array.push(element);
        }
    });

    return array;
}

function checkIdInArray(array, id){
    const filtered = array.filter(element=> (element && element === id));
    return filtered.length > 0;
}

function getCardsByID(hand, cardIdArray){
    const array = [];
    hand.forEach(element=>{
        if(checkIdInArray(cardIdArray, element.id)){
            array.push(element);
        }else{
            array.push(undefined);
        }
    });
    return array;
}