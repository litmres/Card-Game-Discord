class PlayField extends Field{
    constructor(ctx, x, y, w, h, color, maxSize, socket){
        super(ctx, x, y, w, h, color, maxSize, socket);
        this.cards = [];
        this.fillPlayField();
    }
    onClick(){
        console.log("play")
    }
    fillPlayField(){
        for(let ii = 0; ii < 5; ii++){
            const card = new EmptyCardField(this.ctx, this.x, this.y, 400, 563, "green", "yellow", this.maxSize, this.width, this.height);
            card.setPosition(ii);
            this.cards.push(card);
        }
    }
    setEmptyCardFieldColor(color){
        this.emptyCardFieldColor = color;
    }
    drawCards(){
        this.cards.forEach((element) => {
            if(element){
                element.drawFront();
            }
        });
    }
}