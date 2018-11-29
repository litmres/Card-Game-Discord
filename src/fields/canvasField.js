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
    getCards(){
      return this.cards;
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
    addCard(element, offset = false, stack = true, simpleOffsetX = 0, simpleOffsetY = 0, fixed = false){
      //offset based on value
      if(simpleOffsetX && this.cards.length > 0){
        simpleOffsetX = this.cards.length*simpleOffsetX;
      }
      //offset based on value
      if(simpleOffsetY && this.cards.length > 0){
        simpleOffsetY = this.cards.length*simpleOffsetY;
      }
      //gives each card an even offset
      let evenOffset = 0;
      if(offset && this.cards.length > 0){
        evenOffset = (this.width - (element.getCardWidth()*this.maxSize)) / (this.maxSize-1);
      }
      //puts each card next to eachother
      let exponentialX = 0;
      if(!stack){
        exponentialX = element.getCardWidth() * this.cards.length;
      }

      element.setDestination(this.x + evenOffset + exponentialX + simpleOffsetX, this.y + simpleOffsetY);

      if(fixed){
        element.setPosition(this.x + evenOffset + exponentialX + simpleOffsetX, this.y + simpleOffsetY);
      }
      
      this.cards.push(element);
    }
    onClick(){
      console.log("do something");
    }
}