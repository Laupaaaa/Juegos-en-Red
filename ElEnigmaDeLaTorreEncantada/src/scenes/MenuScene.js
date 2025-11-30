import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('fondoM', '/imagenes/logoSinFondo.png');
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('boton', '/imagenes/botonTexto.png');

        this.load.audio('hover', '/sounds/hover.mp3');
    }

    create() {
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
            color: '#000000ff',
        }).setOrigin(0.5);

        const localBtn = this.add.text(500, 300, 'Local', {
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                localBtn.setStyle({ fill: '#4bffabff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => localBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });

        this.add.text(500, 350, 'Online', {
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5)


        const creditosBtn = this.add.text(500, 400, 'Créditos', {
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditosBtn.setStyle({ fill: '#ff9100ff' }))
            .on('pointerover', () => {
                creditosBtn.setStyle({ fill: '#ff9100ff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => creditosBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('CreditsScene');
            });

        const historiaBtn = this.add.text(500, 450, 'Historia', {
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => historiaBtn.setStyle({ fill: '#38ffffff' }))
            .on('pointerover', () => {
                historiaBtn.setStyle({ fill: '#38ffffff' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => historiaBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('HistoriaScene');
            });

        const controlBtn = this.add.text(500, 500, 'Controles', {
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => controlBtn.setStyle({ fill: '#ff0dffc1' }))
            .on('pointerover', () => {
                controlBtn.setStyle({ fill: '#ff0dffc1' });
                this.sound.play('hover', { volume: 0.5 });
            })
            .on('pointerout', () => controlBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('ControlScene', { originalScene: 'MenuScene' });
            });
            
    }
}