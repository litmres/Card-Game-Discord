class HandField extends Field{
    onClick(){
        console.log("hand")
    }
    drawCards(){
        this.cards.forEach(element => {
            element.drawFront();
          });
    }
}