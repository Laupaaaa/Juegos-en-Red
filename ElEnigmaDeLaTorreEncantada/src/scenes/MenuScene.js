import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload(){
        this.load.image('fondoM', '/imagenes/logoSinFondo.png'); 
    }

    create() {
        this.add.image(500,280, 'fondoM')


        this.add.text(500, 100, 'El Enigma de la\nTorre Encantada', {
            fontSize: '64px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const localBtn = this.add.text(500, 300, 'Local', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => localBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const onlineBtn = this.add.text(500, 350, 'Online (no disponible)', {
            fontSize: '24px',
            color: '#ad32ffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => onlineBtn.setStyle({ fill: '#ca9ee7ff' }))
        .on('pointerout', () => onlineBtn.setStyle({ fill: '#ad32ffff' }))

        const creditosBtn = this.add.text(500, 400, 'Créditos', {
            fontSize: '24px',
            color: '#eb8704ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => creditosBtn.setStyle({ fill: '#fad3a0ff' }))
        .on('pointerout', () => creditosBtn.setStyle({ fill: '#eb8704ff' }))
        .on('pointerdown', () => {
            this.scene.start('CreditsScene');
        });

        const historiaBtn = this.add.text(500, 450, 'Historia', {
            fontSize: '24px',
            color: '#04ebebff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => historiaBtn.setStyle({ fill: '#a8ffffff' }))
        .on('pointerout', () => historiaBtn.setStyle({ fill: '#04ebebff' }))
        .on('pointerdown', () => {
            this.scene.start('HistoriaScene');
        });

        const controlBtn = this.add.text(500, 500, 'Controles', {
            fontSize: '24px',
            color: '#ffffffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => controlBtn.setStyle({ fill: '#ff7bffc1' }))
        .on('pointerout', () => controlBtn.setStyle({ fill: '#fad3a0ff' }))
        .on('pointerdown', () => {
            this.scene.start('ControlScene');
        });
    }
}