import Phaser from 'phaser';

export class DecisionScene extends Phaser.Scene {
    constructor() {
        super('DecisionScene');
    }

    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png'); 
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('fondoD', '/imagenes/eleccion.jpg');}   

    create(data){
        this.fondoD = this.physics.add.image(500,300, 'fondoD');
        this.fondoD.setImmovable(true);
        this.fondoD.body.allowGravity = false;

        this.titulo = this.add.image(500,120, 'titulo')
        this.titulo.setScale(0.26);
        this.boton1 = this.add.image(280,420, 'boton')
        this.boton1.setScale(0.15);   
        this.boton1.setAlpha(0.5);     
        this.boton2 = this.add.image(730,420, 'boton')
        this.boton2.setScale(0.15);
        this.boton2.setAlpha(0.5); 

        if (data.modo === 'local') this.selector = Phaser.Math.Between(1, 2);
        else this.selector = data.eleccion;

        if (this.selector === 1){
            this.add.text(500, 100, 'El jugador 1 ha recogido', {
                fontSize: '32px',
            fontFamily: 'Tagesschrift',
                color: '#000000ff',
            }).setOrigin(0.5);
            this.id = 'player1'; 
        } else if (this.selector === 2){
            this.add.text(500, 100, 'El jugador 2 ha recogido', {
                fontSize: '32px',
             fontFamily: 'Tagesschrift',
               color: '#000000ff',
            }).setOrigin(0.5);
            this.id = 'player2';
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
        .setAlpha(0.5);

        const btn2 = this.add.text(730, 420, 'Beber el elixir', {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setAlpha(0.5);

        

        if (data.modo === 'online'){
            const puedeElegir = this.id === data.jugador; 
            if(puedeElegir){
                btn1.setAlpha(1); 
                btn1.setInteractive({ useHandCursor: true });
                btn1.on('pointerover', () => {
                    btn1.setStyle({ fill: '#4bffabff' });
                });
                btn1.on('pointerout', () => btn1.setStyle({ fill: '#000000ff' }))
                btn1.on('pointerdown', () => {
                    if (data.ws && data.ws.readyState === WebSocket.OPEN) {
                        console.log("enviando final"); 
                        data.ws.send(JSON.stringify({type: 'escenaFinal', escena: 3}));
                    }
                });

                btn2.setAlpha(1)
                btn2.setInteractive({ useHandCursor: true })
                btn2.on('pointerover', () => {
                    btn2.setStyle({ fill: '#4bffabff' });
                });
                btn2.on('pointerout', () => btn2.setStyle({ fill: '#000000ff' }));
                btn2.on('pointerdown', () => {
                    if (this.selector === 1){
                        if (data.ws && data.ws.readyState === WebSocket.OPEN) {
                            console.log("ebviando final"); 
                            data.ws.send(JSON.stringify({type: 'escenaFinal', escena: 1}));
                        }
                    }
                    else if (this.selector === 2){
                        if (data.ws && data.ws.readyState === WebSocket.OPEN) {
                            console.log("enviando final"); 
                            data.ws.send(JSON.stringify({type: 'escenaFinal', escena: 2}));
                        }      
                    }
                });

                this.boton1.setAlpha(1);
                this.boton2.setAlpha(1);  
            } 
        } else if (data.modo === 'local'){
            btn1.setAlpha(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn1.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn1.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('FinalBScene');
            });

            btn2.setAlpha(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn2.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn2.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                if (this.selector === 1){
                    this.scene.start('FinalM1Scene');
                }
                else if (this.selector === 2){
                    this.scene.start('FinalM2Scene');
                }
            });
            this.boton1.setAlpha(1);
            this.boton2.setAlpha(1); 
        }
    }
}

