class Card{
    constructor(ctx, startX, startY, frontImage, backImage){
      this.ctx = ctx;
      this.x=startX;
      this.y=startY;
      this.dx = startX;
      this.dy = startY;
      this.velx = 0;
      this.vely = 0;
      this.scaleX=100;
      this.angle=0;
      this.scaleDirection=-10;
      this.scaleDelta=1;
      this.PI2=Math.PI*2;
      this.imgCount=2;
      this.front=new Image();
      this.back=new Image();
      this.front.src=frontImage;
      this.frontWidth = 400*1.3;
      this.frontHeight = 563*1.3;
      this.back.src=backImage;
      this.movingToHand = false;
      this.flipped = false;
      this.discarding = false;
      this.magnitude = 40;
    }
  
    isAtDestination(){
      return (
        this.x === this.dx && 
        this.y === this.dy
      );
    }
  
    setDestination(dx, dy){
      this.dx = dx;
      this.dy = dy;
      this.calcVel();
    }
  
    calcVel(){
      const dx = this.dx - this.x;
      const dy = this.dy - this.y;
      const angle = Math.atan2(dy, dx);
      this.velX = Math.cos(angle) * this.magnitude;
      this.velY = Math.sin(angle) * this.magnitude;
    }
  
    getDistance(x, dx, y, dy){
      const a = x - dx;
      const b = y - dy;
  
      const c = Math.sqrt( a*a + b*b );
  
      return c;
    }
  
    moveToDestination(){
      if(this.getDistance(this.x, this.dx, this.y, this.dy) < 40){
        this.x = this.dx;
        this.y = this.dy;
      }else{
        this.x += this.velX;
        this.y += this.velY;
      }
    }
  
    drawFront(){
      this.ctx.drawImage(this.front, this.x, this.y, this.frontWidth, this.frontHeight);
    }
  
    drawBack(){
      this.ctx.drawImage(this.back, this.x, this.y);
    }
  
    flip(){
      this.ctx.translate(this.x+(this.frontWidth/2),this.y+(this.frontHeight/2));
      //ctx.rotate(angle);
      this.ctx.scale(this.scaleX/100,1);
  
      if(this.scaleX>=0){
        this.ctx.drawImage(this.back, -this.back.width/2, -this.back.height/2);
      }else{
        this.ctx.drawImage(this.front, (this.front.width-this.frontWidth)/1.2, (this.front.height-this.frontHeight)/1.2, this.frontWidth, this.frontHeight);
      }
  
      this.ctx.setTransform(.5,0,0,.5,0,0);
  
      this.angle+=this.PI2/360;
  
      this.scaleX+=this.scaleDirection*this.scaleDelta;
  
      if(this.scaleX<-100 || this.scaleX>100){
        this.scaleDirection*=-1;
        this.scaleX+=this.scaleDirection*this.scaleDelta;
        this.flipped = true;
        this.movingToHand = false;
      }
    }
  }