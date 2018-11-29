class Player{
    constructor(socket, ctx, deckSize, allCards, canvasWidth, canvasHeight, gameScale){
      this.socket = socket;
      this.ctx = ctx;
      this.gameScale = gameScale;
      this.canvasWidth = canvasWidth/gameScale;
      this.canvasHeight = canvasHeight/gameScale;
      this.allCards = allCards
      this.hand = [];
      this.discarded = [];
      this.deckSize = deckSize;
      this.discordID = null;
      this.endTurn = false;
      this.cardWidth = 400;
      this.cardHeight = 563;
      this.mustPlay = 1;
      this.inBattle = false;
      this.inQueue = false;
      this.playField = new PlayField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight-(this.cardHeight*1.5)-50, this.cardWidth*5, this.cardHeight, "blue", this.socket);
      this.handField = new HandField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight-(this.cardHeight/2), this.cardWidth*5, this.cardHeight, "blue", this.socket);
      this.deckField = new DeckField(this.ctx, 50, this.canvasHeight-this.cardHeight-50, this.cardWidth, this.cardHeight, "blue", this.socket);
      this.discardField = new DiscardField(this.ctx, this.canvasWidth-50-this.cardWidth, this.canvasHeight-this.cardHeight-50, this.cardWidth, this.cardHeight, "blue", this.socket);
      this.endTurnButton = new EndTurnButton(this.ctx, this.canvasWidth-50-400, this.canvasHeight/2-(200/2), 400, 200, "End Turn", "green", this.socket);
      this.queueButton = new QueueButton(this.ctx, this.canvasWidth/2-(400/2), 200/2, 400, 200, "Join Queue", "yellow", this.socket);
      this.surrenderButton = new SurrenderButton(this.ctx, 50, this.canvasHeight/2-(200/2), 400, 200, "Surrender", "red", this.socket);
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
        this.getEndTurnButton().setEnabled(!!this.inBattle);
        this.getSurrenderButton().setEnabled(!!this.inBattle);
        this.getQueueButton().setEnabled(!this.inBattle);
        
        this.getEndTurnButton().draw();
        this.getSurrenderButton().draw();
        this.getQueueButton().draw(this.inQueue);
    }
    isInBattle(){
        return !!this.inBattle;
    }
    drawFields(){
        if(!this.inBattle) return;
        this.playField.drawField();
        this.handField.drawField();
        this.deckField.drawField();
        this.discardField.drawField();
    }
    drawFieldCards(){
        if(!this.inBattle) return;
        this.playField.drawCards();
        this.handField.drawCards();
        this.deckField.drawCards();
        this.discardField.drawCards();
    }
    fillDeckCards(){
        for(let ii = 0; ii < this.deckSize; ii++){
            this.deckField.addCard(new Card(this.ctx, "assets/cardback.png", "assets/cardback.png"), false, true, -1,-1);
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
            this.handField.addCard(element, false, true, -1, 1);
        });
    }
    drawCards(data){
        console.log(data)

        //move cards from deck to hand then flip

        const array = [];
        data.forEach(element=>{
            array.push(new Card(this.ctx, element.image, "assets/cardback.png", element, this.gameScale));
        });

        this.addHandCards(array);
        
        /*
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
        */
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