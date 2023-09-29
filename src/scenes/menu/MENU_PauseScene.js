import Phaser from 'phaser'
export default class MENU_PauseScene extends Phaser.Scene {
constructor() {
super('menu_pause-scene')
}
init(data) {
this.replayButton = undefined
this.score = data.score
this.datatemp = data
}
preload() {
this.load.image('background', 'images/bg_layer1.png')
this.load.image('gameover', 'images/gameover.png')
this.load.image('replay-button', 'images/start-btn.png')
}
create() {
this.add.image(200, 320, 'background')
this.add.text(150, 300, 'Paused', {
fontSize: '32px', fill: 'black' , backgroundColor:'white'})
this.replayButton = this.add.image(200, 400, 'replay-button')
.setInteractive().setScale(0.5)
this.input.keyboard.once('keydown', function(event){
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
    this.goBackToMain()
    }
}, this);
this.replayButton.once('pointerup', () => {
this.goBackToMain()
}, this)
}
goBackToMain(){
    this.scene.resume('break-the-block-scene')
    this.scene.stop()
}
}