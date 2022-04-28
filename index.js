const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7



const background = new Sprite ({
    position:{
        x: 0,
        y:0
    },
    imageSrc: './img/background.png'    
})

const torch1 = new Sprite ({
    position:{
        x: 78,
        y: 236
    },
    imageSrc: './img/torch/torch_big.png',
    scale: 2.3,
    framesMax : 6
})
const torch2 = new Sprite ({
    position:{
        x: 632,
        y: 236
    },
    imageSrc: './img/torch/torch_big.png',
    scale: 2.3,
    framesMax : 6
})

const player = new Fighter({
    position: {
        x: -50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },


    imageSrc: './img/player1/Sprites/Idle.png',
    framesMax : 11,  
    scale: 2.5,
    offset : {x: 0, y: 58},

    
    sprites: {
        idle: {
            imageSrc: './img/player1/Sprites/Idle.png',
            framesMax : 11
        },
        run: {  
            imageSrc: './img/player1/Sprites/Run.png',
            framesMax : 8
        },
        jump: {  
            imageSrc: './img/player1/Sprites/Jump.png',
            framesMax : 4
        },
        fall: {
            imageSrc: './img/player1/Sprites/Fall.png',
            framesMax : 4
        },
        attack: {
            imageSrc: './img/player1/Sprites/Attack.png',
            framesMax : 6
        },
        takeHit: {
            imageSrc: './img/player1/Sprites/Takehit.png',
            framesMax : 4
        },
        death: {
            imageSrc: './img/player1/Sprites/Death.png',
            framesMax : 9
        }
    },
    attackBox: {
        offset: {
            x: 50,
            y: 0
        },
        width: 100,
        height: 50
    }
    
})





const enemy = new Fighter({
    position: {
        x: 750,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    },

    imageSrc: './img/player2/Sprites/Idle.png',
    framesMax : 11,  
    scale: 2,
    offset : {x: 0, y: 78},

    
    sprites: {
        idle: {
            imageSrc: './img/player2/Sprites/Idle.png',
            framesMax : 11
        },
        run: {  
            imageSrc: './img/player2/Sprites/Run.png',
            framesMax : 8
        },
        jump: {  
            imageSrc: './img/player2/Sprites/Jump.png',
            framesMax : 3
        },
        fall: {
            imageSrc: './img/player2/Sprites/Fall.png',
            framesMax : 3
        },
        attack: {
            imageSrc: './img/player2/Sprites/Attack1.png',
            framesMax : 7
        },
        takeHit: {
            imageSrc: './img/player2/Sprites/Takehit.png',
            framesMax : 4
        },
        death: {
            imageSrc: './img/player2/Sprites/Death.png',
            framesMax : 11
        }

    },
    attackBox: {
        offset: {
            x: -70,
            y: 0
        },
        width: 100,
        height: 50
    }
    
})

console.log(player)

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}

decreaseTimer()

// animation loop
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    torch1.update()
    torch2.update()
    //background white opacity
    // c.fillStyle= 'rgba(255, 255, 255, 0.1'
    // c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
        
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else{
        enemy.switchSprite('idle')
    }

     //jumping
     if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
        
    } else if (player.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy get hit
    if ( 
        retangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
         player.isAttacking && 
         player.framesCurrent === 4
        ) {
        enemy.takeHit()
        player.isAttacking = false

        
        gsap.to('#enemyHealth',{
            width: enemy.health + '%'
        })
    }
    // if player misses
    if (player.isAttacking && player.framesCurrent ===4){
        player.isAttacking = false
    }

// player get hit


    if ( 
        retangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking && enemy.framesCurrent === 2
        ) {
        player.takeHit()
        enemy.isAttacking = false
        
        
        gsap.to('#playerHealth',{
            width: player.health + '%'
        })
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

// end game base on health
if (enemy.health <= 0 || player.health <=0){
    determineWinner({player, enemy, timerId})

}

}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead){

    
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'q':
            keys.q.pressed = true
            player.lastKey = 'q'
            break
        case 'z':

            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }
}

    if (!enemy.dead){
     switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
            case 'ArrowDown':
                enemy.attack ()
                break
    }   
    }
    

})

window.addEventListener('keyup', (event) => {

    // player keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break

    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }

    

})