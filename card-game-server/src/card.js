module.exports = class Card{
    constructor(id, name, image, attack, defense, level, description, isSpecial, position = 0){
        this.attack = attack;
        this.defense = defense;
        this.currentDefense = defense;
        this.level = level;
        this.description = description;
        this.image = image;
        this.name = name;
        this.id = id;
        this.isSpecial = isSpecial;
        this.position = position;
    }
    getCurrentDefense(){
        return this.currentDefense;
    }
    lowerDefense(amount){
        this.currentDefense-=amount;
    }
    isDead(){
        return 0 >= this.currentDefense;
    }
    getPosition(){
        return this.position;
    }
    getAttack(){
        return this.attack;
    }
    setPosition(number){
        this.position = number;
    }
}