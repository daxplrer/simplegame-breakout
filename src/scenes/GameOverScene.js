import Phaser from 'phaser'
export default class GameOverScene extends Phaser.Scene {
constructor() {
super('over-scene')
}
init(data) {
this.replayButton = undefined
this.score = data.score
this.datatemp = data
}
preload() {
this.load.image('background', 'images/bg_layer1.png')
this.load.image('gameover', 'images/gameover.png')
this.load.image('replay-button', 'images/replay.png')
}
create() {
this.add.image(200, 320, 'background')
this.add.image(200, 200, 'gameover')
this.add.text(100, 300, 'Score: ' + this.score, {
fontSize: '32px', fill: 'black' })
this.replayButton = this.add.image(200, 400, 'replay-button')
.setInteractive().setScale(0.5)
this.add.text(90, 450, 'or go back to start', {
    fontSize:'30px', backgroundColor:'white', fill: 'black'
}).setInteractive().on('pointerup', ()=>{
    this.scene.start('start-scene')
})
this.replayButton.once('pointerup', () => {
    this.scene.start('load-gamescene')
    }, this)
}
}