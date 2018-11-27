class PlayField extends Field{
    onClick(){
        console.log("play")
    }
    drawCards(){
        this.cards.forEach(element => {
            element.drawFront();
        });
    }
}