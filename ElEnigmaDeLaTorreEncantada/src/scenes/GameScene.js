import Phaser from 'phaser';
import {Mago} from '../entities/Mago'
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
        this.load.image('cofreAbiertoR', '/imagenes/cofreAbierto.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('llaveR', '/imagenes/llave.png');
        this.load.image('pergaminoR', '/imagenes/pergamino.png');
        this.load.image('plantaR', '/imagenes/planta.png');
        this.load.image('pocionesR', '/imagenes/pociones.png');
        this.load.image('velasR', '/imagenes/velas.png');
        this.load.image('estanteR', '/imagenes/estante.png');
        this.load.image('librosR', '/imagenes/libros.png');
        this.load.image('botonVR', '/imagenes/botonVacio.png');
        this.load.image('botonCR', '/imagenes/botonCompleto.png');
        this.load.image('estrellaR', '/imagenes/estrella.png');
        this.load.image('idle_Azul', '/imagenes/Mago_Andando_2.png');
        this.load.image('andarAzul_2', '/imagenes/Mago_Andando_3.png');
        this.load.image('andarAzul_3', '/imagenes/Mago_Andando_4.png');
        this.load.image('andarAzul_4', '/imagenes/Mago_Andando_5.png');
        this.load.image('andarAzul_5', '/imagenes/Mago_Andando_6.png');
        this.load.image('andarAzul_6', '/imagenes/Mago_Andando_7.png');
        this.load.image('andarAzul_7', '/imagenes/Mago_Andando_8.png');
        this.load.image('andarAzul_8', '/imagenes/Mago_Andando_1.png');
        this.load.image('idle_Rojo', '/imagenes/MagoRojo_Andando_1.png');
        this.load.image('andarRojo_2', '/imagenes/MagoRojo_Andando_2.png');
        this.load.image('andarRojo_3', '/imagenes/MagoRojo_Andando_3.png');
        this.load.image('andarRojo_4', '/imagenes/MagoRojo_Andando_4.png');
        this.load.image('andarRojo_5', '/imagenes/MagoRojo_Andando_5.png');
        this.load.image('andarRojo_6', '/imagenes/MagoRojo_Andando_6.png');
        this.load.image('andarRojo_7', '/imagenes/MagoRojo_Andando_7.png');
        this.load.image('andarRojo_8', '/imagenes/MagoRojo_Andando_8.png');
    }

    init(){
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.lPulsada = false; 
        this.processor = new CommandProcessor(); 
        this. maxJump = 3; 
        this.cofreAbierto = false;
        
        // Array de booleanos que representa que objetos han recogido entre ambos jugadores
        // Los objetos son: 0-llave, 1-libros, 2- pocion morada, 3- pocion verde, 4- pocion rosa, 5- pocion azul, 6- pocion amarilla, 7- pocion naranja, 8- velas, 9- bola de cristal, 10- planta, 11- estrella 1, 12- estrella 2
        this.inventario = [false, false, false, false, false, false, false, false, false, false, false, false, false];  
    }

    create(){
        
        this.anims.create({
            key: 'andar_mago_Azul',
            frames: [
                {key:'idle_Azul'},
                {key:'andarAzul_2'},
                {key:'andarAzul_3'},
                {key:'andarAzul_4'},
                {key:'andarAzul_5'},
                {key:'andarAzul_6'},
                {key:'andarAzul_7'},
                {key:'andarAzul_8'}
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'andar_mago_Rojo',
            frames: [
                {key:'idle_Rojo'},
                {key:'andarRojo_2'},
                {key:'andarRojo_3'},
                {key:'andarRojo_4'},
                {key:'andarRojo_5'},
                {key:'andarRojo_6'},
                {key:'andarRojo_7'},
                {key:'andarRojo_8'}
            ],
            frameRate: 10,
            repeat: -1
        });

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
        this.qkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); 
        
        
    }

    update(time, delta){
        if(this.escKey.isDown && !this.escWasDown){
            this.togglePause(); 
        }
        this.escWasDown = this.escKey.isDown;        
        
        this.lPulsada = false; //volver a poner a false si no ha habido overlap
        if(this.lkey.isDown) this.lPulsada = true; 

        // Comprobar si alguno de los jugadores está saltando
        this.players.forEach(mago => {
            mago.update(delta);
        });
        
        this.inputMappings.forEach(mapping => {
            const mago = this.players.get(mapping.playerId);
            let direction = null; 
            if(mapping.upKeyObj.isDown){
                direction = 'up'; 
                mago.andar_animacion();
            } else if (mapping.downKeyObj.isDown){
                direction  = 'down'; 
                mago.andar_animacion();         
             } else if (mapping.leftKeyObj.isDown){
                direction  = 'left';
                mago.sprite.flipX = false;  
                mago.andar_animacion();        
             } else if (mapping.rightKeyObj.isDown){
                direction  = 'right';    
                mago.sprite.flipX = true;  
                mago.andar_animacion();    
             } else{
                direction = 'stop'; 
                mago.andar_animacion_parar();
            }
            let moveCommand = new MovePaddleCommand(mago, direction);
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
        this.boton1 = this.physics.add.image(50,350, 'botonVR'); 
        this.boton1.setImmovable(true);   
        this.boton1.setScale(0.6);    
        this.boton1.body.allowGravity = false;
        this.boton2 = this.physics.add.image(780,350, 'botonVR'); 
        this.boton2.setImmovable(true);   
        this.boton2.setScale(0.6);    
        this.boton2.body.allowGravity = false;

        // estrellas de dentro del cofre
        this.estrella1 = this.physics.add.image(450,283, 'estrellaR'); 
        this.estrella1.setImmovable(true);
        this.estrella1.setScale(0.6);  
        this.estrella1.setAlpha(0.0);
        this.estrella1.body.allowGravity = false; 
        this.estrella2 = this.physics.add.image(560,283, 'estrellaR'); 
        this.estrella2.setImmovable(true);
        this.estrella2.setScale(0.6);  
        this.estrella2.setAlpha(0.0);
        this.estrella2.body.allowGravity = false; 
    }

    crearBarreraInvisible(){
        // Crear una barrera invisible que evita que suba hacia arriba (pero pueda andar libremente por el suelo)
        this.barreraInvisible = this.physics.add.staticImage(500, 400, null);
        this.barreraInvisible.setSize(1000, 10); // Wide barrier, thin height
        this.barreraInvisible.setVisible(false);
        this.barreraInvisible.body.setSize(1000, 10);

        // Crear collider invisible para que pueda usar la balda superior de la estantería como plataforma
        this.estanteriaColl = this.physics.add.sprite(165, 195, 'white_pixel');
        this.estanteriaColl.body.setAllowGravity(false); 
        this.estanteriaColl.body.setImmovable(true); 
        this.estanteriaColl.setAlpha(0.0); 
        this.estanteriaColl.setScale(4, 0.5);

        // Crear collider invisible para evitar que atraviese el caldero
        this.calderoColl = this.physics.add.sprite(500, 400, 'white_pixel');
        this.calderoColl.body.setAllowGravity(false); 
        this.calderoColl.body.setImmovable(true); 
        this.calderoColl.setAlpha(0.0); 
        //this.calderoColl.setScale(5, 5);
        this.calderoColl.setCircle(85);
        this.calderoColl.body.setOffset(-70,-55);
    }

    crearPlataformas(){
        this.plataformas = this.physics.add.staticGroup();
        this.plataformas.create(446, 315, 'estanteR');
        this.plataformas.create(510, 315, 'estanteR'); 
        this.plataformas.create(570, 315, 'estanteR'); 
        this.plataformas.create(446, 230, 'estanteR'); 
        this.plataformas.create(330, 350, 'estanteR'); 
        this.plataformas.create(650, 350, 'estanteR'); 
        this.plataformas.create(330, 215, 'estanteR'); 
        this.plataformas.create(650, 215, 'estanteR'); 
    }

    establecerColisiones(){
        this.players.forEach(player => {
            // Colisiones del jugador con el escenario
            this.physics.add.collider(player.sprite, this.estanteriaColl);
            this.physics.add.collider(player.sprite, this.plataformas);
            this.physics.add.collider(player.sprite, this.calderoColl);
            //this.physics.add.collider(player.sprite, this.cofre);

            // Conseguir la llave
            this.physics.add.overlap(player.sprite, this.llave, () => {
                this.llave.destroy();
                console.log("Llave conseguida");
                this.inventario[0] = true; // marcar en el inventario que se ha conseguido la llave
            }); 

            // Abrir la librería
            this.physics.add.overlap(player.sprite, this.estanteria, () => {
                if(this.lPulsada) {
                    this.scene.pause();
                    this.scene.launch('LibreriaScene', {originalScene: 'GameScene', pociones: this.inventario});
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

            // Crear pocion de disminuir tamaño si se tienen las pociones necesarias
            this.physics.add.overlap(player.sprite, this.caldero, () => {
                if(Phaser.Input.Keyboard.JustDown(this.lkey) || Phaser.Input.Keyboard.JustDown(this.qkey)) { // Comprobar que se ha pulsado la tecla L o Q para crear la pocion (si se mantiene pulsada la tecla no entrará varias veces a la función)
                    let elemRecogidos = this.inventario.filter(elem => elem === true); // crear un segundo array con unicamente los elementos recogidos
                    if(elemRecogidos.length === 3){ // primero comprobar que se han recogido 3 elementos
                        if(this.inventario[3] && this.inventario[5] && this.inventario[7]){ // comprobar que esos elementos recogidos son las pociones verde, azul y naranja 
                            console.log("Poción de disminuir tamaño creada");
                        }
                    } else {
                        console.log("No tienes las pociones necesarias para crear la poción de disminuir tamaño");
                        let aleatorio = Phaser.Math.Between(1, 2); // generar un número aleatorio entre 1 y 2 para elegir que jugador recibe daño
                        if(aleatorio === 1) this.dañoJugLeft(); 
                        else this.dañoJugRight(); 
                    }

                    // volver a poner a false todos los elementos del inventario
                    for (let i = 1; i < this.inventario.length; i++){ // se salta la llave porque no se utiliza para crear la pocion
                        this.inventario[i] = false; 
                    }
                }                   
            });

            // Abrir el cofre si se tiene la llave
            this.physics.add.overlap(player.sprite, this.cofre, () => {
                if(!this.cofreAbierto){
                    if(this.inventario[0]) { // comprobar que tiene la llave
                        this.abrirCofre();
                    } else {
                        console.log("Necesitas la llave para abrir el cofre");
                    }  
                }
            });

            // recoger estrellas
            this.physics.add.overlap(player.sprite, this.estrella1, () => {
                this.recogerEstrella(1);
            });            
            this.physics.add.overlap(player.sprite, this.estrella2, () => {
                this.recogerEstrella(2);
            });


            //colocar estrellas
            this.physics.add.overlap(player.sprite, this.boton1, () => {
                this.colocarEstrella(1);
            }); 
            this.physics.add.overlap(player.sprite, this.boton2, () => {
                this.colocarEstrella(2);
            });  
            
            
            // pulsar botones para desactivar el campo de fuerza
            this.physics.add.overlap(player.sprite, this.boton1, () => {
                this.boton1Activado = true;
                this.abrirCampoFuerza(); 
            }); 
            this.physics.add.overlap(player.sprite, this.boton2, () => {
                this.boton2Activado = true;
                this.abrirCampoFuerza();
            }); 
            

        });
    }
    
    abrirCofre(){
        console.log("Cofre abierto");
        this.cofre.setTexture('cofreAbiertoR');
        this.estrella1.setAlpha(1.0);
        this.estrella2.setAlpha(1.0);
        this.cofreAbierto = true; // para que solo se abra una vez

    }

    recogerEstrella(n){
        this.inventario[11] = true;
        this.inventario[12] = true;
        if(this.cofreAbierto){ // solo se puede recoger si el cofre está abierto (porque sino están ocultas)
            console.log("Estrella " + n + " recogida");
            this.inventario[10 + n] = true; // marcar en el inventario que se ha conseguido la estrella (11 y 12 en el array)
            if(n === 1) this.estrella1.destroy();
            else this.estrella2.destroy();
        }
    }

    colocarEstrella(n){
        if(this.inventario[10 + n]){ // comprobar que se tiene la estrella correspondiente
            console.log("Estrella " + n + " colocada");
            if(n === 1){
                this.boton1.setTexture('botonCR');
                this.inventario[10 + n] = false; // quitar la estrella del inventario
            } else {
                this.boton2.setTexture('botonCR');
                this.inventario[10 + n] = false; // quitar la estrella del inventario
            }
        }
    }

    abrirCampoFuerza(){
        if(this.boton1.texture.key === 'botonCR' && this.boton2.texture.key === 'botonCR'){ //comprobar que ambos botones tienen la estrella colocada
            if(this.qkey.isDown && this.lkey.isDown && this.boton1Activado && this.boton2Activado){ // comprobar que ambos jugadores están pulsando su tecla correspondiente
                console.log("Campo de fuerza desactivado");
                this.campoFuerza.destroy();
            }
        }
    }

    setUpPlayers(){
        const leftMago = new Mago(this, 'player1', 50, 400, 'idle_Azul');
        const rightMago = new Mago(this, 'player2', 950, 400, 'idle_Rojo');

        this.players.set('player1', leftMago);
        this.players.set('player2', rightMago);

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
            return{
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });   
    }

    endGame(id){
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);
        this.players.forEach(mago => {
            mago.sprite.setVelocity(0,0);
        });
        this.physics.pause();

        const texto = id === 'player1' ? 'El jugador 1 ha muerto': ' El jugador 2 ha muerto';
        this.add.text(500, 250, texto, {
            fontSize: '64px',
            color:' #ff0000ff',

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

    dañoJugLeft() {
        const player1 = this.players.get('player1');
        player1.vida--;
        this.healthLeft.setText(player1.vida.toString());
        console.log('El jugador de la izquierda ha recibido daño');
        if(player1.vida <= 0) this.endGame('player1');
    }
    
    dañoJugRight() {
        const player2 = this.players.get('player2');
        player2.vida--;
        this.healthRight.setText(player2.vida.toString());
        console.log('El jugador de la derecha ha recibido daño');
        if(player2.vida <= 0) this.endGame('player2');
    }

    setPauseState(isPaused){
        this.isPaused = isPaused;
        if(isPaused){
            this.scene.pause();
            this.scene.launch('PauseScene', {originalScene: 'GameScene'})
        }
    }

    resume(data){
        if(data && data.pociones){
            this.inventario = data.pociones; 
        }
        this.isPaused = false; 
    }

    togglePause(){
        const newPauseState = !this.isPaused;
        this.processor.process(
            new PauseGameCommand(this, newPauseState)
        ); 
    }
}