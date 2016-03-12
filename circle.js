function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

function getRadius(mass) {
    // Area = mass = pi * r ^ 2
    // r = sqrt(mass / pi)
    
    return Math.sqrt(mass / Math.PI);
};

function Circle(game, x, y, velocity) {
    this.game = game;
    this.mass = 5;
    this.radius = getRadius(this.mass);
    this.color = "hsla(" + (Math.random() * 360) + ", 100%, 50%, 1)";
    // Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (600 - this.radius * 2));
    Entity.call(this, game, x, y);
    // this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    if (velocity) {
        this.velocity = velocity;
    } else {
        this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    }
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.collideRight = function () {
    return this.x + this.radius > this.game.surfaceWidth;
};
Circle.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Circle.prototype.collideBottom = function () {
    return this.y + this.radius > this.game.surfaceHeight;
};
Circle.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    // this.x += this.velocity.x * this.game.clockTick;
    // this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y;
    }

    // Combine colliding circles into one
    forceSum = {x: 0, y: 0};    
    for (var i = 0; i < this.game.circles.length; i++) {
        var ent = this.game.circles[i];
        if (!ent.removeFromWorld && this != ent && this.collide(ent)) {
            ent.removeFromWorld = true;
            
            // New velocity takes into account the mass of both colliding circles
            // So colliding with a small object doesn't affect its trajectory as much as a larger object would
            this.velocity.x = (this.velocity.x * this.mass + ent.velocity.x * ent.mass) / (this.mass + ent.mass);
            this.velocity.y = (this.velocity.y * this.mass + ent.velocity.y * ent.mass) / (this.mass + ent.mass);
            
            // Without this, the circles bounce a little when they collide instead of a smooth collision
            this.x = (this.x * this.mass + ent.x * ent.mass) / (this.mass + ent.mass);
            this.y = (this.y * this.mass + ent.y * ent.mass) / (this.mass + ent.mass);
            
            this.mass += ent.mass;
            this.radius = getRadius(this.mass);
        } else if (this != ent && !ent.removeFromWorld) {
            // Apply Newton's Law of Universal Gravitation
            // F = G * m1 * m2 / (d * d)

            var xDist = this.x - ent.x;
            var yDist = this.y - ent.y;
            var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
            var gravityConstant = 6;
            var forceMag = gravityConstant * (this.mass * ent.mass) / Math.pow(distance, 2);
            forceSum.x -= Math.abs(forceMag * (xDist / distance)) * Math.sign(xDist);
            forceSum.y -= Math.abs(forceMag * (yDist / distance)) * Math.sign(yDist);
        }
    }
    this.velocity.x += forceSum.x / this.mass;
    this.velocity.y += forceSum.y / this.mass;
    
    this.x += this.velocity.x / 10;
    this.y += this.velocity.y / 10;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};

var friction = 1;
var acceleration = 10000;
var maxSpeed = 2000;
