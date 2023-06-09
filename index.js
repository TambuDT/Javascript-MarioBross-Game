

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;
const maxMoveRight = 400;
const maxMoveLeft = 100;
const gravity = 0.3;

// Gamepad
let Gup = null;
let Gup2 = null;
let Gdown = null;
let Gleft = null;
let Gright = null;
let gamepadIndex = null;

//Sprite Idle
var IdleSprite = new Image();
IdleSprite.src = './sprite/idleSprite.png';

//Sprites Run
var RunSprite = new Image();
RunSprite.src = './sprite/runSprite.png';


   

//finish game
let scrollOffset = 0

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 50;
        this.height = 90;
        this.frames=0;
        this.image=IdleSprite;
    }
    draw() {
        c.drawImage(this.image,232*this.frames,0,232,439,this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.frames ++
        if(this.frames>10){
            this.frames=0
        }
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
    moveUp() {
        if (player.position.y < 500 && player.position.y > 50) {
            console.log('up');
            player.velocity.y = -8;
        } else {
            player.velocity.y = 0;
            console.log('stop up');
        }
    }
    moveDown() {
        if (player.position.y > 0 && player.position.y <= 450) {
            console.log('down');
            player.velocity.y = 20;
        } else {
            player.velocity.y = 0;
            console.log('stop down');
        }
    }
    moveRight(pressed) {
        if (pressed && player.position.x < maxMoveRight) {
            player.velocity.x = 5;
            console.log('right');
        } else {
            player.velocity.x = 0;
            console.log('stop right');
        }
    }
    moveLeft(pressed) {
        if (pressed && player.position.x > maxMoveLeft) {
            player.velocity.x = -5;
            console.log('left');
        } else {
            player.velocity.x = 0;
            console.log('stop left');
        }
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.position = {
            x,
            y
        };
        this.width = width;
        this.height = height;
    }
    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
const platforms = [new Platform(200, 300, 200, 20), new Platform(450, 200, 200, 20), new Platform(700, 200, 200, 20),]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};



function animate() {
    
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    
    controllerInput()
    player.update();
    updatePlayerGpad()
    


    //condizione di collisione con la piattaforma e scrolling
    platforms.forEach(platform => {
        platform.draw();
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
        }
    })    

    if (player.position.x >= maxMoveRight && keys.right.pressed) {
        scrollOffset += 5;
        platforms.forEach(platform => {
            platform.position.x -= 5;
        })
    }

    if (player.position.x <= maxMoveLeft && keys.left.pressed) {
        scrollOffset -= 5;
        platforms.forEach(platform => {
            platform.position.x += 5;
        })
    }

    if (player.position.x >= maxMoveRight && Gright) {
        scrollOffset += 5;
        platforms.forEach(platform => {
            platform.position.x -= 5;
        })
    }

    if (player.position.x <= maxMoveLeft && Gleft) {
        scrollOffset -= 5;
        platforms.forEach(platform => {
            platform.position.x += 5;
        })
    }


    console.log(scrollOffset)

    if(scrollOffset>=3000){
    console.log("you Win")
    }

}

// Gamepad
addEventListener('gamepadconnected', (e) => {
    handleConnectDisconnect(true);
});

addEventListener('gamepaddisconnected', (e) => {
    handleConnectDisconnect(false);
});

function handleConnectDisconnect(connected) {
    if (connected === true) {
        console.log('the controller is connected');
        const gamepad = navigator.getGamepads()[0];
        console.log(gamepad);
        gamepadIndex = gamepad.index;
        console.log(gamepadIndex);
    } else {
        console.log('the controller is disconnected');
        gamepadIndex = null;
    }
}

function controllerInput() {
    if (gamepadIndex != null) {
        const gamepad = navigator.getGamepads()[gamepadIndex];
        const buttons = gamepad.buttons;
        Gup = buttons[12].pressed;
        Gup2 = buttons[0].pressed;
        Gdown = buttons[13].pressed;
        Gleft = buttons[14].pressed;
        Gright = buttons[15].pressed;
    }
}


function updatePlayerGpad() {
    //implementazione movimenti con gamepad
    if (Gup && player.position.y < 500 && player.position.y > 50 || Gup2 && player.position.y < 500 && player.position.y > 50) {
        console.log('Gpad up');
        player.velocity.y = -8;
    } else if (Gdown && player.position.y > 0 && player.position.y <= 450) {
        console.log('Gpad down');
        player.velocity.y = 20;
    } else if (Gleft && player.position.x > maxMoveLeft) {
        console.log('Gpad left');
        player.position.x -= 5
    } else if (Gright && player.position.x < maxMoveRight) {
        console.log('Gpad right');
        player.position.x += 5
    }
}



//keyboard
addEventListener('keydown', (event) => {
    var keyPressed = event.keyCode;
    console.log(keyPressed);
    switch (keyPressed) {
        case 37:
            keys.left.pressed = true;
            player.moveLeft(keys.left.pressed);
            break;
        case 38:
            player.moveUp();
            break;
        case 39:
            keys.right.pressed = true;
            player.moveRight(keys.right.pressed);
            break;
        case 40:
            player.moveDown();
            break;
    }
});

addEventListener('keyup', (event) => {
    var keyPressed = event.keyCode;
    //console.log(keyPressed)
    switch (keyPressed) {
        case 37:
            keys.left.pressed = false;
            player.moveLeft(keys.left.pressed);
            break;
        case 38:
            player.moveUp();
            break;
        case 39:
            keys.right.pressed = false;
            player.moveRight(keys.right.pressed);
            break;
        case 40:
            player.moveDown();
            break;
    }
});

animate();