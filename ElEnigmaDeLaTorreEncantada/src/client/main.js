import Phaser from 'phaser';
import { LoginScene } from './scenes/LoginScene.js';
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
import { StatsScene } from './scenes/StatsScene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';
import SalaDeEspera from './scenes/SalaDeEspera.js';
import { GameSceneO } from './scenes/GameSceneO.js';
import { SettingsScene } from './scenes/SettingsScene.js';

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
    dom: {
        createContainer: true
    },
    scene: [ LoginScene, MenuScene, SettingsScene, GameSceneO, GameScene, LibreriaScene,  PauseScene, CreditsScene, HistoriaScene, ControlScene, DecisionScene, FinalBScene, FinalM1Scene, FinalM2Scene, StatsScene, ConnectionLostScene, SalaDeEspera ],
    backgroundColor: '#47ddffff',
}

const game = new Phaser.Game(config);