class DiscardField extends Field{
    onClick(){
       console.log("discard")
    }
    drawCards(){
        this.cards.forEach(element => {
            element.drawFront();
        });
    }
    
}