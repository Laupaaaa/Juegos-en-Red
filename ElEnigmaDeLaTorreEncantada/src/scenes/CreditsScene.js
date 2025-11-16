import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.add.text(500, 100, 'El Enigma de la\nTorre Encantada', {
            fontSize: '65px',
            color: '#ffffff'
        }).setOrigin(0.5);       
        
        this.add.text(500, 200, 'Créditos', {
            fontSize: '50px',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(500, 270, 'Paula Ortiz Fernández', {
            fontSize: '24px',
            color: '#04ebebff',
        }).setOrigin(0.5)

        this.add.text(500, 320, 'Daniel Corvacho Anes', {
            fontSize: '24px',
            color: '#fff132ff',
        }).setOrigin(0.5)

        this.add.text(500, 370, 'Alejandro Hernández Ruiz', {
            fontSize: '24px',
            color: '#7b04ebff',
        }).setOrigin(0.5)

        this.add.text(500, 420, 'Ángel Bermúdez Fariñas', {
            fontSize: '24px',
            color: '#eb6004ff',
        }).setOrigin(0.5)

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