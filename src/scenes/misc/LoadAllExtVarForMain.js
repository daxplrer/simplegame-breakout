import Phaser from 'phaser'
export default class LoadAllScene extends Phaser.Scene {
    constructor() {
        super('load-gamescene')
    }
    init(data) {
        this.datatemp = data
        
    }
    preload() {
    }
    create() {
        this.add.image(200, 320, 'background')
        this.add.text(100, 300, 'Loading external variables (from localStorage and more)', {
            fontSize: '42px', fill: 'black'
        })
        if (localStorage.getItem("breaktheblock-coins") === null) {
            console.log(localStorage.getItem("breaktheblock-coins"))
            localStorage.setItem("breaktheblock-coins", "0")
        }
        this.scene.start('break-the-block-scene', {
            coins: parseInt(localStorage.getItem("breaktheblock-coins")),
            opts: this.datatemp.optional
        })
    }

}