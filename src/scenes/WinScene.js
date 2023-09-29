import Phaser from 'phaser'
export default class WinScene extends Phaser.Scene {
    constructor() {
        super('win-scene')
    }
    init(data) {
        this.replayButton = undefined
        this.datatemp = data
    }
    preload() {
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('start-button', 'images/start-btn.png')
    }
    create() {
        this.add.image(200, 320, 'background')
        this.add.text(200, 90, 'YOU WIN', {
            fontSize: '38px', fill: 'black' })
        this.add.text(200, 200, 'Score: ' + this.datatemp.score, {
            fontSize: '32px', fill: 'black' })
        this.replayButton = this.add.image(200, 400, 'start-button')
            .setInteractive().setScale(0.5)
        this.add.text(200, 550, 'or go back to start', {
            fontSize:'30px', backgroundColor:'white', fill:'black'
        }).setInteractive().on('pointerup', ()=>{
            this.scene.start('start-scene')
        })
        this.replayButton.once('pointerup', () => {
            this.scene.start('load-gamescene')
        }, this)
    }

}