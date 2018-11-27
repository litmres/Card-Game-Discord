class Player{
    constructor(socket, ctx, deckSize, allCards){
      this.socket = socket;
      this.ctx = ctx;
      this.allCards = allCards
      this.hand = [];
      this.discarded = [];
      this.deckSize = deckSize;
      this.discordID = null;
      this.endTurn = false;
      this.cardWidth = 500;
      this.cardHeight = 700;
      this.mustPlay = 1;
      this.inBattle = false;
      this.inQueue = false;
      this.playField = new PlayField(this.ctx, 650, 800, this.cardWidth*5, this.cardHeight, "blue", this.socket);
      this.handField = new HandField(this.ctx, 650, 900+this.cardHeight, this.cardWidth*5, this.cardHeight, "blue", this.socket);
      this.deckField = new DeckField(this.ctx, 50, 800, this.cardWidth, this.cardHeight, "blue", this.socket);
      this.discardField = new DiscardField(this.ctx, 3250, 800, this.cardWidth, this.cardHeight, "blue", this.socket);
      this.endTurnButton = new EndTurnButton(this.ctx, 3250, 400, 400, 200, "End Turn", "green", this.socket);
      this.queueButton = new QueueButton(this.ctx, 1750, 100, 400, 200, "Join Queue", "yellow", this.socket);
      this.surrenderButton = new SurrenderButton(this.ctx, 3250, 100, 400, 200, "Surrender", "red", this.socket);
    }
    getQueueButton(){
        return this.queueButton;
    }
    getSurrenderButton(){
        return this.surrenderButton;
    }
    getEndTurnButton(){
        return this.endTurnButton;
    }
    setEndTurn(turn){
		this.endTurn = turn;
    }
    drawButtons(){
        if(this.inBattle){
            this.endTurnButton.draw();
            this.surrenderButton.draw();
        }else{
            this.queueButton.draw(this.inQueue);
        }
    }
    drawFields(){
        if(!this.inBattle) return;
        this.playField.draw();
        this.handField.draw();
        this.deckField.draw();
        this.discardField.draw();
    }
    fillDeckCards(){
        for(let ii = 0; ii < this.deckSize; ii++){
            this.deckField.addCard(new Card(this.ctx, "assets/cardback.png", "assets/cardback.png"));
        }
    }
    addHandCards(array){
        array.forEach(element => {
            this.handField.addCard(element, true, false);
        });
    }
    addPlayCards(array){
        array.forEach(element => {
            this.handField.addCard(element, true, false);
        });
    }
    addDiscardedCards(array){
        array.forEach(element => {
            this.handField.addCard(element);
        });
    }
    drawCards(deck, hand){
        //move cards from deck to hand then flip
        let ii = 0;
        while(deck.length > 0 && ii < 5){
            hand.push(deck.pop());
            ii++;
        }
        
        hand.forEach((element, index) => {
            setTimeout(() => { 
            element.movingToHand = true;
            element.setDestination(700+(index*element.frontWidth), 1100);
            }, index*300);
        });
    }
    playCards(){
        //move cards from hand to play field
    }
    discardCards(hand, discarded){
        //move cards from play to discard field
        //move cards from hand to discard field
        let ii = hand.length;
        while(hand.length > 0){
            const card = hand.pop();
            discarded.push(card);
            setTimeout(() => { 
            card.discarding = true;
            card.setDestination(cw*2-card.frontWidth+discarded.length-100, 300-discarded.length);
            }, 100*ii);
            ii--;
        }
    }
    matchStart(){
        this.inBattle = true;
        this.inQueue = false;
    }
    turnStart(){

    }
    displayOnlineUsers(number){
        ctx.font = "60px Arial";
        ctx.fillText("Online Users:", number,0,0);
    }
    sendToSocket(data){
        this.socket.send(data);
    }
}