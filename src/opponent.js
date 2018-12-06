class Opponent{
    constructor(ctx, deckSize, hand, canvasWidth, canvasHeight, gameScale, cardBack){
      this.ctx = ctx;
      this.cardBack = cardBack;
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
            this.deckField.addCard(new Card(this.ctx, "assets/cardback.png", "assets/cardback.png"), false, true, 1,-1, true);
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
    addHandCards(array){
        array.forEach((element,index) => {
            setTimeout(()=>{
                this.handField.addCard(element, true, false);
            }, index * 500);
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
    drawCards(amount){
        console.log("Opponent: drawing cards");
        const array = [];
        for(let ii = 0; ii < amount; ii++){
            array.push(new Card(new Card(this.ctx, this.cardBack, this.cardBack, undefined, this.gameScale)));
        }
        this.addHandCards(array);
        //move cards from deck to hand then flip
    }
    playCards(cards){
        console.log("Opponent: playing cards");
        this.handField.getCards().forEach((element, index)=>{
            if(element.getCard() && this.checkIdInArray(cards, element.getCard().serverData.id)){
                setTimeout(() => {
                    this.playField.addCard(element.getCard());
                    element.setCard(undefined);
                }, 300*index);
            }
        });
        //move cards from hand to play field
    }
    deadCards(cards){
        console.log("Opponent: removing dead cards");
        this.playField.getCards().forEach((element, index)=>{
            if(element.getCard() && this.checkIdInArray(cards, element.getCard().serverData.id)){
                setTimeout(() => {
                    this.discardField.addCard(element.getCard());
                    element.setCard(undefined);
                }, 300*index);
            }
        });
    }
    checkIdInArray(array, id){
        const filtered = array.filter(element=> (element && element.id === id));
        return filtered.length > 0;
    }
    discardCards(cards){
        console.log("Opponent: discarding cards");
        let ii = this.handField.getCards().length;
        while(this.handField.getCards().length > 0){
            const card = this.handField.getCards().pop();
            if(card){
                setTimeout(() => {
                    this.discardField.addCard(card);
                }, 300*ii);
            }
            ii--;
        }
        //move cards from play to discard field
        //move cards from hand to discard field
    }
}