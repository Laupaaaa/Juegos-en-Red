import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { HistoriaScene } from './scenes/HistoriaScene.js';
import { LibreriaScene } from './scenes/LibreriaScene.js';
import { ControlScene } from './scenes/ControlScene.js';
import { DecisionScene } from './scenes/DecisionScene.js';
import { FinalBScene } from './scenes/FinalBScene.js';
import { FinalM1Scene } from './scenes/FinalM1Scene.js';
import { FinalM2Scene } from './scenes/FinalM2Scene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 560,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 20000 },
            debug: false
        }
    },
    scene: [ MenuScene, GameScene, LibreriaScene,  PauseScene, CreditsScene, HistoriaScene, ControlScene, DecisionScene, FinalBScene, FinalM1Scene, FinalM2Scene, ConnectionLostScene ],
    backgroundColor: '#47ddffff',
}

const game = new Phaser.Game(config);