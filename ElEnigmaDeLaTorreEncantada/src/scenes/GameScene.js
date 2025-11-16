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
        this.load.image('calderoR', '/imagenes/caldero.png');
        this.load.image('campoFuerzaR', '/imagenes/campodefuerza2.png');
        this.load.image('cofreR', '/imagenes/cofre.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('llaveR', '/imagenes/llave.png');
        this.load.image('pergaminoR', '/imagenes/pergamino.png');
        this.load.image('plantaR', '/imagenes/planta.png');
        this.load.image('pocionesR', '/imagenes/pociones.png');
        this.load.image('velasR', '/imagenes/velas.png');
        this.load.image('estanteR', '/imagenes/estante.png');
    }

    init(){
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor(); 
    }

    create(){
        this.crearEscenario(); 
        this.crearPlataformas(); 
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
    }

    update(){
        if(this.escKey.isDown && !this.escWasDown){
            this.togglePause(); 
        }

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
        this.pared = this.physics.add.image(500, 205, 'paredR'); 
        this.pared.setImmovable(true);        
        this.estanteria = this.physics.add.image(190, 300, 'estanteriaR'); 
        this.estanteria.setImmovable(true); 
        this.bolaCristal = this.physics.add.image(205,300, 'bolaCristalR'); 
        this.bolaCristal.setImmovable(true);        
        this.caldero = this.physics.add.image(500,430, 'calderoR'); 
        this.caldero.setImmovable(true);
        this.campoFuerza = this.physics.add.image(915,270, 'campoFuerzaR'); 
        this.campoFuerza.setImmovable(true);
        this.cofre = this.physics.add.image(500,295, 'cofreR'); 
        this.cofre.setImmovable(true);
        this.llave = this.physics.add.image(200,180, 'llaveR'); 
        this.llave.setImmovable(true);        
        this.pergamino = this.physics.add.image(770,190, 'pergaminoR'); 
        this.pergamino.setImmovable(true);        
        this.planta = this.physics.add.image(190,358, 'plantaR'); 
        this.planta.setImmovable(true);        
        this.pociones = this.physics.add.image(194,268, 'pocionesR'); 
        this.pociones.setImmovable(true);        
        this.velas = this.physics.add.image(165,305, 'velasR'); 
        this.velas.setImmovable(true);   
        
    }

    crearPlataformas(){
        this.plataformas = this.physics.add.staticGroup();
        this.plataformas.create(446, 325, 'estanteR');
        this.plataformas.create(510, 325, 'estanteR'); 
    }

    establecerColisiones(){
        this.players.forEach(player => {
            //this.physics.add.collider(player.sprite, this.pared);
            this.physics.add.collider(player.sprite, this.estanteria);
            this.physics.add.collider(player.sprite, this.plataformas);
            this.physics.add.collider(player.sprite, this.bolaCristal);
            this.physics.add.collider(player.sprite, this.caldero);
            this.physics.add.collider(player.sprite, this.campoFuerza);
            this.physics.add.collider(player.sprite, this.cofre);
            //this.physics.add.collider(player.sprite, this.pergamino);
            this.physics.add.collider(player.sprite, this.planta);
            this.physics.add.collider(player.sprite, this.pociones);
            this.physics.add.collider(player.sprite, this.velas);

            this.physics.add.overlap(player.sprite, this.llave, () => {
                this.llave.destroy();
                console.log("Llave conseguida");
            }); 

        });
    }

    setUpPlayers(){
        const leftPaddle = new Paddle(this, 'player1', 50, 300);
        const rightPaddle = new Paddle(this, 'player2', 950, 300);

        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey:'S',
                leftKey: 'A',
                rightKey: 'D'
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