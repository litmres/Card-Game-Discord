class DiscardField extends Field{
    onClick(){
       console.log("discard")
    }
    drawCards(){
        this.cards.forEach(element => {
            element.drawFront();
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