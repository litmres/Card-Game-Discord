class LoadingCircle{
    constructor(x, y, radius, color, ctx){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.start = 0;
        this.end = 100;
        this.color = color;
        this.quart = Math.PI / 2;
        this.PI2 = Math.PI * 2;
        this.percent = 0;
        this.ctx = ctx;
    }
    setPercent(number){
        this.percent += number;
    }
    draw(){
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = '#85c3b8';
        this.ctx.shadowColor = "black"
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.font = "18px verdana";

        const pct = this.percent / 100;
        const extent = parseInt((this.end - this.start) * pct);
        const current = (this.end - this.start) / 100 * this.PI2 * pct - this.quart;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, -this.quart, current);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(extent, this.x - 15, this.y + 5);
    }
}