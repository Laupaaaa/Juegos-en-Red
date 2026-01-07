import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('fondoM', '/imagenes/logoSinFondo.png');
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('boton', '/imagenes/botonTexto.png');

        this.load.audio('hover', '/sounds/hover.mp3');
        this.load.audio('musicaMenu', '/sounds/música_MPrincipal.mp3');

        const font = new FontFace('Tagesschrift', 'url(/fuentes/Tagesschrift.ttf)');
        font.load().then(function (loadedFont) {
            document.fonts.add(loadedFont);
        }).catch(function (error) {
            console.error('Error loading font:', error);
        });
    }

    create() {
        // Cargar volúmenes guardados (música y SFX)
        this.musicVolume = 0.7;
        this.sfxVolume = 0.7;
        try {
            const raw = localStorage.getItem('game_settings');
            if (raw) {
                const json = JSON.parse(raw);
                const mv = Number(json.musicVolume);
                const sv = Number(json.sfxVolume);
                const legacy = Number(json.volume);
                this.musicVolume = Number.isFinite(mv) ? mv : (Number.isFinite(legacy) ? legacy : 0.7);
                this.sfxVolume = Number.isFinite(sv) ? sv : (Number.isFinite(legacy) ? legacy : 0.7);
            }
        } catch (_) {}

        // Ensure no duplicate menu music plays (stop existing then play)
        try { if (this.sound) this.sound.stopByKey('musicaMenu'); } catch(err){ console.warn(err); }
        this.menuMusic = this.game.sound.play('musicaMenu', { volume: this.musicVolume, loop: true });

        this.fondo = this.add.image(500, 350, 'fondoM')
        this.fondo.setScale(0.8);
        this.titulo = this.add.image(500, 110, 'titulo')
        this.titulo.setScale(0.25);
        const scaleBtn = 0.09;
        const yStart = 280;
        const yStep = 50;
        this.boton1 = this.add.image(500, yStart + 0*yStep, 'boton').setScale(scaleBtn);
        this.boton2 = this.add.image(500, yStart + 1*yStep, 'boton').setScale(scaleBtn);
        this.boton3 = this.add.image(500, yStart + 2*yStep, 'boton').setScale(scaleBtn);
        this.boton4 = this.add.image(500, yStart + 3*yStep, 'boton').setScale(scaleBtn);
        this.boton5 = this.add.image(500, yStart + 4*yStep, 'boton').setScale(scaleBtn);



        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            fontFamily: "Tagesschrift",
            color: '#000000ff',
        }).setOrigin(0.5)
        .setAngle(-8); 

        const localBtn = this.add.text(500, yStart + 0*yStep, 'Local', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                localBtn.setStyle({ fill: '#4bffabff' });
                this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
            })
            .on('pointerout', () => localBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                // Detener música de menú antes de cambiar de escena
                if (this.sound) this.sound.stopByKey('musicaMenu');
                this.scene.start('GameScene');
            });

        const onlineBtn = this.add.text(500, yStart + 1*yStep, 'Online', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                onlineBtn.setStyle({ fill: '#ff0000ff' });
                this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
            })
            .on('pointerout', () => onlineBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', async() => {
                this.scene.stop();
                this.scene.start('SalaDeEspera');
            });


        const creditosBtn = this.add.text(500, yStart + 2*yStep, 'Créditos', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                creditosBtn.setStyle({ fill: '#ff9100ff' });
                this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
            })
            .on('pointerout', () => creditosBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('CreditsScene');
            });

        const historiaBtn = this.add.text(500, yStart + 3*yStep, 'Historia', {
            fontSize: '24px',
            color: '#000000ff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                historiaBtn.setStyle({ fill: '#38ffffff' });
                this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
            })
            .on('pointerout', () => historiaBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('HistoriaScene');
            });

        const controlBtn = this.add.text(500, yStart + 4*yStep, 'Controles', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                controlBtn.setStyle({ fill: '#ff0dffc1' });
                this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
            })
            .on('pointerout', () => controlBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('ControlScene', { originalScene: 'MenuScene' });
            });

        // Botón Ajustes
        const ajustesBg = this.add.image(500, yStart + 5*yStep, 'boton').setScale(scaleBtn);
        const ajustesBtn = this.add.text(500, yStart + 5*yStep, 'Ajustes', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => { ajustesBtn.setStyle({ fill: '#4bffabff' }); this.sound.play('hover', { volume: 0.5 * this.sfxVolume }); })
            .on('pointerout', () => ajustesBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('SettingsScene');
            });

        // Indicador de conexión al servidor
        this.connectionText = this.add.text(960, 40, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00',
            fontFamily: 'Tagesschrift',
        }).setOrigin(1, 0.5);

        // Listener para cambios de conexión
        this.connectionListener = (data) => { 
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
    }

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#00ff00');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}