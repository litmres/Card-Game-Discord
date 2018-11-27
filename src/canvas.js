"use strict"

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const cw=canvas.width;
const ch=canvas.height;
const gameScale = .5;

const allCards = [];
const doneRendered = [];
const cardDeck = [];
const handCards = [];
const discardStack =[];

const opponent = new Opponent(ctx, 30, 0);
const player = new Player(ctx, socket, 30);
player.fillDeckCards();

function createCards(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.font = "30px Arial";
  ctx.fillText("Rendering Cards...",50,50);
  
  const container = document.getElementsByClassName("container")[0];
  for (let item of container.children) {
    allCards.push(item);
  }
  
  for(let ii = 0; ii < allCards.length; ii++){
    render(allCards[ii]);
  }

  const interval = setInterval(()=>{
    if(allCards.length === doneRendered.length){
      clearInterval(interval);
      shuffle(doneRendered).forEach((element, index)=>{
        cardDeck.push(new Card(ctx, 200-index, 300-index, element.front, element.back));
      });
      doneRendered.length = 0;
      start();
    }
  }, 1000);
}

function shuffle(array) {
  for (let ii = array.length - 1; ii > 0; ii--) {
      const rnd = Math.floor(Math.random() * (ii + 1));
      [array[ii], array[rnd]] = [array[rnd], array[ii]];
  }

  return array;
}

function render(card){

  domtoimage.toPng(card, {
    width:190,
    height:300,
    })
    .then((dataUrl)=>{
      const front = dataUrl;
      const back = "assets/cardback.png";
      doneRendered.push({
        front:front,
        back:back,
      });
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}

function canDiscard(cards){
  for(let ii = 0; ii < cards.length; ii++){
    if(!cards[ii].isAtDestination() || !cards[ii].flipped){
      return false;
    }
  }
  return true;
}

function discardCards(hand, discarded){
  let ii = hand.length;
  while(hand.length > 0){
    const card = hand.pop();
    discarded.push(card);
    setTimeout(() => { 
      card.discarding = true;
      card.setDestination(cw*2-card.frontWidth+discarded.length-100, 300-discarded.length);
    }, 100*ii);
    ii--;
  }
}

function drawCards(deck, hand){
  let ii = 0;
  while(deck.length > 0 && ii < 5){
    hand.push(deck.pop());
    ii++;
  }
  
  hand.forEach((element, index) => {
    setTimeout(() => { 
      element.movingToHand = true;
      element.setDestination(700+(index*element.frontWidth), 1100);
    }, index*300);
  });
}

function start(){
  animate();
}

function animate(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  //ctx.font = "30px Arial";
  //ctx.fillText("Ready Click for Stuff to happen!",50,50);

  ctx.scale(gameScale,gameScale);

  player.drawFields();
  player.drawButtons();

  opponent.drawFields();
  
  /*
  cardDeck.forEach(element => element.drawBack());

  handCards.forEach((element) =>{
    if(!element.isAtDestination()){
      element.moveToDestination();
    }

    if(!element.isAtDestination() && !element.flipped){
      element.drawBack();
    }else if(element.isAtDestination() && element.movingToHand && !element.flipped){  
      element.flip();
    }else if(element.flipped){
      element.drawFront();
    }
  });

  discardStack.forEach((element) => {
    element.drawFront(); 
    element.moveToDestination()
  });
  */
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  requestAnimationFrame(animate);
}

function getMousePos(canvas, event, scale) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (event.clientX - rect.left)/scale,
		y: (event.clientY - rect.top)/scale
	};
}

function isInside(pos, obj){
	return pos.x > obj.x && pos.x < obj.x+obj.width && pos.y < obj.y+obj.height && pos.y > obj.y;
}

canvas.addEventListener('click', function(evt) {
  const mousePos = getMousePos(canvas, evt, gameScale);
	if (isInside(mousePos,endTurnButton)) {
    endTurnButton.onClick();
  }
  if (isInside(mousePos,queueButton)) {
    queueButton.onClick();
  }
  if (isInside(mousePos,surrenderButton)) {
    surrenderButton.onClick();
  }

  if(cardDeck.length > 0 && handCards.length === 0){
    drawCards(cardDeck, handCards);
  }else if(handCards.length > 0 && canDiscard(handCards)){
    discardCards(handCards, discardStack);
  }
}, false);

