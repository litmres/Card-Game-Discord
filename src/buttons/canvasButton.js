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
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = this.color;
      ctx.rect(this.x,this.y,this.width,this.height); 
      ctx.stroke();
      ctx.font = "60px Arial";
      ctx.fillText(this.text,this.x + this.width/4,this.y+this.height/2);
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