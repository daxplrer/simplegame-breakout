import Phaser from 'phaser'
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start-scene')
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
        this.replayButton = this.add.image(200, 400, 'start-button')
            .setInteractive().setScale(0.5)
        this.replayButton.once('pointerup', () => {
            this.scene.start('load-gamescene')
        }, this)
    }

}