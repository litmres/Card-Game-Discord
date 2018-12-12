class Particle{
    constructor(x,y,dx, dy,color,radius, ctx){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.velX = 0;
        this.velY = 0;
        this.PI2=Math.PI*2;
        this.color = color;
        this.radius = radius;
        this.width = radius*2;
        this.height = radius*2;
        this.borderColor = "black";
        this.ctx = ctx;
        this.originalMagnitude = 20;
        this.magnitude = this.originalMagnitude;
    }
    draw(){
        this.moveToDestination();
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.5;
        this.ctx.arc(this.x, this.y, this.radius, 0, this.PI2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.stroke();
    }
    isAtDestination(){
        return (
          this.x === this.dx && 
          this.y === this.dy
        );
    }
    calcVel(){
        const dx = this.dx - this.x;
        const dy = this.dy - this.y;
        const angle = Math.atan2(dy, dx);
        this.velX = Math.cos(angle) * this.magnitude;
        this.velY = Math.sin(angle) * this.magnitude;
    }
    getDistance(x, dx, y, dy){
        const a = x - dx;
        const b = y - dy;
    
        const c = Math.sqrt( a*a + b*b );
    
        return c;
    }
    moveToDestination(){
        if(this.isAtDestination()) return;
        if(this.getDistance(this.x, this.dx, this.y, this.dy) < this.magnitude){
            this.x = this.dx;
            this.y = this.dy;
        }else{
            this.x += this.velX;
            this.y += this.velY;
        }
    }
    inside(rectX, rectY, rectW, rectH){
        const distX = Math.abs(this.x - rectX-rectW/2);
        const distY = Math.abs(this.y - rectY-rectH/2);

        if (distX > (rectW/2 + this.radius)) { return false; }
        if (distY > (rectH/2 + this.radius)) { return false; }

        if (distX <= (rectW/2)) { return true; } 
        if (distY <= (rectH/2)) { return true; }

        const dx=distX-rectW/2;
        const dy=distY-rectH/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
    }
}