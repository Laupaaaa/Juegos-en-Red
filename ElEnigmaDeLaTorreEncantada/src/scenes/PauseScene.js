import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene{
    constructor(){
        super('PauseScene');
    }

    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png'); 
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.audio('hover', '/sounds/hover.mp3');
    }   

    create(data){
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);

        this.titulo = this.add.image(500,200, 'titulo')
        this.titulo.setScale(0.25);
        this.boton1 = this.add.image(500,350, 'boton')
        this.boton1.setScale(0.1);        
        this.boton2 = this.add.image(500,400, 'boton')
        this.boton2.setScale(0.1);
        this.boton3 = this.add.image(500,450, 'boton')
        this.boton3.setScale(0.1);

        this.add.text(500, 200, 'Juego Pausado', {
            fontSize: '60px', 
            color:'#000000ff'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(500, 350, 'Volver', {
            fontSize: '32px',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            resumeBtn.setStyle({ fill: '#00ff88ff' });
            this.sound.play('hover', { volume: 0.5 });
        })
         .on('pointerout', () => resumeBtn.setStyle({ fill: '#000000ff' }))
         .on('pointerdown', () => {
             this.scene.stop();
             this.scene.resume(data.originalScene);
             this.scene.get(data.originalScene).resume(); 
         });

        const menuBtn = this.add.text(500, 400, 'Menú', {
             fontSize: '32px',
             color: '#000000ff',
         }).setOrigin(0.5)
         .setInteractive({ useHandCursor: true })
         .on('pointerover', () => {
            menuBtn.setStyle({ fill: '#6839b3ff' });
            this.sound.play('hover', { volume: 0.5 });
        })
          .on('pointerout', () => menuBtn.setStyle({ fill: '#000000ff' }))
          .on('pointerdown', () => {
              this.scene.start('MenuScene');
              this.scene.stop(data.originalScene);
          });

         
         const controlBtn = this.add.text(500, 450, 'Controles', {
             fontSize: '32px',
             color: '#000000ff',
         }).setOrigin(0.5)
         .setInteractive({ useHandCursor: true })
         .on('pointerover', () => {
            controlBtn.setStyle({ fill: '#00eeffff' });
            this.sound.play('hover', { volume: 0.5 });
        })
          .on('pointerout', () => controlBtn.setStyle({ fill: '#000000ff' }))
          .on('pointerdown', () => {
              this.scene.start('ControlScene', { originalScene: 'GameScene' }); 
          });
    }
}