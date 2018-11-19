const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const cw=canvas.width;
const ch=canvas.height;

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
    this.back.src=backImage;
    this.movingToHand = false;
    this.flipped = false;
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
    const magnitude = 40;
    this.velX = Math.cos(angle) * magnitude;
    this.velY = Math.sin(angle) * magnitude;
  }

  moveToDestination(){
    if(this.x+this.velX > this.dx){
      this.x = this.dx;
    }else{
      this.x += this.velX;
    }

    if(this.y+this.velY > this.dy){
      this.y = this.dy;
    }else{
      this.y += this.velY;
    }
  }

  drawFront(){
    this.ctx.drawImage(this.front, this.x, this.y);
  }

  drawBack(){
    this.ctx.drawImage(this.back, this.x, this.y);
  }

  flip(){
    this.ctx.translate(this.x,this.y);
    //ctx.rotate(angle);
    this.ctx.scale(this.scaleX/100,1);

    if(this.scaleX>=0){
      this.ctx.drawImage(this.front, -this.back.width/2, -this.y+900);
    }else{
      this.ctx.drawImage(this.back, -this.back.width/2, -this.y+900);
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

const allCards = [];
const cardDeck = [];
const handCards = [];

async function createCards(){
  const container = document.getElementsByClassName("container")[0];
  for (let item of container.children) {
    allCards.push(item);
  }
  
  for(let ii = 0; ii < allCards.length; ii++){
    render(allCards[ii], ii);
  }

  start();
}

function render(card, index){
  html2canvas(card, {
    allowTaint : false, 
    useCORS: true,
    scale: 2.5,
  }).then((canvas)=> {
    const front = canvas.toDataURL("image/jpeg", 1.0);
    const back = "assets/cardback.png";
    cardDeck.push(new Card(ctx, 100-index, 150-index, front, back));
  });
}

canvas.addEventListener('click', function() {
  if(cardDeck.length > 0 && handCards.length === 0){
    drawCards();
  }else{
    discardCards();
  }
}, false);

function discardCards(){
  for(let ii = 0; ii < handCards.length; ii++){
    if(!handCards[ii].isAtDestination() || !handCards[ii].flipped){
      return;
    }
  }
  handCards.length = 0;
}

function drawCards(){
  let ii = 0;
  while(cardDeck.length > 0 && ii < 5){
    handCards.push(cardDeck.pop());
    ii++;
  }
  
  handCards.forEach((element, index) => {
    setTimeout(() => { 
      element.movingToHand = true;
      element.setDestination(600+(index*420), 900);
    }, index*300);
  });
}

function start(){
  animate();
}

function animate(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.scale(.5,.5);

  cardDeck.forEach(element => element.drawBack());

  handCards.forEach((element) =>{
    if(!element.isAtDestination() && !element.flipped){
      element.drawBack();
      element.moveToDestination();
    }else if(element.isAtDestination() && element.movingToHand && !element.flipped){  
      element.flip();
    }else if(element.isAtDestination() && element.flipped){
      element.drawFront();
    }
  });

  ctx.scale(2,2);
  requestAnimationFrame(animate);
}