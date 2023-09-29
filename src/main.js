import Phaser from 'phaser'
import BreakTheBlock from './scenes/BreakTheBlockScene'
import loadallformain from './scenes/misc/LoadAllExtVarForMain'
import GameOverScene from './scenes/GameOverScene'
import WinScene from './scenes/WinScene'
import StartScene from  './scenes/StartScene'
import MENU_PauseScene from './scenes/menu/MENU_PauseScene'
const config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 618,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [StartScene, loadallformain,BreakTheBlock, GameOverScene, WinScene, MENU_PauseScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
