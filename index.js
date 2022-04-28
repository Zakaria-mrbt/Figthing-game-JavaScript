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
        x: 0,
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
    offset : {x: 10, y: 58},
    sprites: {
        idle: {
            imageSrc: './img/player1/Sprites/Idle.png',
            framesMax : 11,
        },
        run: {  
            imageSrc: './img/player1/Sprites/Run.png',
            framesMax : 8,
            image: new Image() 

        }
    }
})





const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
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
    player.update()
    // enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    player.image = player.sprites.idle.image
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.image = player.sprites.run.image
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // detect for collision
    if ( 
        retangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })
        && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if ( 
        retangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

// end game base on health
if (enemy.health <= 0 || player.health <=0){
    determineWinner({player, enemy, timerId})

}

}

animate()

window.addEventListener('keydown', (event) => {
    
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