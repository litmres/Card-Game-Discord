class Player{
    constructor(socket, ctx, deckSize, allCards, canvasWidth, canvasHeight, gameScale, maxSize){
      this.socket = socket;
      this.ctx = ctx;
      this.gameScale = gameScale;
      this.canvasWidth = canvasWidth/gameScale;
      this.canvasHeight = canvasHeight/gameScale;
      this.allCards = allCards
      this.onlineUsers = 0;
      this.maxSize = maxSize;
      this.deckSize = deckSize;
      this.discordID = null;
      this.endTurn = false;
      this.cardWidth = 400*1.3;
      this.cardHeight = 563*1.3;
      this.mustPlay = 1;
      this.inBattle = false;
      this.inQueue = false;
      this.playField = new PlayField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2, this.cardWidth*5, this.cardHeight, "blue", this.maxSize, this.socket);
      this.handField = new HandField(this.ctx, (this.canvasWidth-(this.cardWidth*5))/2, this.canvasHeight/2+this.cardHeight+50, this.cardWidth*5, this.cardHeight, "blue", this.maxSize, this.socket);
      this.deckField = new DeckField(this.ctx, 50, this.canvasHeight/2 + 150, this.cardWidth/1.3, this.cardHeight/1.3, "blue", this.maxSize, this.socket);
      this.discardField = new DiscardField(this.ctx, this.canvasWidth-50-this.cardWidth/1.3, this.canvasHeight/2 + 150, this.cardWidth/1.3, this.cardHeight/1.3, "blue", this.maxSize, this.socket);
      this.endTurnButton = new EndTurnButton(this.ctx, this.canvasWidth-50-400, this.canvasHeight/2-(200/2), 400, 200, "End Turn", "green", this.socket);
      this.queueButton = new QueueButton(this.ctx, this.canvasWidth/2-(400/2), 200/2, 400, 200, "Join Queue", "yellow", this.socket);
      this.surrenderButton = new SurrenderButton(this.ctx, 50, this.canvasHeight/2-(200/2), 400, 200, "Surrender", "red", this.socket);
    }
    getInQueue(){
        return !!this.inQueue;
    }
    setQueue(bool){
        this.inQueue = bool;
    }
    getPlayCards(){
        return this.playField.getCards();
    }
    getHandCards(){
        return this.handField.getCards();
    }
    removeHandCard(card){
        this.handField.removeHandCard(card);
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
        this.getQueueButton().draw();
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
            this.deckField.addCard(new Card(this.ctx, "assets/cardback.png", "assets/cardback.png"), false, true, -1,-1, true);
        }
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
            this.playField.addCard(element, true, false);
        });
    }
    addDiscardedCards(array){
        array.forEach(element => {
            this.handField.addCard(element, false, true, -1, 1);
        });
    }
    drawCards(data){
        console.log("Player: drawing cards")
        //data = data.filter(element=> element !== null);
        const array = [];
        data.forEach(element=>{
            this.allCards.forEach(value =>{
                if(element.id === value.serverData.id){
                    array.push(new Card(this.ctx, value.front, value.back, element, this.gameScale));
                }
            });
        });

        array.forEach(element=>{
            element.setPosition(this.deckField.getPosition().x, this.deckField.getPosition().y);
        });

        this.addHandCards(array);
    }
    playCards(){
        //move cards from hand to play field
    }
    deadCards(cards){
        console.log("Player: removing dead cards");
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
        console.log("Player: discarding cards");
        //move cards from play to discard field
        //move cards from hand to discard field
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
    }
    matchStart(){
        console.log("match started")
        this.inBattle = true;
        this.inQueue = false;
    }
    matchEnd(data){
        this.inBattle = false;
        this.playField.clear();
        this.deckField.clear();
        this.discardField.clear();
        this.handField.clear();
        this.QueueButton.clear();
    }
    turnStart(){
        console.log("turn start")
    }
    setOnlineUsers(data){
        this.onlineUsers = data;
    }
    drawOnlineUsers(){
        if(this.inBattle) return;
        this.ctx.font = "60px Arial";
        const x = this.getQueueButton().getPosition().x;
        const y = this.getQueueButton().getPosition().y - 20;
        this.ctx.fillText(`Online Users: ${this.onlineUsers}`,x, y);
    }
    sendToSocket(data){
        this.socket.send(data);
    }
}