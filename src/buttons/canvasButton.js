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
      this.enabled = true;
    }
    draw(){
      if(!this.enabled) return;
      this.ctx.beginPath();
      this.ctx.lineWidth = "6";
      this.ctx.strokeStyle = this.color;
      this.ctx.rect(this.x,this.y,this.width,this.height); 
      this.ctx.stroke();
      this.ctx.font = "60px Arial";
      this.ctx.fillText(this.text,this.x + this.width/4,this.y+this.height/2);
    }
    setEnabled(enabled){
      this.enabled = enabled;
    }
    isEnabled(){
      return !!this.enabled;
    }
    setText(text){
      this.text = text;
    }
    onClick(){
      if(!this.enabled) return;
      console.log("do something");
    }
    getPosition(){
      return {x:this.x, y:this.y};
    }
    getSize(){
      return {width:this.width, height:this.height};
    }
}