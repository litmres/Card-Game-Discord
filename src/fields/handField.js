class HandField extends Field{
    onClick(){
        console.log("hand")
    }
    drawCards(){
        this.cards.forEach(element => {
            if(element){
                element.drawFront();
            }
        });
    }
    removeHandCard(card){
        this.cards.forEach((element,index)=>{
          if(element && element.getOnCursor() && card.serverData.id === element.serverData.id){
            this.cards[index] = undefined;
          }
        });
    }
    drawOpponentCards(){
        this.cards.forEach(element => {
            if(element){
                element.drawBack();
            }
        });
    }
}