import Phaser from 'phaser';

export class DecisionScene extends Phaser.Scene {
    constructor() {
        super('DecisionScene');
    }

    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png'); 
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('fondoD', '/imagenes/eleccion.jpg');}   

    create(){
        this.fondoD = this.physics.add.image(500,300, 'fondoD');
        this.fondoD.setImmovable(true);
        this.fondoD.body.allowGravity = false;

        this.titulo = this.add.image(500,120, 'titulo')
        this.titulo.setScale(0.26);
        this.boton1 = this.add.image(280,420, 'boton')
        this.boton1.setScale(0.15);        
        this.boton2 = this.add.image(730,420, 'boton')
        this.boton2.setScale(0.15);

        let aleatorio = Phaser.Math.Between(1, 2);
        if (aleatorio === 1){
            this.add.text(500, 100, 'El jugador 1 ha recogido', {
                fontSize: '32px',
            fontFamily: 'Tagesschrift',
                color: '#000000ff',
            }).setOrigin(0.5);
        } else if (aleatorio === 2){
            this.add.text(500, 100, 'El jugador 2 ha recogido', {
                fontSize: '32px',
             fontFamily: 'Tagesschrift',
               color: '#000000ff',
            }).setOrigin(0.5);
        }

        this.add.text(500, 150, 'el Elixir de la Vida Eterna,', {
            fontSize: '32px',
             fontFamily: 'Tagesschrift',
           color: '#000000ff',
        }).setOrigin(0.5);

        this.add.text(500, 320, 'ahora deberá elegir:', {
            fontSize: '32px',
            fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5);

        const btn1 = this.add.text(280, 420, 'Compartir el elixir', {
            fontSize: '24px',
              fontFamily: 'Tagesschrift',
          color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            btn1.setStyle({ fill: '#4bffabff' });
        })
        .on('pointerout', () => btn1.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            this.scene.start('FinalBScene');
        });

        const btn2 = this.add.text(730, 420, 'Beber el elixir', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            btn2.setStyle({ fill: '#4bffabff' });
        })
        .on('pointerout', () => btn2.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            if (aleatorio === 1){
                this.scene.start('FinalM1Scene');
            }
            else if (aleatorio === 2){
                this.scene.start('FinalM2Scene');
            }
        });
    }
    
}

