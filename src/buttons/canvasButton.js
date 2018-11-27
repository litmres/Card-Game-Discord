class Button{
    constructor(ctx, x, y, w, h, text, color, socket){
      this.width = w;
      this.height = h;
      this.x = x;
      this.y = y;
      this.ctx = ctx;
      this.socket = socket;
      this.text = text;
      this.color = color;
    }
    draw(){
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = this.color;
      ctx.rect(this.x,this.y,this.width,this.height); 
      ctx.stroke();
      ctx.font = "60px Arial";
      ctx.fillText(this.text,this.x + this.width/4,this.y+this.height/2);
    }
    setText(text){
      this.text = text;
    }
    onClick(){
      console.log("do something");
    }
}