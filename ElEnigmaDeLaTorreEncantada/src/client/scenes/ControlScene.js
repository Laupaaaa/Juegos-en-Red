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
        this.pergamino1 = this.add.image(220,380, 'pergamino')
        this.pergamino1.setScale(1.3, 1.8);
        this.pergamino2 = this.add.image(500,380, 'pergamino')
        this.pergamino2.setScale(1.3,1.8);        
        this.pergamino3 = this.add.image(780,380, 'pergamino')
        this.pergamino3.setScale(1.3,1.8);

        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff'
        }).setOrigin(0.5)
        .setAngle(-8);

        this.add.text(500, 240, 'Controles', {
            fontSize: '45px',
            fontFamily: 'Tagesschrift',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(220, 310, 'Jugador 1:', {
            fontSize: '32px',
             fontFamily: 'Tagesschrift',
           color: '#9be3ffff',
        }).setOrigin(0.5);

        this.add.text(230, 400, 'W-Arriba\n A-Izquierda\n S-Abajo\n D-Derecha\n SPACE-Saltar\n Q-Interactuar', {
            fontSize: '20px',
            fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 310, 'Jugador 2:', {
            fontSize: '32px',
            color: 'rgba(255, 99, 99, 1)',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5);

        this.add.text(520, 400, 'Flechas-Arriba\n Flechas-Izquierda\n Flechas-Abajo\n Flechas-Derecha\n ENTER-Saltar\n L-Interactuar', {
            fontSize: '20px',
            fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(750, 310, 'Online:', {
            fontSize: '32px',
            color: 'rgba(141, 116, 255, 1)',
            fontFamily: 'Tagesschrift',
        }).setOrigin(0.5);

        this.add.text(800, 400, 'Flechas-Arriba\n Flechas-Izquierda\n Flechas-Abajo\n Flechas-Derecha\n SPACE-Saltar\n L-Interactuar', {
            fontSize: '20px',
            fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5);

        const ReturnBtn = this.add.text(500, 530, 'Volver', {
            fontSize: '34px',
             fontFamily: 'Tagesschrift',
           color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#00ff88ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            if(data.originalScene === 'MenuScene'){
                try { if (this.sound) this.sound.stopByKey('musicaMenu'); } catch(err){ console.warn(err); }
                this.scene.stop();
                this.scene.start('MenuScene');
            } else {
                this.scene.stop();
                this.scene.resume(data.originalScene);
                this.scene.get(data.originalScene).resume();
            }
        });
    }
}