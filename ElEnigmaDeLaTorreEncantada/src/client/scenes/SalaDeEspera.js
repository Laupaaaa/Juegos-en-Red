 import Phaser from "phaser";
import { Mago } from '../entities/Mago'
import { CommandProcessor } from '../command/commandProcessor';
import { MoveMagoCommand } from '../command/MoveMagoCommand';

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

  resetState() {
    this.roomCode = null;
    this.roomId = null;
    this.gameStarted = false;

    if(this.roomCodeText && this.roomCodeText.active){
      this.roomCodeText.setText('');
    }

    if(this.statusText && this.statusText.active){
      this.statusText.setText('');
    }

    if(this.codeInput && document.body.contains(this.codeInput)){
      this.codeInput.value = '';
    }
  }

  init(){
    this.walkSounds = new Map(); // Map para guardar el sonido de cada jugador

    this.players = new Map(); // Map para guardar los jugadores en la escena
    this.inputMappings = [];
    this.isPaused = false;
    this.escWasDown = false;
    this.processor = new CommandProcessor();
    this.bgm = null;

    this.roomCode = null;
    this.roomId = null;
    this.gameStarted = false;
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
    
    
    // Connect to WebSocket server
    this.connectToServer();
    console.log("codigo:", this.roomCode);
    this.crearInterfaz();
  }

  crearInterfaz(){
    // Aquí puedes crear los elementos de la interfaz de usuario necesarios

    /*this.add.text(500, 350, 'Esperando a otros jugadores...', {
      fontSize: '32px',
      color: '#000000ff',
    }).setOrigin(0.5);*/

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.pergamino = this.add.image(width / 2, 100, 'pergaminoTitulo')
    this.pergamino.setScale(0.25, 0.20);

    // Title
    this.titulo = this.add.text(width / 2, 100, 'Online Multiplayer', {
      fontSize: '48px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    // this.tituloTorre = this.add.text(width / 2, 140, 'Tu torre: ', {
    //   fontSize: '24px',
    //   fontFamily: 'Tagesschrift',
    //   color: '#ffffff'
    // }).setOrigin(0.5);

    this.roomCodeText = this.add.text(width / 2, 150, '', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff',
    }).setOrigin(0.5);

    // ============ CREAR SALA PRIVADA ============

    this.tituloCrearSala = this.add.text(width / 2, 300, 'Crear torre', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.botonCrearSala = this.add.image(width / 2, 340, 'boton');
    this.botonCrearSala.setScale(0.05, 0.1);

    this.crearSalaText = this.add.text(width / 2, 340, 'Crear', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff'
    }).setOrigin(0.5).setInteractive();

    this.crearSalaText.on('pointerover', () => {
      this.crearSalaText.setStyle({ fill: '#ff0000' });
    });
    this.crearSalaText.on('pointerout', () => {
      this.crearSalaText.setStyle({ fill: '#000000ff' });
    });
    this.crearSalaText.on('pointerdown', () => {
      this.resetState();
      this.crearSala()});

    // ============ UNIRTE A LA COLA (SALA ALEATORIA) ============

    this.tituloCola = this.add.text(width / 2, 200, 'Únete a una torre...', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    //boton unirse a la cola
    this.botonUnirseCola = this.add.image(width / 2, 240, 'boton');
    this.botonUnirseCola.setScale(0.05, 0.1);

    this.unirseColaText = this.add.text(width / 2, 240, 'Torre', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff'
    }).setOrigin(0.5).setInteractive();

    this.unirseColaText.on('pointerover', () => {
      this.unirseColaText.setStyle({ fill: '#ff0000' });
    });

    this.unirseColaText.on('pointerout', () => {
      this.unirseColaText.setStyle({ fill: '#000000ff' });
    });

    this.unirseColaText.on('pointerdown', () => {
      this.resetState();
      this.unirseCola()});

    /*this.estadoColaText = this.add.text(width / 2, height / 2 - 50, 'Conectando al servidor...', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffff00'
    }).setOrigin(0.5);*/

    // ============ UNIRTE A UNA SALA (CÓDIGO) ============ 

    this.tituloCodigo = this.add.text(width / 2, 400, 'O únete con código', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createCodeInput(width/2 - 80, 440);

    this.botonUnirseCodigo = this.add.image(width / 2 + 110,440, 'boton');
    this.botonUnirseCodigo.setScale(0.05, 0.1);

    this.unirseCodigoText = this.add.text(width / 2 + 110, 440, 'Unirse', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff'
    }).setOrigin(0.5).setInteractive();

    this.unirseCodigoText.on('pointerover', () => {
      this.unirseCodigoText.setStyle({ fill: '#ff0000' });
    });

    this.unirseCodigoText.on('pointerout', () => {
      this.unirseCodigoText.setStyle({ fill: '#000000ff' });
    }); 

    this.unirseCodigoText.on('pointerdown', () => {
      //this.resetState();
      this.unirseSala()});

    this.statusText = this.add.text(width / 2, height / 2, '', {
      fontSize: '20px',
      fontFamily: 'Tagesschrift',
      color: '#ff0000'
    }).setOrigin(0.5);
      
    const botonVolver = this.add.image(width/2, 520, 'boton');
    botonVolver.setScale(0.05, 0.1);

    const volverButton = this.add.text(width / 2, 520, 'Volver', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff'
    }).setOrigin(0.5).setInteractive();

    volverButton.on('pointerover', () => {
      volverButton.setStyle({ fill: '#ff0000' });
    });

    volverButton.on('pointerout', () => {
      volverButton.setStyle({ fill: '#000000ff' });
    });

    // volverButton.on('pointerdown', () => { {
    //   if(!this.tituloCola.visible){
    //     this.leaveQueue();
    //     this.mostrarBotones();
    //     this.statusText.setText('');
    //   } else {
        
    //   this.leaveQueue();
    //   if(this.bgm && this.bgm.isPlaying){
    //     this.bgm.stop();
    //   } 
    //   this.scene.start('MenuScene');}

    // }});

    volverButton.on('pointerdown', () => {
      this.leaveQueue();
      if(this.bgm && this.bgm.isPlaying){
        this.bgm.stop();
      }
      this.resetState();
      this.scene.start('MenuScene');
    });
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
        this.statusText.setText(`Jugadores en cola: ${data.position}/2`);
        this.statusText.setColor('#ffff00');
        break;

      case 'roomInfo':
        // Show room code to the creator
        if (data.code) {
          this.roomCode = data.code;
          this.roomCodeText.setText(`Tu torre: ${data.code}`);
          this.roomCodeText.setColor('#ffffff');
          this.roomId = data.roomId;
          this.statusText.setText(`Sala creada: ${data.code}`);
          this.statusText.setColor('#00ff00');
        }
        break;

      case 'joinRoomResult':
        if (data.success) {
          this.roomCode = data.code;
          this.roomId = data.roomId;
          this.roomCodeText.setText(data.code);
          this.roomCodeText.setColor('#ffffff');
          this.statusText.setText('Unido a la sala.');
          this.statusText.setColor('#00ff00');
        } else {
          this.resetState();
          this.mostrarBotones();
          this.statusText.setText(data.message || 'No se pudo unir a la sala.');
          this.statusText.setColor('#ff0000');
        }
        break;

      case 'startGame':
      case 'gameStart':
        // Prevenir eventos duplicados
        if (this.gameStarted) return;
        this.gameStarted = true;
        
        if (data.code) {
          this.roomCode = data.code;
          this.roomCodeText.setText(`Torre: ${data.code}`);
          this.roomCodeText.setColor('#ffffff');
        }
        this.statusText.setText('¡Partida iniciando!');
        this.statusText.setColor('#00ff00');

        console.log('Partida iniciando!', data);
        if (this.bgm){
          this.bgm.stop();
          this.bgm.destroy();
        }
        // transicion a la escena del juego
        this.scene.start('GameSceneO', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId || this.roomId,
          initialBall: data.ball
        });
        break;

      case 'error':
        this.resetState();
          this.statusText.setText(data.message || 'Error del servidor.');
          this.statusText.setColor('#ff0000');
          this.mostrarBotones();
          break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  crearSala(){
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if(this.roomCode){
        this.statusText.setText('Ya has creado una sala.');
        this.statusText.setColor('#ff0000');
        return;
      }

      this.ws.send(JSON.stringify({ type: 'createRoom' }));

      this.ocultarBotones();

      this.statusText.setText('Creando sala...');
      this.statusText.setColor('#ffff00');
    } else {
      this.statusText.setText('No conectado al servidor. Error de conextión.');
      this.statusText.setColor('#ff0000');
    }
  }

  unirseCola() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'joinQueue' }));

      this.ocultarBotones();

      this.statusText.setText('Buscando partida...');
      this.statusText.setColor('#ffff00');
    } else {
      this.statusText.setText('No conectado al servidor. Error de conextión.');
      this.statusText.setColor('#ff0000');
    }
  }

  ocultarBotones() {
    this.tituloCrearSala.setVisible(false);
    this.botonCrearSala.setVisible(false);
    this.crearSalaText.setVisible(false);
    this.crearSalaText.disableInteractive();

    this.tituloCola.setVisible(false);
    this.botonUnirseCola.setVisible(false);
    this.unirseColaText.setVisible(false);
    this.unirseColaText.disableInteractive();


    this.tituloCodigo.setVisible(false);
    this.codeInput.style.display = 'none';
    this.botonUnirseCodigo.setVisible(false);
    this.unirseCodigoText.setVisible(false);
    this.unirseCodigoText.disableInteractive();

    if(this.codeInput){
      this.codeInput.style.display = 'none';
    }
  }

  mostrarBotones() {
    this.tituloCrearSala.setVisible(true);
    this.botonCrearSala.setVisible(true);
    this.crearSalaText.setVisible(true);
    this.crearSalaText.setInteractive();

    this.tituloCola.setVisible(true);
    this.botonUnirseCola.setVisible(true);
    this.unirseColaText.setVisible(true);
    this.unirseColaText.setInteractive();

    this.tituloCodigo.setVisible(true);
    this.codeInput.style.display = 'block';
    this.botonUnirseCodigo.setVisible(true);
    this.unirseCodigoText.setVisible(true);
    this.unirseCodigoText.setInteractive();

    if(this.codeInput){
      this.codeInput.style.display = 'block';
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

      if(this.ws){
        if(this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING){
          console.log('WebSocket already connected or connecting');
          this.ws.onopen = null;
          this.ws.onmessage = null;
          this.ws.onerror = null;
          this.ws.onclose = null;
          this.ws.close();
        }
        this.ws = null;
      }
      const wsUrl = `ws://${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.statusText.setText('Conectado al servidor.');
        this.statusText.setColor('#00ff00');

        this.time.delayedCall(500, () => {
          this.statusText.setText('');
        });

        // Join matchmaking queue
        //this..send(JSON.stringify({ type: 'joinQueue' }));
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
        if (this.scene.isActive('SalaDeEspera')) {
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
      //this.ws.close();
      this.resetState();
      this.mostrarBotones();
    }
  }

  cleanup(){

    if (this.ws){
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      if(this.ws.readyState === WebSocket.OPEN){
        this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
        this.ws.close();
      }
      this.ws = null;
    }

    if(this.codeInput && document.body.contains(this.codeInput)){
      this.codeInput.remove();
      this.codeInput = null;
    }

    this.resetState();
  }

  shutdown() {
    this.cleanup();
    this.leaveQueue();
  }

}