import Phaser from 'phaser';

export class ControlScene extends Phaser.Scene {
    constructor() {
        super('ControlScene');
    }

    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png'); 
        this.load.image('pergamino', '/imagenes/pergamino.png'); 
        this.load.image('boton', '/imagenes/botonTexto.png'); 
    }  

    create(data) {
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);

        this.titulo = this.add.image(500,120, 'titulo')
        this.titulo.setScale(0.25);
        this.boton1 = this.add.image(500,530, 'boton')
        this.boton1.setScale(0.1);        
        // this.boton2 = this.add.image(500,400, 'boton')
        // this.boton2.setScale(0.1);        
        this.pergamino1 = this.add.image(250,380, 'pergamino')
        this.pergamino1.setScale(1.8);        
        this.pergamino2 = this.add.image(780,380, 'pergamino')
        this.pergamino2.setScale(1.8);

        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            color: '#000000ff'
        }).setOrigin(0.5);

        this.add.text(500, 240, 'Controles', {
            fontSize: '45px',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(250, 310, 'Jugador 1:', {
            fontSize: '32px',
            color: '#ffbbbbff',
        }).setOrigin(0.5);

        this.add.text(260, 400, 'Moverse:\n W-Arriba\n A-Izquierda\n S-Abajo\n D-Derecha\n SPACE-Saltar\n Q-Interactuar', {
            fontSize: '20px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(750, 310, 'Jugador 2:', {
            fontSize: '32px',
            color: '#9f98ffff',
        }).setOrigin(0.5);

        this.add.text(790, 400, 'Moverse:\n Flechas-Arriba\n Flechas-Izquierda\n Flechas-Abajo\n Flechas-Derecha\n ENTER-Saltar\n L-Interactuar', {
            fontSize: '20px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        const ReturnBtn = this.add.text(500, 530, 'Volver', {
            fontSize: '34px',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#00ff88ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            if(data.originalScene === 'MenuScene'){
                this.scene.start('MenuScene');
            } else {
                this.scene.stop();
                this.scene.resume(data.originalScene);
                this.scene.get(data.originalScene).resume(); 
            }
        });
    }
}