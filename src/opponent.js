class Opponent{
    constructor(ctx, deckSize, hand, canvasWidth, canvasHeight, gameScale){
      this.ctx = ctx;
      this.canvasWidth = canvasWidth/gameScale;
      this.canvasHeight = canvasHeight/gameScale;
      this.hand = hand;
      this.discarded = [];
      this.deckSize = deckSize;
      this.discordID = null;
      this.cardWidth = 400;
      this.cardHeight = 563;
      this.playField = new PlayField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2-this.cardHeight, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.handField = new HandField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2-this.cardHeight*2-50, this.cardWidth*5, this.cardHeight, "red", this.socket);
      this.deckField = new DeckField(this.ctx, this.canvasWidth-50-this.cardWidth, 50, this.cardWidth, this.cardHeight, "red", this.socket);
      this.discardField = new DiscardField(this.ctx, 50, 50, this.cardWidth, this.cardHeight, "red", this.socket);
    }
    fillDeckCards(){
        for(let ii = 0; ii < this.deckSize; ii++){
            this.deckField.addCard(new Card(this.ctx, "assets/cardback.png", "assets/cardback.png"), false, true, 1,1, true);
        }
    }
    drawFields(){
        this.playField.drawField();
        this.handField.drawField();
        this.deckField.drawField();
        this.discardField.drawField();
    }
    drawFieldCards(){
        this.playField.drawCards();
        this.handField.drawCards();
        this.deckField.drawCards();
        this.discardField.drawCards();
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