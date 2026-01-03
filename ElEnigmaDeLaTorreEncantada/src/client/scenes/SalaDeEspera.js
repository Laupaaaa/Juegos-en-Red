 import Phaser from "phaser";
import { Mago } from '../entities/Mago'
import { CommandProcessor } from '../command/commandProcessor';
import { MoveMagoCommand } from '../command/MoveMagoCommand';

export default class SalaDeEspera extends Phaser.Scene {
  constructor() {
    super({ key: 'SalaDeEspera' });
    this.ws = null;
    this.roomCode = null;
    this.isInRoom = false;
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
        this.load.image('pergaminoTitulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('boton', '/imagenes/botonTexto.png');
        this.load.image('campoFuerza', '/imagenes/campodefuerza.png');

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
    this.bgm = null;
    
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


    // Crear un sonido de pasos para cada jugador
    this.walkSounds.set('player1', this.sound.add('walk', { loop: true, volume: 0.3 }));
    this.walkSounds.set('player2', this.sound.add('walk', { loop: true, volume: 0.3 }));

    // Parar pasos cuando la escena se pause (ej. PauseScene) y limpiar sonidos al shutdown
    this.events.on('pause', () => {
        this.walkSounds.forEach(ws => { try { if (ws && ws.isPlaying) ws.stop(); } catch(err){ console.warn(err); } });
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.pause();
        }
    });
    // Al resume no se reproduce automáticamente: el update() reanudará pasos si se pulsa mover
    this.events.on('resume', () => {
        // nada especial: update() volverá a reproducir cuando detecte movimiento
        if (this.bgm && !this.bgm.isPlaying) {
            this.bgm.resume();
        }
    });
    // Asegurar limpieza cuando la escena se cierre definitivamente
    this.events.once('shutdown', () => {
        // parar y destruir sonidos de pasos
        this.walkSounds.forEach(ws => {
            try { if (ws && ws.isPlaying) ws.stop(); } catch(err){ console.warn(err); }
            try { if (ws) ws.destroy(); } catch(err){ console.warn(err); }
            try{
              if(this.bgm){
                this.bgm.stop();
                this.bgm.destroy();
              }
            }catch (err){ console.warn(err); }
        });
        this.walkSounds.clear();
    });

    this.crearEscenario();
    this.crearBarreraInvisible();
    this.setUpPlayers();
    this.establecerColisiones();

    // Stop menu music and play background music
    this.game.sound.stopByKey('musicaMenu');
    this.bgm = this.sound.add('bgm', { volume: 0.7, loop: true });
    this.bgm.play();

    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    

    // this.add.text(500, 350, 'Esperando a otros jugadores...', {
    //   fontSize: '32px',
    //   color: '#000000ff',
    // }).setOrigin(0.5);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.titulo = this.add.image(width / 2, 100, 'pergaminoTitulo')
    this.titulo.setScale(0.25, 0.20);
    this.boton = this.add.image(width / 2, height - 100, 'boton')
    this.boton.setScale(0.05, 0.1); 


    // Title
    this.add.text(width / 2, 100, 'Online Multiplayer', {
      fontSize: '48px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 100, 'Código de sala: ', {
      fontSize: '32px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.roomCodeText = this.add.text(width / 2, height / 2 - 50, '', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'O únete a otra torre...', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createCodeInput(width / 2, height / 2 + 70);

    this.botonUnirse = this.add.image(width / 2, height /2 + 120, 'boton');
    this.botonUnirse.setScale(0.05, 0.1);

    this.unirseText = this.add.text(width / 2, height / 2 + 120, 'Unirse', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff'
    }).setOrigin(0.5).setInteractive();

    this.unirseText.on('pointerover', () => {
      this.unirseText.setStyle({ fill: '#ff0000' });
    });

    this.unirseText.on('pointerout', () => {
      this.unirseText.setStyle({ fill: '#000000ff' });
    }); 
    this.unirseText.on('pointerdown', () => this.unirseSala());
    

    // Status text
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Connecting to server...', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffff00'
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontSize: '20px',
      fontFamily: 'Tagesschrift',
      color: '#00ff00'
    }).setOrigin(0.5);

    // Cancel button
    const cancelButton = this.add.text(width / 2, height - 100, 'Volver', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    cancelButton.on('pointerover', () => {
      cancelButton.setColor('#ff0000');
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setColor('#000000ff');
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
      if (this.bgm && this.bgm.isPlaying) {
        this.bgm.stop();
      }
      this.scene.start('MenuScene');
    });

    // Connect to WebSocket server
    this.connectToServer();
  }

  createCodeInput(x, y) {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'roomCodeInput';
    inputElement.placeholder = 'Código de sala';
    inputElement.maxLength = 6;
    inputElement.style.cssText = `
      position: absolute;
      width: 200px;
      height: 40px;
      font-size: 24px;
      text-align: center;
      font-family: Tagesschrift, arial;
      text-transform: uppercase;
      border: 3px solid #ffffff;
      background-color: #222222;
      color: #ffffff;
      border-radius: 5px;
      outline: none;
      z-index: 9999;`;

      inputElement.addEventListener('input', () => {
        // Use the element reference directly to avoid typing issues on EventTarget
        inputElement.value = inputElement.value.toUpperCase();
      });

      inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.unirseSala();
        } 
      });

      document.body.appendChild(inputElement);

      // Position relative to canvas to avoid page offsets
      const inputWidth = 200;
      const inputHeight = 40;
      const positionInput = () => {
        const rect = this.game.canvas.getBoundingClientRect();
        inputElement.style.left = `${Math.round(rect.left + x - inputWidth / 2)}px`;
        inputElement.style.top = `${Math.round(rect.top + y - inputHeight / 2)}px`;
      };

      positionInput();
      window.addEventListener('resize', positionInput);
      window.addEventListener('scroll', positionInput);

      this.events.once('shutdown', () => {
        window.removeEventListener('resize', positionInput);
        window.removeEventListener('scroll', positionInput);
        inputElement.remove();
      });

      this.codeInput = inputElement;
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Jugadores en cola: ${data.position}/2`);
        break;

      case 'roomInfo':
        // Show room code to the creator
        if (data.code) {
          this.roomCode = data.code;
          this.roomId = data.roomId;
          this.roomCodeText.setText(data.code);
          this.statusText.setText(`Sala creada: ${data.code}`);
          this.statusText.setColor('#00ff00');
        }
        break;

      case 'joinRoomResult':
        if (data.success) {
          this.roomCode = data.code;
          this.roomId = data.roomId;
          this.roomCodeText.setText(data.code);
          this.statusText.setText('Unido a la sala.');
          this.statusText.setColor('#00ff00');
        } else {
          this.statusText.setText(data.message || 'No se pudo unir a la sala.');
          this.statusText.setColor('#ff0000');
        }
        break;

      case 'gameStart':
        // Prevent duplicate start events
        if (this.gameStarted) return;
        this.gameStarted = true;
        // If server provides the code, show it before starting
        if (data.code) {
          this.roomCode = data.code;
          this.roomCodeText.setText(data.code);
        }
        console.log('Game starting!', data);
        if (this.bgm){
          this.bgm.stop();
          this.bgm.destroy();
        }
        // Store game data and transition to multiplayer game scene
        this.scene.start('GameSceneO', {
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

  unirseSala() {
    const code = this.codeInput.value.trim().toUpperCase();
    if(!code){
      this.statusText.setText('Por favor, introduce un código de sala.');
      this.statusText.setColor('#ff0000');
      return;
    }

    if(code.length !== 6){
      this.statusText.setText('El código de sala debe tener 6 caracteres.');
      this.statusText.setColor('#ff0000');
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'joinRoom', code: code }));
      this.statusText.setText('Intentando unirse a la sala...');
      this.statusText.setColor('#ffff00');
    } else {
      this.statusText.setText('No conectado al servidor. Error de conextión.');
      this.statusText.setColor('#ff0000');
    }
  }
  update(){
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
        this.campoFuerza = this.physics.add.image(940, 310, 'campoFuerza');
        this.campoFuerza.setImmovable(true);
        this.campoFuerza.setScale(0.6);
        this.campoFuerza.body.allowGravity = false;
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
                this.barreraInvisible
            );
        });
    }

    setUpPlayers() {
            const leftMago = new Mago(this, 'player1', 50, 400, 'idle_Azul');
            // const rightMago = new Mago(this, 'player2', 950, 400, 'idle_Azul');
    
            this.players.set('player1', leftMago);
            // this.players.set('player2', rightMago);
    
            const InputConfig = [
                {
                    playerId: 'player1',
                    upKey: 'UP',
                    downKey: 'DOWN',
                    leftKey: 'LEFT',
                    rightKey: 'RIGHT',
                    jump: 'SPACE'
                },
                // {
                //     playerId: 'player2',
                //     upKey: 'W',
                //     downKey: 'S',
                //     leftKey: 'A',
                //     rightKey: 'D',
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

    }

    resume(data) {
        console.log("Resuming GameScene with data:", data);
        if (data && data.pociones) {
            this.inventario = data.pociones;
        }
        this.isPaused = false;

        this.inventario.forEach((item, index) => {
            console.log(`Inventario[${index}]: ${item}`);
        });
    }

    connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        //this.statusText.setText('Esperando a tu compañero...');

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