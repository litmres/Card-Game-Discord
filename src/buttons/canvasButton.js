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
      this.disabledColor = "grey";
      this.borderColor = "black";
      this.textColor = "black";
      this.enabled = true;
      this.particles = [];
      this.particleAmount = 20;
      this.hover = false;
    }
    setHover(bool){
      this.hover = bool;
    }
    draw(){
      if(!this.enabled) return;
      this.ctx.beginPath();
      this.ctx.lineWidth = "6";
      this.ctx.strokeStyle = this.borderColor;
      if(this.enabled){
        this.ctx.fillStyle = this.color;
      }else{
        this.ctx.fillStyle = this.disabledColor;
      }
      this.ctx.rect(this.x,this.y,this.width,this.height); 
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.font = "60px Arial";
      this.ctx.fillStyle = this.textColor;
      const fontWidth = this.ctx.measureText(this.text).width;
      const equalOffsetX = (this.width - fontWidth)/2;
      this.ctx.fillText(this.text,this.x + equalOffsetX,this.y+this.height/2);

      this.drawParticles();
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
    setColor(color){
      this.color = color;
    }
    drawParticles(){
      if(!this.hover) return;
      const bottom = this.y;
      const top = this.y + this.height;
      const left = this.x;
      const right = this.x + this.width;

      this.particles = this.particles.filter(element => element.inside(this.x, this.y, this.width, this.height));
     
      while(this.particleAmount > this.particles.length){
        const x = this.getRandomNumber(left, right);
        const y = this.getRandomNumber(bottom, top);
        const dx = this.getRandomNumber(0, 500);
        const dy = this.getRandomNumber(0, 500);
        const angle = this.getRandomNumber(0, 360);
        const radius = this.getRandomNumber(3, 20);
        const alpha = this.getRandomNumber(0,4)/10;
        this.particles.push(new Particle(x, y, angle, "blue", "darkblue", alpha, radius, this.ctx));
      }

      this.particles.forEach(element=>{
        element.draw();
      });

    }
    getRandomNumber(min, max){
      return Math.floor(Math.random()*(max-min+1)+min);
    }
}