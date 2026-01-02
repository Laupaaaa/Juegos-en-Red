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
            fontFamily: 'Tagesschrift',
            color:'#000000ff'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(500, 350, 'Volver', {
            fontSize: '32px',
            fontFamily: 'Tagesschrift',
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
            fontFamily: 'Tagesschrift',
             color: '#000000ff',
         }).setOrigin(0.5)
         .setInteractive({ useHandCursor: true })
         .on('pointerover', () => {
            menuBtn.setStyle({ fill: '#6839b3ff' });
            this.sound.play('hover', { volume: 0.5 });
        })
          .on('pointerout', () => menuBtn.setStyle({ fill: '#000000ff' }))
          .on('pointerdown', () => {
              // Si venimos de la escena online, avisar al servidor para notificar desconexión
              try {
                  if (data && data.originalScene === 'GameSceneO') {
                      const origScene = this.scene.get('GameSceneO');
                      if (origScene && origScene.ws && origScene.ws.readyState === WebSocket.OPEN) {
                          origScene.ws.send(JSON.stringify({ type: 'playerDisconnected' }));
                          // Cerrar la conexión después de un breve retraso para asegurar envío
                          setTimeout(() => { try { origScene.ws.close(); } catch(e){ console.warn(e); } }, 50);
                      }
                  }
              } catch(err) { console.warn(err); }

              this.scene.start('MenuScene');
              this.scene.stop(data.originalScene);
          });

         
         const controlBtn = this.add.text(500, 450, 'Controles', {
             fontSize: '32px',
            fontFamily: 'Tagesschrift',
             color: '#000000ff',
         }).setOrigin(0.5)
         .setInteractive({ useHandCursor: true })
         .on('pointerover', () => {
            controlBtn.setStyle({ fill: '#00eeffff' });
            this.sound.play('hover', { volume: 0.5 });
        })
          .on('pointerout', () => controlBtn.setStyle({ fill: '#000000ff' }))
          .on('pointerdown', () => {
              // Pasar la escena original para que Controles pueda volver correctamente (GameScene o GameSceneO)
              this.scene.start('ControlScene', { originalScene: data && data.originalScene ? data.originalScene : 'GameScene' }); 
          });
    }
}