class SurrenderButton extends Button{
    onClick(){
        this.socket.send(TYPE.MSG_SEND_SURRENDER + TYPE.SPLITTER);
    }
}