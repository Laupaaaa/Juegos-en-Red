import Phaser from 'phaser';
import {Paddle} from '../entities/Paddles'
import { CommandProcessor } from '../command/commandProcessor';
import { MovePaddleCommand } from '../command/MovePaddleCommand';

export class LibreriaScene extends Phaser.Scene {

    constructor() {
        super('LibreriaScene');
    }

    preload(){
        this.load.image('paredR', '/imagenes/paredYTecho.png'); 
        this.load.image('bolaCristalR', '/imagenes/bolaCristal.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('plantaR', '/imagenes/planta.png');
        this.load.image('pocionesR', '/imagenes/pociones.png');
        this.load.image('velasR', '/imagenes/velas.png');
    }

    init(){
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        //this.isPaused = false;
        this.escWasDown = false;
        this.datos; 
        this.processor = new CommandProcessor(); 
    }

    create(data){
        this.crearEscenario(); 
        this.setUpPlayers(); 
        this.establecerColisiones(); 
        this.datos = data; 

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); 
    }

    update(){
        if(this.escKey.isDown && !this.escWasDown){
            this.scene.stop();
            this.scene.resume(this.datos.originalScene);
            // this.scene.get(this.datos.originalScene).resume(); 
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
        this.pared = this.physics.add.image(500, 205, 'paredR'); 
        this.pared.setImmovable(true);     
        this.pared.setScale(3);    
        this.pared.body.allowGravity = false;
        this.estanteria = this.physics.add.image(440, 270, 'estanteriaR'); 
        this.estanteria.setImmovable(true); 
        this.estanteria.setScale(3);    
        this.estanteria.body.allowGravity = false;
        this.bolaCristal = this.physics.add.image(485,280, 'bolaCristalR'); 
        this.bolaCristal.setImmovable(true);                    
        this.bolaCristal.setScale(3);    
        this.bolaCristal.body.allowGravity = false;
        this.planta = this.physics.add.image(440,450, 'plantaR'); 
        this.planta.setImmovable(true);        
        this.planta.setScale(3);    
        this.planta.body.allowGravity = false;
        this.pociones = this.physics.add.image(450,175, 'pocionesR'); 
        this.pociones.setImmovable(true);        
        this.pociones.setScale(3);    
        this.pociones.body.allowGravity = false;
        this.velas = this.physics.add.image(370,290, 'velasR'); 
        this.velas.setImmovable(true);   
        this.velas.setScale(3);    
        this.velas.body.allowGravity = false;    
    }

    establecerColisiones(){
        this.players.forEach(player => {
            this.physics.add.overlap(player.sprite, this.bolaCristal);
            this.physics.add.overlap(player.sprite, this.planta);
            this.physics.add.overlap(player.sprite, this.pociones);
            this.physics.add.overlap(player.sprite, this.velas);
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
}