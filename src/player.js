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
      this.playField = new PlayField(this.ctx, 650, 800, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.handField = new HandField(this.ctx, 650, 900+this.cardHeight, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.deckField = new DeckField(this.ctx, 50, 800, this.cardWidth, this.cardHeight, "red", this.socket);
      this.discardField = new DiscardField(this.ctx, 3250, 800, this.cardWidth, this.cardHeight, "red", this.socket);
    }
    setEndTurn(turn){
		this.endTurn = turn;
    }
    drawPlayField(){
        this.playField.draw();
    }
    drawHandField(){
        this.handField.draw();
    }
    drawDeckField(){
        this.deckField.draw();
    }
    drawDiscardField(){
        this.discardField.draw();
    }
    drawCards(){

    }
    playCards(){

    }
    discardCards(){

    }
    isInBattle(){
        return false;
    }
    sendToSocket(data){
        this.socket.send(data);
    }
}