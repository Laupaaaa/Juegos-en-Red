import Phaser from 'phaser';

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

        this.fondo_2M = this.physics.add.image(500,300, 'fondo_2M');
        this.fondo_2M.setImmovable(true);
        this.fondo_2M.body.allowGravity = false;

        // Reproducir música de derrota
        if (this.sound) {
            this.sound.play('derrota', { volume: 0.7 });
        }

        this.boton1 = this.add.image(500,500, 'boton')
        this.boton1.setScale(0.13);   

        this.add.text(500, 50, 'El jugador 2 ha decidido', {
        fontSize: '32px',
        color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 100, 'no compartir el Elixir de la Vida Eterna,', {
            fontSize: '32px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 150, 'ahora debe enfrentar las consecuencias de su elección y vivir solo', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 175, 'hasta la eternidad...', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        const btn = this.add.text(500, 500, 'Volver al menú principal', {
            fontSize: '16px',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            btn.setStyle({ fill: '#4bffabff' });
            this.sound.play('hover', { volume: 0.5 });
        })
         .on('pointerout', () => btn.setStyle({ fill: '#000000ff' }))
         .on('pointerdown', () => {
            // Detener música de derrota antes de cambiar de escena
            if (this.sound) this.sound.stopByKey('derrota');
             this.scene.start('MenuScene');
         })

    }
}