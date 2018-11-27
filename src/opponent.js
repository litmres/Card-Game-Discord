class Opponent{
    constructor(ctx, deckSize, hand){
      this.ctx = ctx;
      this.hand = hand;
      this.discarded = [];
      this.deckSize = deckSize;
      this.discordID = null;
      this.cardWidth = 500;
      this.cardHeight = 700;
      this.playField = new PlayField(this.ctx, 650, 500, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.handField = new HandField(this.ctx, 650, 0, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.deckField = new DeckField(this.ctx, 50, 0, this.cardWidth, this.cardHeight, "red", this.socket);
      this.discardField = new DiscardField(this.ctx, 3250, 800, this.cardWidth, this.cardHeight, "red", this.socket);
    }
    drawFields(){
        this.playField.draw();
        this.handField.draw();
        this.deckField.draw();
        this.discardField.draw();
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
}