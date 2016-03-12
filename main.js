var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

var gameEngine = new GameEngine();

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var circleAdder = new CircleAdder(gameEngine);
    gameEngine.addEntity(circleAdder);

    var circle = new Circle(gameEngine, 300, 300);
    circle.mass = 100;
    circle.radius = getRadius(circle.mass);
    circle.velocity = {x: 0, y: -4};
    gameEngine.addEntity(circle);
    
    var circle2 = new Circle(gameEngine, 500, 300);
    circle2.mass = 100;
    circle2.radius = getRadius(circle2.mass);
    circle2.velocity = {x: 0, y: 4};
    gameEngine.addEntity(circle2);
    
    var circle3 = new Circle(gameEngine, 400, 200);
    circle3.mass = 10;
    circle3.radius = getRadius(circle3.mass);
    circle3.velocity = {x: 0, y: 3};
    gameEngine.addEntity(circle3);
    
    gameEngine.init(ctx);
    gameEngine.start();
});

var socket = io.connect("http://76.28.150.193:8888");

var loadData = function () {
    socket.emit("load", {studentname: "Such Kamal", statename: "SimulationData"});
};

var saveData = function () {
    circles = [];
    
    for (var i = 0; i < gameEngine.circles.length; i++) {
        var circle = gameEngine.circles[i];
        circles.push({x:        circle.x,
                      y:        circle.y,
                      velocity: circle.velocity,
                      mass:     circle.mass,
                      radius:   circle.radius,
                      color:    circle.color});
    }
    
    socket.emit("save", {
        studentname: "Such Kamal",
        statename: "SimulationData",
        data: circles
    });
};


socket.on("load", function (data) {
    console.log("Loading...");

    gameEngine.entities = [];
    gameEngine.circles = [];

    // Recreate each boid given the save data
    for (var i = 0; i < data.data.length; i++) {
        var circle = new Circle(gameEngine, data.data[i].x, data.data[i].y, data.data[i].velocity);
        circle.mass = data.data[i].mass;
        circle.color = data.data[i].color;
        circle.radius = data.data[i].radius;
        gameEngine.addEntity(circle);
    }
});