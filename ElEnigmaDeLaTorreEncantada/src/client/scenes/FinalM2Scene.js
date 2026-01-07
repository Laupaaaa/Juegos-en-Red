import Phaser from 'phaser';
import { recordGameSession } from '../api.js';

export class FinalM2Scene extends Phaser.Scene {
    constructor() {
        super('FinalM2Scene');
    }

    preload() {
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('fondo_2M', '/imagenes/traicion_ranaAzul.png');
        this.load.audio('derrota', '/sounds/derrota.mp3');
    }

    create(){
        // Obtener datos de la partida desde DecisionScene
        const decisionScene = this.scene.get('DecisionScene');
        this.gameScene = decisionScene?.gameScene;
        this.gameMode = decisionScene?.gameMode || 'local';
        this.gameDuration = this.gameScene?.gameStartTime ? Date.now() - this.gameScene.gameStartTime : 0;

        // Registrar la partida si hay información disponible
        if (this.gameScene && this.gameScene.gameStartTime) {
            const duration = this.gameDuration;
            const username = this.gameScene.username || 'JugadorLocal';
            recordGameSession(username, duration, this.gameMode)
                .then(stats => {
                    console.log('📊 Partida registrada:', stats);
                })
                .catch(error => console.warn('⚠️ No se pudo registrar la partida:', error));
        }

        this.fondo_2M = this.physics.add.image(500,300, 'fondo_2M');
        this.fondo_2M.setImmovable(true);
        this.fondo_2M.body.allowGravity = false;

        // Reproducir música de derrota con volumen SFX guardado
        let sfxVolume = 0.7;
        try {
            const raw = localStorage.getItem('game_settings');
            if (raw) {
                const json = JSON.parse(raw);
                const sv = Number(json.sfxVolume);
                const legacy = Number(json.volume);
                sfxVolume = Number.isFinite(sv) ? sv : (Number.isFinite(legacy) ? legacy : 0.7);
            }
        } catch (_) {}
        if (this.sound) {
            this.sound.play('derrota', { volume: 0.7 * sfxVolume });
        }

        this.boton1 = this.add.image(500,500, 'boton')
        this.boton1.setScale(0.13);   

        this.add.text(500, 50, 'El jugador 2 ha decidido', {
        fontSize: '32px',
             fontFamily: 'Tagesschrift',
       color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 100, 'no compartir el Elixir de la Vida Eterna,', {
            fontSize: '32px',
            fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 150, 'ahora debe enfrentar las consecuencias de su elección y vivir solo', {
            fontSize: '16px',
            color: '#ffffffff',
             fontFamily: 'Tagesschrift',
       }).setOrigin(0.5);

        this.add.text(500, 175, 'hasta la eternidad...', {
            fontSize: '16px',
            color: '#ffffffff',
              fontFamily: 'Tagesschrift',
      }).setOrigin(0.5);

        const btn = this.add.text(500, 500, 'Volver al menú principal', {
            fontSize: '16px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            btn.setStyle({ fill: '#4bffabff' });
            this.sound.play('hover', { volume: 0.5 * sfxVolume });
        })
         .on('pointerout', () => btn.setStyle({ fill: '#000000ff' }))
         .on('pointerdown', () => {
            // Detener música de derrota antes de cambiar de escena
            if (this.sound) this.sound.stopByKey('derrota');
                this.scene.start('StatsScene', {
                    username: this.gameScene?.username || 'JugadorLocal',
                    mode: this.gameMode,
                    duration: this.gameDuration
                });
        })
    }
}