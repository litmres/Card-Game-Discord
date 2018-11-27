class Field{
    constructor(ctx, x, y, w, h, color, maxSize, socket){
      this.width = w;
      this.height = h;
      this.x = x;
      this.y = y;
      this.ctx = ctx;
      this.socket = socket;
      this.color = color;
      this.maxSize = maxSize;
      this.cards = [];
    }
    drawField(){
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = this.color;
      ctx.rect(this.x,this.y,this.width,this.height); 
      ctx.stroke();
    }
    drawCards(){
      this.cards.forEach(element => {
        element.drawBack();
      });
    }
    addCards(element, offset = false, stack = true){
      let evenOffset = 0;
      if(offset && this.cards.length > 0){
        evenOffset = (this.width - (element.getCardWidth()*this.maxSize)) / (this.maxSize-1);
      }
      let exponentialx = 0;
      if(!stack){
        exponentialx = element.getCardWidth() * this.cards.length;
      }
      element.setPosition(this.x + evenOffset + exponentialx, this.y);
      this.cards.push(element);
    }
    onClick(){
      console.log("do something");
    }
}