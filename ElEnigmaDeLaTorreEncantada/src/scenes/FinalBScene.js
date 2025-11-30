import Phaser from 'phaser';

export class FinalBScene extends Phaser.Scene {
        constructor() {
            super('FinalBScene');
        }
    
    preload(){
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('fondoC', '/imagenes/compartir.png');
    }   

    create(){
        this.fondoC = this.physics.add.image(500,300, 'fondoC');
        this.fondoC.setImmovable(true);
        this.fondoC.body.allowGravity = false;

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
            })
            .on('pointerout', () => btn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            })
        }
}