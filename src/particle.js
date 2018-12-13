class Particle{
    constructor(x,y, angle, color, borderColor, alpha, radius, ctx){
        this.x = x;
        this.y = y;
        //this.dx = dx;
        //this.dy = dy;
        this.w = this.x;
        this.h = this.y;
        this.velX = 0;
        this.velY = 0;
        this.angle = angle;
        this.PI2=Math.PI*2;
        this.color = color;
        this.currentAlpha = 0;
        this.alpha = alpha;
        this.radius = radius;
        this.width = radius*2;
        this.height = radius*2;
        this.borderColor = borderColor;
        this.ctx = ctx;
        this.originalMagnitude = 1;
        this.magnitude = this.originalMagnitude;
    }
    draw(){
        this.moveToDestination();
        this.ctx.beginPath();
        if(this.currentAlpha < this.alpha){
            this.currentAlpha += 0.01;
            this.ctx.globalAlpha = this.currentAlpha;
        }else{
            this.ctx.globalAlpha = this.alpha;
        }
        this.ctx.arc(this.x, this.y, this.radius, 0, this.PI2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.globalAlpha = this.ctx.globalAlpha*1.5;
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    isAtDestination(){
        return (
          this.x === this.dx && 
          this.y === this.dy
        );
    }
    calcVel(){
        
        this.angle += this.magnitude;
        /*
        // plot the balls x to cos and y to sin 
        this.velX = this.w/2 + Math.cos(this.radians(this.angle))*this.radius;
        this.velY = this.h/2 + Math.sin(this.radians(this.angle))*this.radius;

        this.x = this.velX+this.w/2;
        this.y = this.velY+this.h/2;
        */
        this.x = this.x + Math.cos(this.radians(this.angle)) * this.magnitude;
        this.y = this.y + Math.sin(this.radians(this.angle)) - this.magnitude;
        /*
        const dx = this.dx - this.x;
        const dy = this.dy - this.y;
        const angle = Math.atan2(dy, dx);
        this.velX = Math.cos(angle) * this.magnitude;
        this.velY = Math.sin(angle) * this.magnitude; */
    }
    radians(deg) {
        return deg*Math.PI/180;
    };
    getDistance(x, dx, y, dy){
        const a = x - dx;
        const b = y - dy;
    
        const c = Math.sqrt( a*a + b*b );
    
        return c;
    }
    moveToDestination(){
        this.calcVel();
        /*
        if(this.isAtDestination()) return;
        if(this.getDistance(this.x, this.dx, this.y, this.dy) < this.magnitude){
            this.x = this.dx;
            this.y = this.dy;
        }else{
            this.x += this.velX;
            this.y += this.velY;
        }*/
        //this.x = this.velX+this.x;
        //this.y = this.velY+this.y;
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
        return (dx*dx+dy*dy<=(this.radius*this.radius));
    }
}