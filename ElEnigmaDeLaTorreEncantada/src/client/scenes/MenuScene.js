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
        // Ensure no duplicate menu music plays (stop existing then play)
        try { if (this.sound) this.sound.stopByKey('musicaMenu'); } catch(err){ console.warn(err); }
        this.game.sound.play('musicaMenu', { volume: 0.7, loop: true });

        this.fondo = this.add.image(500, 350, 'fondoM')
        this.fondo.setScale(0.8);
        this.titulo = this.add.image(500, 120, 'titulo')
        this.titulo.setScale(0.25);
        this.boton1 = this.add.image(500, 300, 'boton')
        this.boton1.setScale(0.1);
        this.boton2 = this.add.image(500, 350, 'boton')
        this.boton2.setScale(0.1);
        this.boton3 = this.add.image(500, 400, 'boton')
        this.boton3.setScale(0.1);
        this.boton4 = this.add.image(500, 450, 'boton')
        this.boton4.setScale(0.1);
        this.boton5 = this.add.image(500, 500, 'boton')
        this.boton5.setScale(0.1);



        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            fontFamily: "Tagesschrift",
            color: '#000000ff',
        }).setOrigin(0.5)
        .setAngle(-8); 

        const localBtn = this.add.text(500, 300, 'Local', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                localBtn.setStyle({ fill: '#4bffabff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => localBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                // Detener música de menú antes de cambiar de escena
                if (this.sound) this.sound.stopByKey('musicaMenu');
                this.scene.start('GameScene');
            });

        const onlineBtn = this.add.text(500, 350, 'Online', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                onlineBtn.setStyle({ fill: '#ff0000ff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => onlineBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', async() => {
                this.scene.stop();
                this.scene.start('SalaDeEspera');
            });


        const creditosBtn = this.add.text(500, 400, 'Créditos', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                creditosBtn.setStyle({ fill: '#ff9100ff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => creditosBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('CreditsScene');
            });

        const historiaBtn = this.add.text(500, 450, 'Historia', {
            fontSize: '24px',
            color: '#000000ff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                historiaBtn.setStyle({ fill: '#38ffffff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => historiaBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('HistoriaScene');
            });

        const controlBtn = this.add.text(500, 500, 'Controles', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                controlBtn.setStyle({ fill: '#ff0dffc1' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => controlBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('ControlScene', { originalScene: 'MenuScene' });
            });

        // Indicador de conexión al servidor
        this.connectionText = this.add.text(500, 540, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5);

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