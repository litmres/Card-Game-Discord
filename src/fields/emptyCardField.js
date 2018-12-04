class EmptyCardField{
    constructor(ctx, x, y, w, h, color, maxSize, PW, PH){
        this.x = x,
        this.y = y,
        this.ctx = ctx,
        this.color = color,
        this.isEmpty = true,
        this.maxSize = maxSize;
        this.width = w;
        this.height = h;
        this.parentWidth = PW;
        this.parentHeight = PH;
        this.parentX = x;
        this.parentY = y;
    }
    drawFront(){
        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(this.x, this.y, this.width, this.height); 
        this.ctx.stroke();
    }
    setColor(color){
        this.color = color;
    }
    getDistance(x, dx, y, dy){
        const a = x - dx;
        const b = y - dy;
    
        const c = Math.sqrt( a*a + b*b );
    
        return c;
    }
    setPosition(index){
        //gives each card an even offset
        const evenOffset = ((this.parentWidth - this.width*this.maxSize) / this.maxSize) * (index+1);
        
        //puts each card next to eachother
        const exponentialX = this.width * index;

        this.x = this.parentX + evenOffset + exponentialX;
    }
}
