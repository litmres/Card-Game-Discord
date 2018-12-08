class DeckField extends Field{
    onClick(){
        console.log("deck");
    }
    drawCards(){
        this.cards.forEach(element => {
            element.drawBack();
        });
    }
}