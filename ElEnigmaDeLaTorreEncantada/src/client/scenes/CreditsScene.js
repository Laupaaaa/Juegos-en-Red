import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }
    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('pergamino', '/imagenes/pergamino.png');
        this.load.image('boton', '/imagenes/botonTexto.png');
    }

    create() {
        this.titulo = this.add.image(500,120, 'titulo')
        this.titulo.setScale(0.25);
        this.boton1 = this.add.image(500,530, 'boton')
        this.boton1.setScale(0.1);

        this.pergamino1 = this.add.image(500,380, 'pergamino')
        this.pergamino1.setScale(2);

        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff'
        }).setOrigin(0.5)
        .setAngle(-8);

        this.add.text(500, 245, 'Créditos', {
            fontSize: '50px',
            fontFamily: 'Tagesschrift',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(500, 310, 'Paula Ortiz Fernández', {
            fontSize: '24px',
            color: '#91ffffff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)

        this.add.text(500, 355, 'Daniel Corbacho Anes', {
            fontSize: '24px',
            color: '#fff132ff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)

        this.add.text(500, 400, 'Alejandro Hernández Ruiz', {
            fontSize: '24px',
            color: '#d7acffff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)

        this.add.text(500, 450, 'Ángel Bermúdez Fariñas', {
            fontSize: '24px',
            color: '#ffceadff',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5)

        const ReturnBtn = this.add.text(500, 530, 'Volver', {
            fontSize: '34px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#00ff88ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            try { if (this.sound) this.sound.stopByKey('musicaMenu'); } catch(err){ console.warn(err); }
            this.scene.start('MenuScene');
        });
    }
}