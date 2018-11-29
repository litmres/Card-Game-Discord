"use strict"

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const cw=canvas.width;
const ch=canvas.height;
const gameScale = .4;

const UNRENDEREDCARDS = [];
const RENDEREDCARDS = [];
//const cardDeck = [];
//const handCards = [];
//const discardStack =[];

const opponent = new Opponent(ctx, 30, 0, cw, ch, gameScale);
const player = new Player(socket, ctx, 30, RENDEREDCARDS, cw, ch, gameScale);

function createCards(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.font = "30px Arial";
  ctx.fillText("Rendering Cards...",50,50);
  
  const container = document.getElementsByClassName("container")[0];
  for (let item of container.children) {
    UNRENDEREDCARDS.push(item);
  }
  
  for(let ii = 0; ii < UNRENDEREDCARDS.length; ii++){
    render(UNRENDEREDCARDS[ii]);
  }

  const interval = setInterval(()=>{
    if(UNRENDEREDCARDS.length === RENDEREDCARDS.length){
      clearInterval(interval);
      /*
      shuffle(doneRendered).forEach((element, index)=>{
        cardDeck.push(new Card(ctx, 200-index, 300-index, element.front, element.back));
      });
      doneRendered.length = 0;
      */
      start();
    }
  }, 500);
}

function render(card){
  domtoimage.toPng(card, {
    width:190,
    height:300,
    })
    .then((dataUrl)=>{
      RENDEREDCARDS.push({
        serverData: JSON.parse(card.childNodes[0].firstChild.textContent),
        front:dataUrl,
        back:"assets/cardback.png",
      });
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}

function start(){
  player.fillDeckCards();
  opponent.fillDeckCards();
  animate();
}

function animate(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  //ctx.font = "30px Arial";
  //ctx.fillText("Ready Click for Stuff to happen!",50,50);

  ctx.scale(gameScale,gameScale);

  player.drawFields();
  player.drawFieldCards();
  player.drawButtons();

  if(player.isInBattle()){
    opponent.drawFields();
    opponent.drawFieldCards();
    opponent.drawCards();
  }
  
  
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
  return (
    pos.x > obj.getPosition().x &&
    pos.x < obj.getPosition().x+obj.getSize().width &&
    pos.y < obj.getPosition().y+obj.getSize().height &&
    pos.y > obj.getPosition().y
  );
}

canvas.addEventListener('click', function(evt) {
  const mousePos = getMousePos(canvas, evt, gameScale);
	if(player.getEndTurnButton().isEnabled() && isInside(mousePos, player.getEndTurnButton())) {
    player.getEndTurnButton().onClick();
  }else if(player.getQueueButton().isEnabled() && isInside(mousePos, player.getQueueButton())) {
    player.getQueueButton().onClick();
  }else if(player.getSurrenderButton().isEnabled() && isInside(mousePos, player.getSurrenderButton())) {
    player.getSurrenderButton().onClick();
  }else{
    console.log("no button has been pressed");
  }
  
  const array = [];
  player.getHandCards().forEach(element=>{
    if(isInside(mousePos, element)){
      array.push(element);
      console.log("player clicked a card");
    }
  });
  //player.removeFromHand(array);
  player.addPlayCards(array);

  /*
  if(cardDeck.length > 0 && handCards.length === 0){
    drawCards(cardDeck, handCards);
  }else if(handCards.length > 0 && canDiscard(handCards)){
    discardCards(handCards, discardStack);
  }
  */
}, false);

socket.addEventListener('message', function(event) {
  const type = parseInt(extractType(event.data));
  const data = extractValue(event.data);
  switch(type){
  case TYPE.MSG_RECEIVE_MATCH_START: player.matchStart(data);
  break;
  case TYPE.MSG_RECEIVE_TURN_START: player.turnStart(data);
  break;
  case TYPE.MSG_RECEIVE_DRAW_CARDS: player.drawCards(data);
  break;
  case TYPE.MSG_RECEIVE_DISCARD_CARDS: player.discardCards(data);
  break;
  case TYPE.MSG_RECEIVE_PLAY_CARDS: player.playCards(data);
  break;
  case TYPE.MSG_RECEIVE_DEAD_CARDS: player.deadCards(data);
  break;
  case TYPE.MSG_RECEIVE_ONLINE_USERS: player.displayOnlineUsers(data);
  break;
  case TYPE.MSG_RECEIVE_ALL_CARDS: receivedAllCards(data);
  break;
      default: console.log("type not found", event.data);
  }
});