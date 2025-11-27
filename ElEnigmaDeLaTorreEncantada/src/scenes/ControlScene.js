import Phaser from 'phaser';

export class ControlScene extends Phaser.Scene {
    constructor() {
        super('ControlScene');
    }

    create() {
        this.add.text(500, 100, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(500, 200, 'Controles', {
            fontSize: '50px',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(250, 280, 'Jugador 1:', {
            fontSize: '32px',
            color: '#ff0000',
        }).setOrigin(0.5);

        this.add.text(260, 370, 'Moverse:\n W-Arriba\n A-Izquierda\n S-Abajo\n D-Derecha\n SPACE-Saltar\n Q-Interactuar', {
            fontSize: '20px',
            color: '#04ebebff',
        }).setOrigin(0.5);

        this.add.text(750, 280, 'Jugador 2:', {
            fontSize: '32px',
            color: '#1100ffff',
        }).setOrigin(0.5);

        this.add.text(790, 370, 'Moverse:\n Flechas-Arriba\n Flechas-Izquierda\n Flechas-Abajo\n Flechas-Derecha\n ENTER-Saltar\n L-Interactuar', {
            fontSize: '20px',
            color: '#04ebebff',
        }).setOrigin(0.5);

        const ReturnBtn = this.add.text(500, 500, 'Volver', {
            fontSize: '34px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}