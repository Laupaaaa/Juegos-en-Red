import Phaser from 'phaser';
import {Paddle} from '../entities/Paddles'
import { CommandProcessor } from '../command/commandProcessor';
import { MovePaddleCommand } from '../command/MovePaddleCommand';
import { PauseGameCommand } from '../command/PauseGameCommand';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
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
        this.add.rectangle(500, 300, 800, 600, 0x000000);

        for(let i = 0; i<12; i++){
            this.add.rectangle(500, i*50 +25, 10, 30, 0x449944);
        }

        this.scoreLeft = this.add.text(100, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        this.scoreRight = this.add.text(900, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        }); 

        this.createBoundos(); 
        this.createBall();
        this.launchBall(); 
        this.setUpPlayers(); 

        this.physics.add.overlap(this.ball, this.leftGoal, this .scoreRightGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this .scoreLeftGoal, null, this);

        this.players.forEach(paddle =>{
            this.physics.add.collider(this.ball, paddle.sprite);
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
             } else{
                direction = 'stop'; 
            }
            let moveCommand = new MovePaddleCommand(paddle, direction);
            this.processor.process(moveCommand); 
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
                downKey:'S'
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey:'DOWN'
            }
        ]

        //this.intputMappings = InputConfig; 
        this.inputMappings = InputConfig.map(config => {
            console.log(config); 
            return{
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
            }
        });   
    }

    createBoundos(){
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10,600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false); 

        this.rightGoal = this.physics.add.sprite(1000, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10,600);
        this.rightGoal.setImmovable(true);        
        this.rightGoal.setVisible(false); 
    }

    createBall(){
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy(); 

        this.ball = this.physics.add.sprite(500, 300, 'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }

    launchBall(){
        const angle = Phaser.Math.Between(-30,30);
        const speed = 300;
        const direction = Math.random()<0.5 ? 1 : -1;

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle))*speed*direction,
            Math.sin(Phaser.Math.DegToRad(angle))*speed  
        )
    }

    scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score += 1;
        this.scoreLeft.setText(player1.score.toString());
        console.log('Ha marcado el jugador de la izquierda');

        if(player1.score >= 5){
            this.endGame('player1'); 
        } else this.resetBall();
    }

    scoreRightGoal() {
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.scoreRight.setText(player2.score.toString());
        console.log('Ha marcado el jugador de la derecha');
        if(player2.score >= 5){
            this.endGame('player1'); 
        } else this.resetBall();
    }

    resetBall(){
        this.ball.setVelocity(0,0);
        this.ball.setPosition(500, 300);
        
        this.time.delayedCall(1000, () => {
            this.launchBall();
        })
    }

    endGame(winnerID){
        this.ball.setVelocity(0,0);
        this.players.forEach(paddle => {
            paddle.sprite.setVelocity(0,0);
        });
        this.physics.pause();

        const winnerText = winnerID === 'player1' ? 'El jugador 1 ha ganado': ' El jugador 2 ha ganado';
        this.add.text(500, 250, winnerText, {
            fontSize: '64px',
            color:' #00ff00',

        }).setOrigin(0.5);

        const menuBtn = this.add.text(500, 350, 'Volver al menu', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

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