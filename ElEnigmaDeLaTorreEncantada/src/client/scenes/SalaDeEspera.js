import Phaser from "phaser";
import { Mago } from '../entities/Mago'
import { CommandProcessor } from '../command/commandProcessor';
import { MoveMagoCommand } from '../command/MoveMagoCommand';
import { PauseGameCommand } from '../command/PauseGameCommand';

export default class SalaDeEspera extends Phaser.Scene {
  constructor() {
    super({ key: 'SalaDeEspera' });
    this.ws = null;
  }

  preload() {
    //Escenario
        this.load.image('paredR', '/imagenes/paredYTecho.png');
        this.load.image('sueloR', '/imagenes/suelo.png');

    
    // Personajes
        this.load.image('idle_Azul', '/imagenes/Mago_Andando_2.png');
        this.load.image('andarAzul_2', '/imagenes/Mago_Andando_3.png');
        this.load.image('andarAzul_3', '/imagenes/Mago_Andando_4.png');
        this.load.image('andarAzul_4', '/imagenes/Mago_Andando_5.png');
        this.load.image('andarAzul_5', '/imagenes/Mago_Andando_6.png');
        this.load.image('andarAzul_6', '/imagenes/Mago_Andando_7.png');
        this.load.image('andarAzul_7', '/imagenes/Mago_Andando_8.png');
        this.load.image('andarAzul_8', '/imagenes/Mago_Andando_1.png');
        // this.load.image('idle_Rojo', '/imagenes/MagoRojo_Andando_1.png');
        // this.load.image('andarRojo_2', '/imagenes/MagoRojo_Andando_2.png');
        // this.load.image('andarRojo_3', '/imagenes/MagoRojo_Andando_3.png');
        // this.load.image('andarRojo_4', '/imagenes/MagoRojo_Andando_4.png');
        // this.load.image('andarRojo_5', '/imagenes/MagoRojo_Andando_5.png');
        // this.load.image('andarRojo_6', '/imagenes/MagoRojo_Andando_6.png');
        // this.load.image('andarRojo_7', '/imagenes/MagoRojo_Andando_7.png');
        // this.load.image('andarRojo_8', '/imagenes/MagoRojo_Andando_8.png');

    // BGM
        this.load.audio('bgm', '/sounds/bgm.mp3');

    // Efectos de sonido
        this.load.audio('walk', '/sounds/walk.mp3');
  }

  init(){
    this.walkSounds = new Map(); // Map para guardar el sonido de cada jugador

    this.players = new Map(); // Map para guardar los jugadores en la escena
    this.inputMappings = [];
    this.isPaused = false;
    this.escWasDown = false;
    this.processor = new CommandProcessor();
  }

  create(){
         this.anims.create({
            key: 'andar_mago_Azul',
            frames: [
                { key: 'idle_Azul' },
                { key: 'andarAzul_2' },
                { key: 'andarAzul_3' },
                { key: 'andarAzul_4' },
                { key: 'andarAzul_5' },
                { key: 'andarAzul_6' },
                { key: 'andarAzul_7' },
                { key: 'andarAzul_8' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'andar_mago_Rojo',
        //     frames: [
        //         { key: 'idle_Rojo' },
        //         { key: 'andarRojo_2' },
        //         { key: 'andarRojo_3' },
        //         { key: 'andarRojo_4' },
        //         { key: 'andarRojo_5' },
        //         { key: 'andarRojo_6' },
        //         { key: 'andarRojo_7' },
        //         { key: 'andarRojo_8' }
        //     ],
        //     frameRate: 10,
        //     repeat: -1
        // });

        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
        if (!this.bgm.isPlaying) {
            this.bgm.play();
        }

        // Crear un sonido de pasos para cada jugador
        this.walkSounds.set('player1', this.sound.add('walk', { loop: true, volume: 0.3 }));
        //this.walkSounds.set('player2', this.sound.add('walk', { loop: true, volume: 0.3 }));

        // Parar pasos cuando la escena se pause (ej. PauseScene) y limpiar sonidos al shutdown
        this.events.on('pause', () => {
            this.walkSounds.forEach(ws => { try { if (ws && ws.isPlaying) ws.stop(); } catch(err){ console.warn(err); } });
        });
        // Al resume no se reproduce automáticamente: el update() reanudará pasos si se pulsa mover
        this.events.on('resume', () => {
            // nada especial: update() volverá a reproducir cuando detecte movimiento
        });
        // Asegurar limpieza cuando la escena se cierre definitivamente
        this.events.once('shutdown', () => {
            // parar y destruir sonidos de pasos
            this.walkSounds.forEach(ws => {
                try { if (ws && ws.isPlaying) ws.stop(); } catch(err){ console.warn(err); }
                try { if (ws) ws.destroy(); } catch(err){ console.warn(err); }
            });
            this.walkSounds.clear();
            // parar BGM
            try { if (this.bgm && (this.bgm.isPlaying || this.bgm.isPaused)) this.bgm.stop(); } catch(err){ console.warn(err); }
        });

    this.crearEscenario();
    this.crearBarreraInvisible();
    this.setUpPlayers();
    this.establecerColisiones();

    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    

    // this.add.text(500, 350, 'Esperando a otros jugadores...', {
    //   fontSize: '32px',
    //   color: '#000000ff',
    // }).setOrigin(0.5);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    this.add.text(width / 2, 100, 'Online Multiplayer', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Connecting to server...', {
      fontSize: '24px',
      color: '#ffff00'
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontSize: '20px',
      color: '#00ff00'
    }).setOrigin(0.5);

    // Cancel button
    const cancelButton = this.add.text(width / 2, height - 100, 'Cancel', {
      fontSize: '24px',
      color: '#ff6666',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    cancelButton.on('pointerover', () => {
      cancelButton.setColor('#ff0000');
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setColor('#ff6666');
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
      this.scene.start('MenuScene');
    });

    // Connect to WebSocket server
    this.connectToServer();
  }

  update(){
    if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }
        this.escWasDown = this.escKey.isDown;

        this.inputMappings.forEach(mapping => {
            const mago = this.players.get(mapping.playerId);
            let direction = null;
            let salto = false;
            const walkSound = this.walkSounds.get(mapping.playerId);
            let isMoving = false;
            if (mapping.upKeyObj.isDown) {
                direction = 'up';
                isMoving = true;
                mago.andar_animacion();
            } else if (mapping.downKeyObj.isDown) {
                direction = 'down';
                isMoving = true;
                mago.andar_animacion();
            } else if (mapping.leftKeyObj.isDown) {
                direction = 'left';
                isMoving = true;
                mago.sprite.flipX = false;
                mago.andar_animacion();
            } else if (mapping.rightKeyObj.isDown) {
                direction = 'right';
                isMoving = true;
                mago.sprite.flipX = true;
                mago.andar_animacion();
            } else {
                direction = 'stop';
                mago.andar_animacion_parar();

                if (walkSound && walkSound.isPlaying) {
                    walkSound.stop();
                }
            }

            if (isMoving && walkSound && !walkSound.isPlaying) {
                walkSound.play();
            }
            let moveCommand = new MoveMagoCommand(mago, direction, salto);
            this.processor.process(moveCommand);
        });

 }


  crearEscenario() {
        this.suelo = this.physics.add.image(500, 472, 'sueloR');
        this.suelo.setImmovable(true);
        this.suelo.setScale(0.55);
        this.suelo.body.allowGravity = false;
        this.pared = this.physics.add.image(500, 205, 'paredR');
        this.pared.setImmovable(true);
        this.pared.setScale(0.55);
        this.pared.body.allowGravity = false;
    }

    crearBarreraInvisible() {
        // Crear una barrera invisible que evita que suba hacia arriba (pero pueda andar libremente por el suelo)
        this.barreraInvisible = this.physics.add.staticImage(500, 105, null);
        this.barreraInvisible.setSize(1000, 500); 
        this.barreraInvisible.setVisible(false);
        this.barreraInvisible.body.setSize(1000, 500);

    }

    establecerColisiones() {
        this.players.forEach(player => {
                // Barrera invisible para permitir area de suelo donde se desplacen libremente, y area de salto para subir por las plataformas
            // Barrera invisible para permitir area de suelo donde se desplacen libremente, y area de salto para subir por las plataformas
            this.physics.add.collider(
                player.sprite,
                this.barreraInvisible,
                () => {
                    // al colisionar con la barrera invisible mientras el jugador va hacia arriba, salta
                    if (!player.isJumping) {
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

    setUpPlayers() {
            const leftMago = new Mago(this, 'player1', 50, 400, 'idle_Azul');
            //const rightMago = new Mago(this, 'player2', 950, 400, 'idle_Rojo');
    
            this.players.set('player1', leftMago);
            //this.players.set('player2', rightMago);
    
            const InputConfig = [
                {
                    playerId: 'player1',
                    upKey: 'W',
                    downKey: 'S',
                    leftKey: 'A',
                    rightKey: 'D',
                    jump: 'SPACE'
                },
                // {
                //     playerId: 'player2',
                //     upKey: 'UP',
                //     downKey: 'DOWN',
                //     leftKey: 'LEFT',
                //     rightKey: 'RIGHT',
                //     jump: 'ENTER'
                // }
            ]
    
            //this.intputMappings = InputConfig; 
            this.inputMappings = InputConfig.map(config => {
                return {
                    playerId: config.playerId,
                    upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                    downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                    leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                    rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                    jumpObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.jump]),
                }
    
            }
            );
        }
        
    setPauseState(isPaused) {
        this.isPaused = isPaused;
        if (isPaused) {
            this.scene.pause();
            this.scene.launch('PauseScene', { originalScene: 'GameScene' })
        }
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.pause();
        }

    }

    resume(data) {
        console.log("Resuming GameScene with data:", data);
        if (data && data.pociones) {
            this.inventario = data.pociones;
        }
        this.isPaused = false;
        if (this.bgm && this.bgm.isPaused) {
            this.bgm.resume();
        }

        this.inventario.forEach((item, index) => {
            console.log(`Inventario[${index}]: ${item}`);
        });
    }

    togglePause() {
        const newPauseState = !this.isPaused;
        this.processor.process(
            new PauseGameCommand(this, newPauseState)
        );
    }

    connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.statusText.setText('Esperando a tu compañero...');

        // Join matchmaking queue
        this.ws.send(JSON.stringify({ type: 'joinQueue' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          console.error('Error parsing server message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.statusText.setText('Connection error!');
        this.statusText.setColor('#ff0000');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          this.statusText.setText('Connection lost!');
          this.statusText.setColor('#ff0000');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      this.statusText.setText('Failed to connect!');
      this.statusText.setColor('#ff0000');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Jugadores en cola: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        // Store game data and transition to multiplayer game scene
        this.scene.start('MultiplayerGameScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
          initialBall: data.ball
        });
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  leaveQueue() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
      this.ws.close();
    }
  }

  shutdown() {
    this.leaveQueue();
  }

}