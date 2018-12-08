class QueueButton extends Button{
    onClick(inQueue){
        if(inQueue){
            console.log("leaving queue");
            this.socket.send(TYPE.MSG_SEND_LEAVE_QUEUE);
            this.setText("Join Queue");
        }else {
            console.log("joining queue");
            this.socket.send(TYPE.MSG_SEND_JOIN_QUEUE);
            this.setText("Leave Queue");
        }
    }
    clear(){
        this.setText("Join Queue");
    }
}