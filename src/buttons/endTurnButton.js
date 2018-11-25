class EndTurnButton extends Button{
    onClick(cards){
        this.socket.send(TYPE.MSG_SEND_PLAY_CARDS + TYPE.SPLITTER + JSON.stringify(cards));
        this.socket.send(TYPE.MSG_SEND_END_TURN + TYPE.SPLITTER);
    }
}