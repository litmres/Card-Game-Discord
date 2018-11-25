module.exports = class BattleRoom{
    constructor(id, playerOne, playerTwo){
        this.id = id;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
	getPlayer(id){
		if(this.playerOne.id === id){
			return this.playerOne;
		}else{
			return this.playerTwo;
		}
	}
    getPlayers(){
        return [this.playerOne, this.playerTwo];
    }
    getPlayersEndedTurn(){
        return this.getPlayers().every(element => element.endTurn);
    }
    checkPlayerInRoom(player){
        return (this.playerOne === player || this.playerTwo === player);
    }
}