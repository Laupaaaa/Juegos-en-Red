import Phaser from 'phaser';
import {Paddle} from '../entities/Paddles'
import { CommandProcessor } from '../command/commandProcessor';
import { MovePaddleCommand } from '../command/MovePaddleCommand';
import { PauseGameCommand } from '../command/PauseGameCommand';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload(){
        this.load.image('paredR', '/imagenes/paredYTecho.png'); 
        this.load.image('sueloR', '/imagenes/suelo.png');
        this.load.image('bolaCristalR', '/imagenes/bolaCristal.png');
        this.load.image('calderoR', '/imagenes/calderoColor.png');
        this.load.image('campoFuerzaR', '/imagenes/campodefuerza.png');
        this.load.image('cofreR', '/imagenes/cofre.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('llaveR', '/imagenes/llave.png');
        this.load.image('pergaminoR', '/imagenes/pergamino.png');
        this.load.image('plantaR', '/imagenes/planta.png');
        this.load.image('pocionesR', '/imagenes/pociones.png');
        this.load.image('velasR', '/imagenes/velas.png');
        this.load.image('estanteR', '/imagenes/estante.png');
        this.load.image('librosR', '/imagenes/libros.png');
    }

    init(){
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.abrirLibreria = false; 
        this.processor = new CommandProcessor(); 
        this. maxJump = 3; 
    }

    create(){
        this.crearEscenario(); 
        this.crearPlataformas(); 
        this.crearBarreraInvisible();       
        this.setUpPlayers(); 
        this.establecerColisiones(); 


        this.healthLeft = this.add.text(50, 30, '3', {
            fontSize: '48px',
            color: '#ff0000ff'
        });

        this.healthRight = this.add.text(900, 30, '3', {
            fontSize: '48px',
            color: '#ff0000ff'
        }); 


        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); 
        this.lkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L); 
    }

    update(time, delta){
        if(this.escKey.isDown && !this.escWasDown){
            this.togglePause(); 
        }
        this.escWasDown = this.escKey.isDown;        
        
        this.abrirLibreria = false; //volver a poner a false si no ha habido overlap
        if(this.lkey.isDown) this.abrirLibreria = true; 

        // Comprobar si alguno de los jugadores está saltando
        this.players.forEach(paddle => {
            paddle.update(delta);
        });
        
        this.inputMappings.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            let direction = null; 
            if(mapping.upKeyObj.isDown){
                direction = 'up'; 
            } else if (mapping.downKeyObj.isDown){
                direction  = 'down';          
             } else if (mapping.leftKeyObj.isDown){
                direction  = 'left';          
             } else if (mapping.rightKeyObj.isDown){
                direction  = 'right';          
             } else{
                direction = 'stop'; 
            }
            let moveCommand = new MovePaddleCommand(paddle, direction);
            this.processor.process(moveCommand); 
        });
    }

    crearEscenario(){
        this.suelo = this.physics.add.image(500, 472, 'sueloR'); 
        this.suelo.setImmovable(true);
        this.suelo.setScale(0.55);    
        this.suelo.body.allowGravity = false;
        this.pared = this.physics.add.image(500, 205, 'paredR'); 
        this.pared.setImmovable(true);        
        this.pared.setScale(0.55);    
        this.pared.body.allowGravity = false;
        this.estanteria = this.physics.add.image(165, 300, 'estanteriaR'); 
        this.estanteria.setImmovable(true); 
        this.estanteria.setScale(0.6);    
        this.estanteria.body.allowGravity = false;
        this.bolaCristal = this.physics.add.image(185,303, 'bolaCristalR'); 
        this.bolaCristal.setImmovable(true);     
        this.bolaCristal.setScale(0.6);    
        this.bolaCristal.body.allowGravity = false;   
        this.caldero = this.physics.add.image(500,430, 'calderoR'); 
        this.caldero.setImmovable(true);
        this.caldero.setScale(0.6);    
        this.caldero.body.allowGravity = false;
        this.campoFuerza = this.physics.add.image(940,310, 'campoFuerzaR'); 
        this.campoFuerza.setImmovable(true);
        this.campoFuerza.setScale(0.6);    
        this.campoFuerza.body.allowGravity = false;
        this.cofre = this.physics.add.image(505,283, 'cofreR'); 
        this.cofre.setImmovable(true);
        this.cofre.setScale(0.6);    
        this.cofre.body.allowGravity = false;
        this.llave = this.physics.add.image(170,160, 'llaveR'); 
        this.llave.setImmovable(true);      
        this.llave.setScale(0.6);    
        this.llave.body.allowGravity = false;  
        this.pergamino = this.physics.add.image(780,180, 'pergaminoR'); 
        this.pergamino.setImmovable(true);        
        this.pergamino.setScale(0.6);    
        this.pergamino.body.allowGravity = false;
        this.planta = this.physics.add.image(170,365, 'plantaR'); 
        this.planta.setImmovable(true);        
        this.planta.setScale(0.6);    
        this.planta.body.allowGravity = false;
        this.pociones = this.physics.add.image(169,262, 'pocionesR'); 
        this.pociones.setImmovable(true);       
        this.pociones.setScale(0.6);    
        this.pociones.body.allowGravity = false; 
        this.velas = this.physics.add.image(140,308, 'velasR'); 
        this.velas.setImmovable(true);   
        this.velas.setScale(0.6);    
        this.velas.body.allowGravity = false;
        this.libros = this.physics.add.image(150,220, 'librosR'); 
        this.libros.setImmovable(true);   
        this.libros.setScale(0.6);    
        this.libros.body.allowGravity = false;
    }

    crearBarreraInvisible(){
        // Crear una barrera invisible que evita que suba hacia arriba (pero pueda andar libremente por el suelo)
        this.barreraInvisible = this.physics.add.staticImage(500, 320, null);
        this.barreraInvisible.setSize(1000, 10); // Wide barrier, thin height
        this.barreraInvisible.setVisible(false);
        this.barreraInvisible.body.setSize(1000, 10);

        // Crear collider invisible para que pueda usar la balda superior de la estantería como plataforma
        this.estanteriaColl = this.physics.add.sprite(190, 210, 'white_pixel');
        this.estanteriaColl.body.setAllowGravity(false); 
        this.estanteriaColl.body.setImmovable(true); 
        this.estanteriaColl.setAlpha(0.0); 
        this.estanteriaColl.setScale(4, 0.5); 
    }

    crearPlataformas(){
        this.plataformas = this.physics.add.staticGroup();
        this.plataformas.create(446, 315, 'estanteR');
        this.plataformas.create(510, 315, 'estanteR'); 
        this.plataformas.create(446, 230, 'estanteR'); 
        this.plataformas.create(330, 350, 'estanteR'); 
        this.plataformas.create(330, 215, 'estanteR'); 
    }

    establecerColisiones(){
        this.players.forEach(player => {
            //this.physics.add.collider(player.sprite, this.pared);
            this.physics.add.collider(player.sprite, this.estanteriaColl);
            this.physics.add.collider(player.sprite, this.plataformas);
            //this.physics.add.collider(player.sprite, this.bolaCristal);
            this.physics.add.collider(player.sprite, this.caldero);
            //this.physics.add.collider(player.sprite, this.campoFuerza);
            this.physics.add.collider(player.sprite, this.cofre);
            //this.physics.add.collider(player.sprite, this.pergamino);
            //this.physics.add.collider(player.sprite, this.planta);
            //this.physics.add.collider(player.sprite, this.pociones);
            //this.physics.add.collider(player.sprite, this.velas);

            this.physics.add.overlap(player.sprite, this.llave, () => {
                this.llave.destroy();
                console.log("Llave conseguida");
            }); 
            this.physics.add.overlap(player.sprite, this.estanteria, () => {
                if(this.abrirLibreria) {
                    this.scene.pause();
                    this.scene.launch('LibreriaScene', {originalScene: 'GameScene'})
                }
            }); 


            // Barrera invisible para permitir area de suelo dónde se desplacen libremente, y área de salto para subir por las plataformas
            this.physics.add.collider(
                player.sprite,
                this.barreraInvisible,
                () => {
                    // al colisionar con la barrera invisible mientras el jugador va hacia arriba, salta
                    if (!player.isJumping ) {
                        player.jump();
                    }
                },
                () => {
                    // Process callback - only collide when moving up and not jumping
                    const isMovingUp = player.sprite.body.velocity.y < 0;
                    return !player.isJumping && isMovingUp;
                },
                this
            );

        });
    }

    setUpPlayers(){
        const leftPaddle = new Paddle(this, 'player1', 50, 400);
        const rightPaddle = new Paddle(this, 'player2', 950, 400);

        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey:'S',
                leftKey: 'A',
                rightKey: 'D',
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey:'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT'
            }
        ]

        //this.intputMappings = InputConfig; 
        this.inputMappings = InputConfig.map(config => {
            console.log(config); 
            return{
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });   
    }

    // endGame(winnerID){
    //     this.ball.setVelocity(0,0);
    //     this.players.forEach(paddle => {
    //         paddle.sprite.setVelocity(0,0);
    //     });
    //     this.physics.pause();

    //     const winnerText = winnerID === 'player1' ? 'El jugador 1 ha ganado': ' El jugador 2 ha ganado';
    //     this.add.text(500, 250, winnerText, {
    //         fontSize: '64px',
    //         color:' #00ff00',

    //     }).setOrigin(0.5);

    //     const menuBtn = this.add.text(500, 350, 'Volver al menu', {
    //         fontSize: '32px',
    //         color: '#ffffff'
    //     }).setOrigin(0.5)
    //     .setInteractive({ useHandCursor: true })
    //     .on('pointerover', () => menuBtn.setStyle({ fill: '#7bffc1ff' }))
    //     .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }))
    //     .on('pointerdown', () => {
    //         this.scene.start('MenuScene');
    //     });
    // }

    setPauseState(isPaused){
        this.isPaused = isPaused;
        if(isPaused){
            this.scene.pause();
            this.scene.launch('PauseScene', {originalScene: 'GameScene'})
        }
    }

    resume(){
        this.isPaused = false; 
    }

    togglePause(){
        const newPauseState = !this.isPaused;
        this.processor.process(
            new PauseGameCommand(this, newPauseState)
        ); 
    }
}