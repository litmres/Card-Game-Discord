class EndTurnButton extends Button{
    onClick(cards){
        const array = [];
        cards.forEach(element => {
            if(element.getCard()){
                array.push(element.getCard().serverData.id);
            }else{
                array.push(undefined);
            }
        });
        this.socket.send(TYPE.MSG_SEND_PLAY_CARDS + TYPE.SPLITTER + JSON.stringify(array));
        this.socket.send(TYPE.MSG_SEND_END_TURN + TYPE.SPLITTER);
    }
}