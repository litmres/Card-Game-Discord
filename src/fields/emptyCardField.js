class EmptyCardField{
    constructor(ctx, x, y, w, h, unlitColor, litColor, maxSize, PW, PH){
        this.x = x,
        this.y = y,
        this.ctx = ctx,
        this.unlitColor = unlitColor,
        this.litColor = litColor
        this.card = undefined;
        this.isEmpty = true;
        this.isLit = false;
        this.maxSize = maxSize;
        this.width = w;
        this.height = h;
        this.parentWidth = PW;
        this.parentHeight = PH;
        this.parentX = x;
        this.parentY = y;
    }
    setCard(card){
        this.card = card;
    }
    setEmpty(bool){
        this.isEmpty = bool;
        this.setLit(false);
    }
    drawFront(){
        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        if(this.isLit){
            this.ctx.strokeStyle = this.litColor;
        }else{
            this.ctx.strokeStyle = this.unlitColor
        }
        this.ctx.rect(this.x, this.y, this.width, this.height); 
        this.ctx.stroke();

        if(!this.card) return;

        this.card.drawFront();
    }
    getPosition(){
        return {x:this.x, y:this.y};
    }
    getLit(){
        return !!this.isLit;
    }
    setLit(bool){
        this.isLit = bool;
    }
    getDistance(x, dx, y, dy){
        const a = x - dx;
        const b = y - dy;
    
        const c = Math.sqrt( a*a + b*b );
    
        return c;
    }
    setPosition(index){
        //gives each card an even offset
        const evenOffsetX = ((this.parentWidth - this.width*this.maxSize) / this.maxSize) * (index+.5);
        
        //puts each card next to eachother
        const exponentialX = this.width * index;

        this.x = this.parentX + evenOffsetX + exponentialX;

        const evenOffsetY = (this.parentHeight - this.height)/2;

        this.y = this.parentY + evenOffsetY;
    }
}
