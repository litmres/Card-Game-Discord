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
    checkWinCondition(){
        const size = this.players.filter(element => element.getCurrentDeckSize() < 1);
        console.log(size)
        return size.length > 1;
    }
    getLoser(){
        const stats = [];
        this.players.forEach(player =>{
            stats.push(player.getCombinedStats());
        });

        stats.sort(function compareNumbers(a, b) {
            return a.total - b.total;
        });

        return stats[1].player;
    }
    endRoom(loser, TYPE, reason){
        const winner = this.getOpponent(this.getPlayer(loser.id).id);

        this.players.forEach(element =>{
            const obj = {
                winner: winner.discordID || `${(winner.id === element.id) ? "you won" : "other person won"}`,
                loser: loser.discordID || `${(loser.id === element.id) ? "you lost" : "other person lost"}`,
                reason: reason,
            }
            const data = TYPE.MSG_SEND_MATCH_END + TYPE.SPLITTER + JSON.stringify(obj);
            element.sendToSocket(data);
        });
    }
}