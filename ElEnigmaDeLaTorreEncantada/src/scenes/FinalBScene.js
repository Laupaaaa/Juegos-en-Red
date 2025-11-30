import Phaser from 'phaser';

export class FinalBScene extends Phaser.Scene {
        constructor() {
            super('FinalBScene');
        }
    
    preload(){
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('fondoC', '/imagenes/compartir.png');
        this.load.audio('victoria', '/sounds/victoria.mp3');
    }   

    create(){
        this.fondoC = this.physics.add.image(500,300, 'fondoC');
        this.fondoC.setImmovable(true);
        this.fondoC.body.allowGravity = false;

        // Reproducir música de victoria
        if (this.sound) {
            this.sound.play('victoria', { volume: 0.7 });
        }

        this.boton1 = this.add.image(500,500, 'boton')
        this.boton1.setScale(0.13);        


    
        this.add.text(500, 50, 'Los jugadores han decidido', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 100, 'compartir el Elixir de la Vida Eterna, ahora', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 150, 'ambos vivirán hasta la eternidad,', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

         this.add.text(500, 200, 'y podrán adquirir todos los conocimientos', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 250, 'existentes...', {
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
                // Detener música de victoria antes de cambiar de escena
                if (this.sound) this.sound.stopByKey('victoria');
                this.scene.start('MenuScene');
            })
        }
}