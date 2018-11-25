class Field{
    constructor(ctx, x, y, w, h, color, socket){
      this.width = w;
      this.height = h;
      this.x = x;
      this.y = y;
      this.ctx = ctx;
      this.socket = socket;
      this.color = color;
    }
    draw(){
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = this.color;
      ctx.rect(this.x,this.y,this.width,this.height); 
      ctx.stroke();
    }
    onClick(){
      console.log("do something");
    }
}