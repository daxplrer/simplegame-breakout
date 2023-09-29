import Phaser from 'phaser';
export default class BreakTheBlock extends Phaser.Scene {
    constructor() {
        super('break-the-block-scene')
    }
    init(data) {
        // hardware related
        this.cursors = this.input.keyboard.createCursorKeys();

        //sprites
        this.blocks = []
        this.ball = undefined
        this.pad = undefined
        this.scoreLabel = undefined
        this.levelLabel = 0

        //scoring
        this.score = 0
        this.level = 0

        //time-related
        // this.setPhaserTimeoutCurrentFunction = undefined
        // this.setPhaserTimeoutNeededWait = undefined
        // this.setPhaserTimeoutOnThread = false
        // this.setPhaserTimeoutCleared = true

        //temporaily objects
        // this.currentTime = undefined
        this.gameLoaded = false
        this.currentBlocksRange = 0
        this.gameWidth = undefined
        this.gameWidth2 = undefined
        this.gameHeight = undefined
        this.gameHeight2 = undefined
        this.datatemp = data
        // config
        this.speed = 120
        this.setRandomBlocksRange = [3, 5]
        // end config
    }
    preload() {
        this.load.image('ball', 'images/redball.png')
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('pad', 'images/paddle.png')
        // nanti ada imagenya (oiya btw ini 'paddle' nya)
        this.load.image('block', 'images/block.png')
    }
    create() {
        this.gameWidth = this.scale.width;
        this.gameWidth2 = this.sys.canvas.width
        this.gameHeight = this.scale.height;
        this.gameHeight2 = this.sys.canvas.height;
        const borderGraphics = this.add.graphics();

        // Define the border color and thickness
        const borderColor = 0xff0000; // Red color
        const borderThickness = 10;

        // Draw the border rectangle around the entire game canvas
        borderGraphics.lineStyle(borderThickness, borderColor);
        borderGraphics.strokeRect(
            0, // X-coordinate of the top-left corner
            0, // Y-coordinate of the top-left corner
            this.gameWidth, // Width of the canvas
            this.gameHeight // Height of the canvas
        );
        // buat ngetes
        this.add.image(this.gameWidth, this.gameHeight, 'background')
        this.ball = this.physics.add.sprite(400, 300, 'ball').setScale(0.5).refreshBody(); // 'ball' should be the key for your ball image
        this.pad = this.physics.add.sprite(400, 500, 'pad')
        this.input.keyboard.on('keydown', function(event){
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
            this.scene.pause()
            this.scene.launch('menu_pause-scene')
            }
        }, this);
        this.makeTheBlock(this.ball)
        this.initSprites()
        this.refreshBallPhysicsProp()
        this.scoreLabel = this.add.text(30, 30, 'Score: ', {
            fontSize: '16px',
            fill: 'black',
            backgroundColor: 'white'
        })
        this.add.text(30, 50, 'Coins: ' + this.datatemp.coins.toString(), {
            fontSize: '16px',
            fill: 'black',
            backgroundColor: 'white'
        })
        this.gameLoaded = true
    }
    update(time) {
        //    if (this.setPhaserTimeoutOnThread){
        //    if (((this.currentTime-this.setPhaserTimeoutNeededWait)||(this.setPhaserTimeoutNeededWait-this.currentTime))>=time){
        //     this.currentTime = undefined
        //     this.setPhaserTimeoutCleared = false
        //     this.setPhaserTimeoutOnThread = false
        //     if (typeof this.setPhaserTimeoutCurrentFunction === "function") this.setPhaserTimeoutCurrentFunction()
        //    }
        //    }
        this.scoreLabel.setText(`Score: ` + this.score)
        this.movePlayer(this.pad, time)
        this.detectVoid(this.ball)
    }
    initSprites() {
        this.pad.setScale(0.5, 0.5);
        this.ball.setScale(0.05, 0.05)
        this.ball.setCollideWorldBounds(true)
        this.pad.setCollideWorldBounds(true);
        this.pad.body.setImmovable(true);
        this.physics.add.collider(this.ball, this.pad, this.handleCollision, null, this);
    }
    makeTheBlock(ball) {
        this.blocks = []
        this.currentBlocksRange = Phaser.Math.Between(this.setRandomBlocksRange[0], this.setRandomBlocksRange[1])
        Object.freeze(this.currentBlocksRange)
        for (let blockindex = 0; blockindex < this.currentBlocksRange; blockindex++) {
            this.blocks[blockindex] = this.physics.add.sprite(this.gameHeight, this.gameWidth, 'block')
            this.blocks[blockindex].setCollideWorldBounds(true).setImmovable(true)
            this.randomPlaceForBlocks(this.blocks[blockindex])
            console.info(`Block debug info:\n\n\nBlock index name: ${blockindex}\n\nx:${this.blocks[blockindex].body.x}\ny:${this.blocks[blockindex].body.y}`)
            
            this.physics.add.collider(ball, this.blocks[blockindex], function () {
                this.handleCollision(ball, this.blocks[blockindex])
                this.blocks[blockindex].destroy()
                delete this.blocks[blockindex]
                this.score++
                if (this.score >= this.currentBlocksRange) {
                    const coinstotal = this.score * 2 + parseInt(localStorage.getItem('breaktheblock-coins'))
                    localStorage.setItem('breaktheblock-coins', String(coinstotal))
                    this.scene.start('win-scene', { score:this.score, coins: coinstotal })
                }
            }, null, this);
        }
        this.iterateBlocks()
    }
    // the first implementation was very glitchy, so i made this
    iterateBlocks(){
        for (let blockindex=0;blockindex<this.currentBlocksRange;blockindex++){
        for (let blockindex2 = 0; blockindex2 < this.currentBlocksRange; blockindex2++) {
            this.physics.add.collider(this.blocks[blockindex2], this.blocks[blockindex], () => {
                this.ball.setImmovable(true)
                this.blocks[blockindex].body.setImmovable(false)
                this.randomPlaceForBlocks(this.blocks[blockindex])
                this.blocks[blockindex].body.setImmovable(true)
                this.ball.setImmovable(false)
                this.refreshBallPhysicsProp()
            }, null, this)
            this.physics.add.collider(this.pad, this.blocks[blockindex], () => {
                this.ball.setImmovable(true)
                this.blocks[blockindex].body.setImmovable(false)
                this.randomPlaceForBlocks(this.blocks[blockindex])
                this.blocks[blockindex].body.setImmovable(true)
                this.ball.setImmovable(false)
                this.refreshBallPhysicsProp()
            }, null, this)
        }
    }
    }
    //@ts-ignore
    movePlayer(pad, time) {
        if (this.cursors.left.isDown) {
            pad.setVelocityX((this.speed * 2) * -1)
        } else if (this.cursors.right.isDown) {
            pad.setVelocityX(this.speed * 2)
        } else {
            pad.setVelocityX(0)
        }
    }
    detectVoid(sprite){
        if (sprite.body.y>=this.gameHeight-50){
            var coinstotal = parseInt(localStorage.getItem('breaktheblock-coins')) - this.score
            if (coinstotal<=0) coinstotal = 0
            Object.freeze(coinstotal)
            localStorage.setItem('breaktheblock-coins', String(coinstotal))
            this.scene.start('over-scene', { score: this.score, coins: coinstotal })
        }
    }
    handleCollision(sprite1, sprite2) {
        const spritebody = sprite1.body
        const direction = ((spritebody.transform.x - sprite2.body.transform.x) / sprite2.width) + sprite2.originX
        if (direction < 0.3) {
            (spritebody.velocity.x = -Math.abs(spritebody.velocity.x)) || (spritebody.setVelocityX(-Math.abs(spritebody.velocity.x)))
        } else if (direction > 0.7) {
            (spritebody.velocity.x = Math.abs(spritebody.velocity.x)) || (spritebody.setVelocityX(Math.abs(spritebody.velocity.x)))
        }
    }
    // // alternative solution if you cant do 'this.game.time.add' 
    // setPhaserTimeout(ms, cb){
    //     if (this.setPhaserTimeoutOnThread) {
    //         console.error("setPhaserTimeout is on its thread")
    //         return
    //     }
    //     console.warn("Attempting to use setPhaserTimeout. Note: this wait function currently only supports ONE thread.")
    //     this.setPhaserTimeoutNeededWait = ms
    //     this.setPhaserTimeoutCurrentFunction = cb
    //     this.setPhaserTimeoutOnThread = true
    // }
    randomPlaceForBlocks(sprite) {
        var spritebody = sprite.body
        spritebody.x = Phaser.Math.Between(60, this.gameWidth)
        spritebody.y = Phaser.Math.Between(80, this.gameHeight)
    }
    refreshBallPhysicsProp(){
        this.ball.setVelocityY(this.speed)
        this.ball.setVelocityX(50)
        this.ball.setBounce(1);
    }
}