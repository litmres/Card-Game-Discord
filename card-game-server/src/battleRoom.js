module.exports = class BattleRoom{
    constructor(id, playerOne, playerTwo){
        this.id = id;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.players = [playerOne, playerTwo];
    }
	getPlayer(id){
		for(let ii = 0; ii < this.players.length; ii++){
            if(id === this.players[ii].id){
                return this.players[ii];
            }
        }
    }
    getOpponent(id){
        for(let ii = 0; ii < this.players.length; ii++){
            if(id !== this.players[ii].id){
                return this.players[ii];
            }
        }
    }
    getPlayers(){
        return this.players;
    }
    getPlayersEndedTurn(){
        return this.getPlayers().every(element => element.endTurn);
    }
    checkPlayerInRoom(player){
        return (this.playerOne === player || this.playerTwo === player);
    }
    endRoom(loser, TYPE, reason){
        const winner = this.getOpponent(this.getPlayer(loser.id).id);
        const obj = {
            winner: winner.id,
            loser: loser.id,
            reason: reason,
        }
        const data = TYPE.MSG_SEND_MATCH_END + TYPE.SPLITTER + JSON.stringify(obj);

        this.players.forEach(element =>{
            element.sendToSocket(data);
        });
    }
}