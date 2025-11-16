import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { HistoriaScene } from './scenes/HistoriaScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 560,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ GameScene, PauseScene, CreditsScene, HistoriaScene, MenuScene],
    backgroundColor: '#47ddffff',
}

const game = new Phaser.Game(config);