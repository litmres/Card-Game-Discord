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
    removeHandCard(){
        this.cards.forEach((element,index)=>{
          if(element && element.getOnCursor()){
            this.cards[index] = undefined;
          }
        });
        console.log(this.cards);
    }
}