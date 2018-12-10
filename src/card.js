class Card{
    constructor(ctx, frontImage, backImage, serverData = {}, gameScale){
      this.ctx = ctx;
      this.onCursor = false;
      this.x=0;
      this.y=0;
      this.gameScale = gameScale;
      this.dx = 0;
      this.dy = 0;
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
      this.frontImageData = undefined;
      this.frontWidth = 400*1.3;
      this.frontHeight = 563*1.3;
      this.back.src=backImage;
      this.movingToHand = false;
      this.flipped = false;
      this.discarding = false;
      this.originalMagnitude = 40;
      this.magnitude = this.originalMagnitude;
      this.serverData = serverData;
      this.moved = false;
    }
    setFrontImageData(data){
      this.frontImageData = data;
    }
    setFrontCard(image){
      this.front.src=image;
    }
    getFrontCard(){
      return this.front.src;
    }
    getDefense(){
      return this.serverData.defense;
    }
    getCurrentDefense(){
      return this.serverData.currentDefense;
    }
    setOnCursor(bool){
      this.onCursor = bool;
    }
    getOnCursor(){
      return !!this.onCursor;
    }
    resetMagnitude(){
      this.magnitude = this.originalMagnitude;
    }
    setServerData(data){
      this.serverData = data;
    }
    setPosition(x,y){
      this.x = x;
      this.y = y;
    }
    getPosition(){
      return {x:this.x,y:this.y};
    }
    getSize(){
      return {width: this.frontWidth, height:this.frontHeight};
    }
    getCardWidth(){
      return this.frontWidth;
    }
    isAtDestination(){
      return (
        this.x === this.dx && 
        this.y === this.dy
      );
    }
    setDestination(dx, dy, speed = this.originalMagnitude){
      this.magnitude = speed;
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
      if(this.isAtDestination()) return;
      if(this.getDistance(this.x, this.dx, this.y, this.dy) < this.magnitude){
        this.x = this.dx;
        this.y = this.dy;
        this.resetMagnitude();
      }else{
        this.x += this.velX;
        this.y += this.velY;
      }
    }
    getTransparentImageData(){
      /*
        this.ctx.drawImage(this.front, 0, 0, this.frontWidth, this.frontHeight);

        const image = this.ctx.getImageData(0, 0, this.frontWidth*this.gameScale, this.frontHeight*this.gameScale);
        const newColor = {
          r:0,
          g:0,
          b:0,
          a:0
        };

        const colorToReplace = image.data[0];
    
        for (let ii = 0; ii < image.data.length; ii += 4) {
          const r = image.data[ii];
          const g = image.data[ii+1];
          const b = image.data[ii+2];
        
          if(r === 47 && g === 51 && b === 54){ 
            image.data[ii] = newColor.r;
            image.data[ii+1] = newColor.g;
            image.data[ii+2] = newColor.b;
            image.data[ii+3] = newColor.a;
          }
        }

        return image;
        */
    }
    drawFront(){
      this.moveToDestination();

      if(!this.isAtDestination()){
        this.mergeImageWithBackground();
        this.moved = true;
      }else{
        if(this.onCursor || (this.moved && this.isAtDestination())){
          this.mergeImageWithBackground();
          this.moved = false;
        }
      }

      //this.ctx.drawImage(this.front, this.x, this.y, this.frontWidth, this.frontHeight);
      this.ctx.putImageData(this.frontImageData,this.x*this.gameScale, this.y*this.gameScale);

      if(this.getDefense() > this.getCurrentDefense()){
        drawDamageTaken();
      }
    }
    mergeImageWithBackground(){
      //optimize this awfullness somehow, makes the "transparent" (wich arent really transparent) pixels match pixels thats behind it
      const imageBelow = this.ctx.getImageData(this.x*this.gameScale, this.y*this.gameScale, this.frontWidth*this.gameScale, this.frontHeight*this.gameScale);

      this.ctx.drawImage(this.front, this.x, this.y, this.frontWidth, this.frontHeight);

      const image = this.ctx.getImageData(this.x*this.gameScale, this.y*this.gameScale, this.frontWidth*this.gameScale, this.frontHeight*this.gameScale);
  
      for (let ii = 0; ii < image.data.length; ii += 4) {
        const r = image.data[ii];
        const g = image.data[ii+1];
        const b = image.data[ii+2];
      
        if(r === 47 && g === 51 && b === 54){ 
          image.data[ii] = imageBelow.data[ii];//newColor.r;
          image.data[ii+1] =  imageBelow.data[ii+1];//newColor.g;
          image.data[ii+2] = imageBelow.data[ii+2];// newColor.b;
          image.data[ii+3] =  imageBelow.data[ii+3];//newColor.a;
        }
      }

      this.frontImageData = image;
    }
    drawDamageTaken(){
      this.ctx.font = "60px Arial";
      this.ctx.fillText(`- ${this.getDefense() - this.getCurrentDefense()}`,this.x + this.frontWidth,this.y);
    }
    drawBack(){
      this.moveToDestination();
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