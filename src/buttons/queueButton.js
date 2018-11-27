class QueueButton extends Button{
    onClick(inQueue){
        if(inQueue){
            this.socket.send(TYPE.MSG_SEND_LEAVE_QUEUE);
            this.setText("Join Queue");
        }else {
            this.socket.send(TYPE.MSG_SEND_JOIN_QUEUE);
            this.setText("Leave Queue");
        }
    }
}