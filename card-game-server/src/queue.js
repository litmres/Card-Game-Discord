module.exports = class Queue{
    constructor(id){
        this.id = id;
        this.queue = [];
    }
    addPlayer(player){
        this.queue.push(player);
    }
    removePlayer(players){
        const removed = this.queue.filter(element => !players.includes(element));
        this.queue = removed;
    }
    getLength(){
        return this.queue.length;
    }
    getPlayer(){
        return this.queue.pop();
    }
}