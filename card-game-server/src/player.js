module.exports = class Player{
    constructor(id, socket, ip, allCards, deckSize, TYPE){
        this.socket = socket;
        this.ip = ip;
        this.id = id;
        this.discordID = null;
        this.allCards = allCards;
        this.deckSize = deckSize;
        this.deck = [];
        this.hand = [];
        this.discarded = [];
        this.inPlay = [];
        this.mustPlay = 1;
        this.endTurn = false;
        this.TYPE = TYPE;
    }
    setDiscordID(discordID){
        this.discordID = discordID;
    }
    beginTurn(){
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
        this.deck.length = this.deckSize;
    }
    drawCards(amount = 5){
        for(let ii = 0; ii < amount; ii++){
            this.hand.push(this.deck.pop());
        }
        const data = this.TYPE.MSG_SEND_DRAW_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand);
        this.sendToSocket(data);
    }
    discardCards(){
        const data = this.TYPE.MSG_SEND_DISCARD_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.hand);

        while(this.hand.length > 0){
            this.discarded.push(this.hand.pop());
        }

        this.sendToSocket(data);
    }
    playCards(chosenCards){
        removeElementsFromArray(this.hand, chosenCards);
        addElementsToArray(this.inPlay, chosenCards);
        
        const data = this.TYPE.MSG_SEND_PLAY_CARDS + this.TYPE.SPLITTER + JSON.stringify(chosenCards);
        this.sendToSocket(data);
    }
    removeDeadCards(deadCards){
        deadCards.forEach(element =>{
            this.discarded.push(this.inPlay[element]);
            this.inPlay[element] = undefined;
        });
        
        const data = this.TYPE.MSG_SEND_DEAD_CARDS + this.TYPE.SPLITTER + JSON.stringify(deadCards);
        this.sendToSocket(data);
    }
	sendAllCards(){
		const data = this.TYPE.MSG_SEND_ALL_CARDS + this.TYPE.SPLITTER + JSON.stringify(this.allCards);
		this.sendToSocket(data);
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
    toAdd.forEach(element =>{
        toArray[element.position] = element;
    })
}

function removeElementsFromArray(fromArray, toRemove){
    const removed = fromArray.filter(element => !toRemove.includes(element));
    return removed;
}