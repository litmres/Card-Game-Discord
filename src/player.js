class Player{
    constructor(socket, ctx, deckSize){
      this.socket = socket;
      this.ctx = ctx;
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
    drawCards(){
        //move cards from deck to hand then flip
    }
    playCards(){
        //move cards from hand to play field
    }
    discardCards(){
        //move cards from play to discard field
        //move cards from hand to discard field
    }
    displayOnlineUsers(number){
        ctx.font = "60px Arial";
        ctx.fillText("Online Users:", number,0,0);
    }
    sendToSocket(data){
        this.socket.send(data);
    }
}