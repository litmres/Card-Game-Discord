class Opponent{
    constructor(ctx, deckSize, allCards, canvasWidth, canvasHeight, gameScale, cardBack, maxSize){
      this.ctx = ctx;
      this.cardBack = cardBack;
      this.gameScale = gameScale;
      this.allCards = allCards;
      this.canvasWidth = canvasWidth/gameScale;
      this.canvasHeight = canvasHeight/gameScale;
      //this.hand = hand;
      this.maxSize = maxSize;
      this.discarded = [];
      this.deckSize = deckSize;
      this.discordID = null;
      this.cardWidth = 400*1.3;
      this.cardHeight = 563*1.3;
      this.playField = new PlayField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2-this.cardHeight, this.cardWidth*5, this.cardHeight, "red", this.maxSize, this.socket);
      this.handField = new HandField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2-this.cardHeight*2-50, this.cardWidth*5, this.cardHeight, "red", this.maxSize, this.socket);
      this.deckField = new DeckField(this.ctx, this.canvasWidth-50-this.cardWidth/1.3, this.canvasHeight/2 - this.cardHeight/1.3 - 150, this.cardWidth/1.3, this.cardHeight/1.3, "red", this.maxSize, this.socket);
      this.discardField = new DiscardField(this.ctx, 50, this.canvasHeight/2 - this.cardHeight/1.3 - 150, this.cardWidth/1.3, this.cardHeight/1.3, "red", this.maxSize, this.socket);
    }
    fillDeckCards(){
        for(let ii = 0; ii < this.deckSize; ii++){
            this.deckField.addCard(new Card(this.ctx, this.cardBack, this.cardBack), false, true, 1,-1, true);
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
        this.handField.drawOpponentCards();
        this.deckField.drawCards();
        this.discardField.drawOpponentCards();
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
            array.push(new Card(this.ctx, this.cardBack, this.cardBack, undefined, this.gameScale));
        }
        array.forEach(element=>{
            element.setPosition(this.deckField.getPosition().x, this.deckField.getPosition().y);
        });
        this.addHandCards(array);
        //move cards from deck to hand then flip
    }
    playCards(cards){
        console.log("Opponent: playing cards");
        cards.forEach((element, index)=>{
            if(!element) return;
            this.handField.getCards()[index].setServerData(element);
            this.allCards.forEach((card, ii)=>{
                if(card.serverData.id === element.id){
                    this.handField.getCards()[index].setFrontCard(card.front);
                }
            });
        });

        const array = [];
        this.handField.getCards().forEach((element, index)=>{
            if(element.serverData && this.checkIdInArray(cards, element.serverData.id)){
                array.push(element);
                this.handField.getCards()[index] = undefined;
            }else{
                array.push(undefined);
            }
        });

        array.forEach((element, index)=>{
            if(element){
                setTimeout(() => {
                    this.playField.getCards()[index].setCard(element);
                    const x = this.playField.getCards()[index].getPosition().x;
                    const y = this.playField.getCards()[index].getPosition().y;
                    element.setDestination(x,y);
                }, 300*index);
            }
        });
        
        //move cards from hand to play field
    }
    deadCards(cards){
        console.log("Opponent: removing dead cards");
        console.log(cards);
        this.playField.getCards().forEach((element, index)=>{
            const card = element.getCard();
            if(card){
                console.log(card, cards, card.serverData.id);
            }
            if(card && this.checkIdInArray(cards, card.serverData.id)){
                setTimeout(() => {
                    console.log(card);
                    this.discardField.addCard(card);
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
    matchEnd(){
        this.playField.clear();
        this.deckField.clear();
        this.discardField.clear();
        this.handField.clear();
    }
}