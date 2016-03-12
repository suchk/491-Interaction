function CircleAdder(game) {
    this.game = game;
};

CircleAdder.prototype = new Entity();
CircleAdder.prototype.constructor = CircleAdder;

CircleAdder.prototype.update = function () {
    Entity.prototype.update.call(this);

    // if (this.game.click) {
    //     var circle = new Circle(this.game, this.game.click.x, this.game.click.y);
    //     this.game.addEntity(circle);
    // } 
    
    if (this.game.mouseDown) {
        this.dragging = true;
        this.dragStart = this.game.mouseDown;
        console.log("dragging");
    }
    
    if (this.game.mouseUp) {
        this.dragging = false;
        console.log("Done dragging");
        
        var Vx = (this.dragStart.x - this.hover.x) / 10;
        var Vy = (this.dragStart.y - this.hover.y) / 10;
        var circle = new Circle(this.game, this.hover.x, this.hover.y, {x:Vx, y:Vy});
        
        this.game.addEntity(circle);
    }
    
    if (this.game.mouseMove) {
        this.hover = this.game.mouseMove;
    }    
};

CircleAdder.prototype.draw = function (ctx) {
    
    if (this.dragging) {
        ctx.beginPath();
        ctx.moveTo(this.dragStart.x, this.dragStart.y);
        ctx.lineTo(this.hover.x, this.hover.y);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
};