import Phaser from 'phaser';
import { Mago } from '../entities/Mago'
import { CommandProcessor } from '../command/commandProcessor';
import { MoveMagoCommand } from '../command/MoveMagoCommand';
import { PauseGameCommand } from '../command/PauseGameCommand';

import { connectionManager } from '../services/ConnectionManager';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        // Escemnario y objetos 
        this.load.image('paredR', '/imagenes/paredYTecho.png');
        this.load.image('sueloR', '/imagenes/suelo.png');
        this.load.image('bolaCristalR', '/imagenes/bolaCristal.png');
        this.load.image('calderoR', '/imagenes/calderoColor.png');
        this.load.image('campoFuerzaR', '/imagenes/campodefuerza.png');
        this.load.image('cofreR', '/imagenes/cofre.png');
        this.load.image('cofreAbiertoR', '/imagenes/cofreAbierto.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('llaveR', '/imagenes/llave.png');
        this.load.image('pergaminoR', '/imagenes/pergaminoColor.png');
        this.load.image('plantaR', '/imagenes/planta.png');
        this.load.image('pocionesR', '/imagenes/pociones.png');
        this.load.image('velasR', '/imagenes/velas.png');
        this.load.image('estanteR', '/imagenes/estante.png');
        this.load.image('librosR', '/imagenes/libros.png');
        this.load.image('botonVR', '/imagenes/botonVacio.png');
        this.load.image('botonCR', '/imagenes/botonCompleto.png');
        this.load.image('estrellaR', '/imagenes/estrella.png');
        this.load.image('pocionesAz', '/imagenes/pocionAzul.png');
        this.load.image('pocionesAm', '/imagenes/pocionesAmarillo.png');
        this.load.image('pocionesN', '/imagenes/pocionNaranja.png');
        this.load.image('pocionesRo', '/imagenes/pocionRosa.png');
        this.load.image('pocionesM', '/imagenes/pocionMorada.png');
        this.load.image('pocionesV', '/imagenes/pocionVerde.png');

        // Personajes
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

        // Interfaz Muerte
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('boton', '/imagenes/botonTexto.png');

        // BGM
        this.load.audio('bgm', '/sounds/bgm.mp3');

        // sonidos de efectos
        this.load.audio('abrirCofre', '/sounds/chest_open.mp3');
        this.load.audio('recogerPocion', '/sounds/botellas.mp3');
        this.load.audio('recogerLlave', '/sounds/llave.mp3');
        this.load.audio('walk', '/sounds/walk.mp3');
        this.load.audio('explosion', '/sounds/explosion.mp3');
        this.load.audio('puerta', '/sounds/puerta.mp3');
        this.load.audio('trigger', '/sounds/trigger.mp3');
        this.load.audio('pequeño', '/sounds/pequeño.mp3');
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.isPaused = false;
        this.escWasDown = false;
        this.lPulsada = false;
        this.processor = new CommandProcessor();
        this.cofreAbierto = false;
        this.walkSounds = new Map(); // Map para guardar el sonido de cada jugador

        // Array de booleanos que representa que objetos han recogido entre ambos jugadores
        // Los objetos son: 0-llave, 1-libros, 2- pocion morada, 3- pocion verde, 4- pocion rosa, 5- pocion azul, 6- pocion amarilla, 7- pocion naranja, 8- velas, 9- bola de cristal, 10- planta, 11- estrella 1, 12- estrella 2
        this.inventario = [false, false, false, false, false, false, false, false, false, false, false, false, false];
    }

    create() {

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

        this.anims.create({
            key: 'andar_mago_Rojo',
            frames: [
                { key: 'idle_Rojo' },
                { key: 'andarRojo_2' },
                { key: 'andarRojo_3' },
                { key: 'andarRojo_4' },
                { key: 'andarRojo_5' },
                { key: 'andarRojo_6' },
                { key: 'andarRojo_7' },
                { key: 'andarRojo_8' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
        if (!this.bgm.isPlaying) {
            this.bgm.play();
        }

        // Crear un sonido de pasos para cada jugador
        this.walkSounds.set('player1', this.sound.add('walk', { loop: true, volume: 0.3 }));
        this.walkSounds.set('player2', this.sound.add('walk', { loop: true, volume: 0.3 }));

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
        this.crearPlataformas();
        this.crearBarreraInvisible();
        this.setUpPlayers();
        this.establecerColisiones();
        this.inventarioEnPantalla(); 


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



        this.connectionListener = (data) =>{
            if(!data.connected && this.scene.isActive()){
                this.onConnectionLost(); 
            }
        }
        connectionManager.addListener(this.connectionListener); 
    }

    onConnectionLost(){
        this.scene.pause();
        this.scene.launch('ConnectionLostScene',{ previousScene: 'GamaScene'});
    }

    update(time, delta) {
        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }
        this.escWasDown = this.escKey.isDown;

        this.lPulsada = false; //volver a poner a false si no ha habido overlap
        if (this.lkey.isDown || this.qkey.isDown) this.lPulsada = true;

        // Comprobar si alguno de los jugadores está saltando
        this.players.forEach(mago => {
            mago.update(delta);
        });

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

            // salto solo si esta pequeño
            if (mapping.jumpObj.isDown) {
                if (!mago.estado_normal) {
                    salto = true;
                    mago.andar_animacion_parar();
                }
            }
            if (isMoving && walkSound && !walkSound.isPlaying) {
                walkSound.play();
            }
            let moveCommand = new MoveMagoCommand(mago, direction, salto);
            this.processor.process(moveCommand);
        });

            //actualizar inventario en pantalla
            if(this.inventario[1]) this.uno.setAlpha(1); else this.uno.setAlpha(0.2); 
            if(this.inventario[2]) this.dos.setAlpha(1);else this.dos.setAlpha(0.2); 
            if(this.inventario[3]) this.tres.setAlpha(1); else this.tres.setAlpha(0.2); 
            if(this.inventario[4]) this.cuatro.setAlpha(1); else this.cuatro.setAlpha(0.2); 
            if(this.inventario[5]) this.cinco.setAlpha(1); else this.cinco.setAlpha(0.2); 
            if(this.inventario[6]) this.seis.setAlpha(1);else this.seis.setAlpha(0.2); 
            if(this.inventario[7]) this.siete.setAlpha(1);else this.siete.setAlpha(0.2); 
            if(this.inventario[8]) this.ocho.setAlpha(1);else this.ocho.setAlpha(0.2); 
            if(this.inventario[9]) this.nueve.setAlpha(1);else this.nueve.setAlpha(0.2); 
            if(this.inventario[10]) this.diez.setAlpha(1); else this.diez.setAlpha(0.2); 

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
        this.estanteria = this.physics.add.image(165, 300, 'estanteriaR');
        this.estanteria.setImmovable(true);
        this.estanteria.setScale(0.6);
        this.estanteria.body.allowGravity = false;
        this.bolaCristal = this.physics.add.image(185, 303, 'bolaCristalR');
        this.bolaCristal.setImmovable(true);
        this.bolaCristal.setScale(0.6);
        this.bolaCristal.body.allowGravity = false;
        this.caldero = this.physics.add.image(500, 430, 'calderoR');
        this.caldero.setImmovable(true);
        this.caldero.setScale(0.6);
        this.caldero.body.allowGravity = false;
        this.campoFuerza = this.physics.add.image(940, 310, 'campoFuerzaR');
        this.campoFuerza.setImmovable(true);
        this.campoFuerza.setScale(0.6);
        this.campoFuerza.body.allowGravity = false;
        this.cofre = this.physics.add.image(505, 283, 'cofreR');
        this.cofre.setImmovable(true);
        this.cofre.setScale(0.6);
        this.cofre.body.allowGravity = false;
        this.llave = this.physics.add.image(170, 160, 'llaveR');
        this.llave.setImmovable(true);
        this.llave.setScale(0.6);
        this.llave.body.allowGravity = false;
        this.pergamino = this.physics.add.image(780, 180, 'pergaminoR');
        this.pergamino.setImmovable(true);
        this.pergamino.setScale(0.6);
        this.pergamino.body.allowGravity = false;
        this.planta = this.physics.add.image(170, 365, 'plantaR');
        this.planta.setImmovable(true);
        this.planta.setScale(0.6);
        this.planta.body.allowGravity = false;
        this.pociones = this.physics.add.image(169, 262, 'pocionesR');
        this.pociones.setImmovable(true);
        this.pociones.setScale(0.6);
        this.pociones.body.allowGravity = false;
        this.velas = this.physics.add.image(140, 308, 'velasR');
        this.velas.setImmovable(true);
        this.velas.setScale(0.6);
        this.velas.body.allowGravity = false;
        this.libros = this.physics.add.image(150, 220, 'librosR');
        this.libros.setImmovable(true);
        this.libros.setScale(0.6);
        this.libros.body.allowGravity = false;
        this.boton1 = this.physics.add.image(50, 350, 'botonVR');
        this.boton1.setImmovable(true);
        this.boton1.setScale(0.6);
        this.boton1.body.allowGravity = false;
        this.boton2 = this.physics.add.image(780, 350, 'botonVR');
        this.boton2.setImmovable(true);
        this.boton2.setScale(0.6);
        this.boton2.body.allowGravity = false;

        // estrellas de dentro del cofre
        this.estrella1 = this.physics.add.image(450, 283, 'estrellaR');
        this.estrella1.setImmovable(true);
        this.estrella1.setScale(0.6);
        this.estrella1.setAlpha(0.0);
        this.estrella1.body.allowGravity = false;
        this.estrella2 = this.physics.add.image(560, 283, 'estrellaR');
        this.estrella2.setImmovable(true);
        this.estrella2.setScale(0.6);
        this.estrella2.setAlpha(0.0);
        this.estrella2.body.allowGravity = false;
    }

    crearBarreraInvisible() {
        // Crear una barrera invisible que evita que suba hacia arriba (pero pueda andar libremente por el suelo)
        this.barreraInvisible = this.physics.add.staticImage(500, 105, null);
        this.barreraInvisible.setSize(1000, 500); 
        this.barreraInvisible.setVisible(false);
        this.barreraInvisible.body.setSize(1000, 500);

        // Crear collider invisible para que pueda usar la balda superior de la estanterí­a como plataforma
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
        this.calderoColl.setCircle(85);
        this.calderoColl.body.setOffset(-70, -55);
    }

    crearPlataformas() {
        this.plataformas = this.physics.add.staticGroup();
        // Centro
        this.plataformas.create(446, 315, 'estanteR');
        this.plataformas.create(510, 315, 'estanteR');
        this.plataformas.create(570, 315, 'estanteR');

        // Izquierda
        this.plataformas.create(650, 350, 'estanteR');
        this.plataformas.create(650, 215, 'estanteR');
        this.plataformas.create(700, 390, 'estanteR');

        // Derecha
        this.plataformas.create(446, 250, 'estanteR');
        this.plataformas.create(360, 235, 'estanteR');
        this.plataformas.create(295, 215, 'estanteR');
        this.plataformas.create(300, 390, 'estanteR');
        this.plataformas.create(380, 350, 'estanteR');

    }

    establecerColisiones() {
        this.players.forEach(player => {
            // Colisiones del jugador con el escenario
            this.physics.add.collider(player.sprite, this.estanteriaColl);
            this.physics.add.collider(player.sprite, this.plataformas);
            this.physics.add.collider(player.sprite, this.calderoColl);
            //this.physics.add.collider(player.sprite, this.cofre);

            // Conseguir la llave
            this.physics.add.overlap(player.sprite, this.llave, () => {
                if (this.sound) {
                    this.sound.play('recogerLlave', { volume: 0.6 });
                }
                this.llave.destroy();
                console.log("Llave conseguida");
                this.inventario[0] = true; // marcar en el inventario que se ha conseguido la llave
                this.cero.setAlpha(1); 
            });

            let id; 
            if(player.playerId === 'player1') id = 1;
            else id = 2;

            // Abrir la librerí­a
            this.physics.add.overlap(player.sprite, this.estanteria, () => {
                if (this.lPulsada) {
                    this.scene.pause();
                    this.scene.launch('LibreriaScene', {
                        originalScene: 'GameScene',
                        pociones: this.inventario,
                        sound: this.sound,
                        jugador: id
                    });
                }
            });

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

            // Crear pocion de disminuir tamaño si se tienen las pociones necesarias
            this.physics.add.overlap(player.sprite, this.caldero, () => {
                if (Phaser.Input.Keyboard.JustDown(this.lkey) || Phaser.Input.Keyboard.JustDown(this.qkey)) { // Comprobar que se ha pulsado la tecla L o Q para crear la pocion (si se mantiene pulsada la tecla no entrará varias veces a la función)
                    let elemRecogidos = this.inventario.filter(elem => elem === true); // crear un segundo array con unicamente los elementos recogidos
                    if ((elemRecogidos.length === 3) || (elemRecogidos.lenght === 4)) { // primero comprobar que se han recogido 3 elementos
                        if (this.inventario[3] && this.inventario[5] && this.inventario[7]) { // comprobar que esos elementos recogidos son las pociones verde, azul y naranja 
                            console.log("Poción de disminuir tamaño creada");
                            this.calderoColl.disableBody(); // desactivar el collider del caldero para mientras estén pequeños puedan atravesarlo (causaba bugs: levitaba)
                            if (this.sound) {
                                this.sound.play('pequeño', { volume: 0.6 });
                            }
                            this.players.forEach(player => {
                                player.estado_normal = false;
                            });
                        }
                    } else {
                        console.log("No tienes las pociones necesarias para crear la poción de disminuir tamaño");
                        if (this.sound) {
                            this.sound.play('explosion', { volume: 0.5 });
                        }
                        let aleatorio = Phaser.Math.Between(1, 2); // generar un número aleatorio entre 1 y 2 para elegir que jugador recibe daño
                        if (aleatorio === 1) this.dañoJugLeft();
                        else this.dañoJugRight();
                    }

                    // volver a poner a false todos los elementos del inventario
                    for (let i = 1; i < this.inventario.length - 2; i++) { // se salta la llave y las estrellas porque no se utilizan para crear la pocion
                        this.inventario[i] = false;
                        //actualizar inventario en pantalla
                        switch(i) {
                            case 1: this.uno.setAlpha(0.2); break;
                            case 2: this.dos.setAlpha(0.2); break;
                            case 3: this.tres.setAlpha(0.2); break;
                            case 4: this.cuatro.setAlpha(0.2); break;  
                            case 5: this.cinco.setAlpha(0.2); break;
                            case 6: this.seis.setAlpha(0.2); break;
                            case 7: this.siete.setAlpha(0.2); break;
                            case 8: this.ocho.setAlpha(0.2); break;
                            case 9: this.nueve.setAlpha(0.2); break;
                            case 10: this.diez.setAlpha(0.2); break;
                        }
                    }
                }
            });

            // Abrir el cofre si se tiene la llave
            this.physics.add.overlap(player.sprite, this.cofre, () => {
                if (!this.cofreAbierto) {
                    if (this.inventario[0]) { // comprobar que tiene la llave
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
    // Los objetos son: 0-llave, 1-libros, 2- pocion morada, 3- pocion verde, 4- pocion rosa, 5- pocion azul, 6- pocion amarilla, 7- pocion naranja, 8- velas, 9- bola de cristal, 10- planta, 11- estrella 1, 12- estrella 2
    inventarioEnPantalla() { //Como se acaba de crear, todavía no se habrá recogido ningún elemento
        this.cero = this.add.image(200, 40, 'llaveR').setAlpha(0.4);
        this.uno = this.add.image(250, 40, 'librosR').setAlpha(0.4).setScale(0.5);
        this.dos = this.add.image(300, 40, 'pocionesM').setAlpha(0.4);
        this.tres = this.add.image(350, 40, 'pocionesV').setAlpha(0.4);
        this.cuatro = this.add.image(400, 40, 'pocionesRo').setAlpha(0.4);
        this.cinco = this.add.image(450, 40, 'pocionesAz').setAlpha(0.4);
        this.seis = this.add.image(500, 40, 'pocionesAm').setAlpha(0.4);
        this.siete = this.add.image(550, 40, 'pocionesN').setAlpha(0.4);
        this.ocho = this.add.image(600, 40, 'velasR').setAlpha(0.4).setScale(0.5);
        this.nueve = this.add.image(650, 40, 'bolaCristalR').setAlpha(0.4).setScale(0.5);
        this.diez = this.add.image(700, 40, 'plantaR').setAlpha(0.4).setScale(0.5);
        this.once = this.add.image(750, 40, 'estrellaR').setAlpha(0.4);
        this.doce = this.add.image(800, 40, 'estrellaR').setAlpha(0.4);
    }

    abrirCofre() {
        if (this.sound) {
            this.sound.play('abrirCofre', { volume: 0.5 });
            this.time.delayedCall(2000, () => {
                this.sound.stopByKey('abrirCofre');
            });
        }

        console.log("Cofre abierto");
        this.cofre.setTexture('cofreAbiertoR');
        this.estrella1.setAlpha(1.0);
        this.estrella2.setAlpha(1.0);
        this.cofreAbierto = true; // para que solo se abra una vez
        this.inventario[0] = false; // quitar la llave del inventario al abrir el cofre
        this.cero.setAlpha(0.2); // actualizar inventario en pantalla
    }

    recogerEstrella(n) {
        if (this.cofreAbierto) { // solo se puede recoger si el cofre está abierto (porque sino están ocultas)
            console.log("Estrella " + n + " recogida");
            this.inventario[10 + n] = true; // marcar en el inventario que se ha conseguido la estrella (11 y 12 en el array)
            if (n === 1) {
                this.estrella1.destroy();
                this.once.setAlpha(1.0); // actualizar inventario en pantalla
            } else{ 
                this.estrella2.destroy();
                this.doce.setAlpha(1.0); // actualizar inventario en pantalla
            }
            this.players.forEach(player => {
                this.time.delayedCall(4000, () => {
                    player.estado_normal = true;
                   // volver a activar el collider del caldero
                    this.calderoColl.enableBody(false, 0, 0, true, true);
                });
            });
        }


    }

    colocarEstrella(n) {
        if (this.inventario[10 + n]) { // comprobar que se tiene la estrella correspondiente
            console.log("Estrella " + n + " colocada");
            if (this.sound) {
                this.sound.play('trigger', { volume: 0.6 });
            }
            if (n === 1) {
                this.boton1.setTexture('botonCR');
                this.inventario[10 + n] = false; // quitar la estrella del inventario
                this.once.setAlpha(0.2); // actualizar inventario en pantalla
            } else {
                this.boton2.setTexture('botonCR');
                this.inventario[10 + n] = false; // quitar la estrella del inventario
                this.doce.setAlpha(0.2); // actualizar inventario en pantalla
            }
        }
    }

    abrirCampoFuerza() {
        if (this.boton1.texture.key === 'botonCR' && this.boton2.texture.key === 'botonCR') { //comprobar que ambos botones tienen la estrella colocada
            if (this.qkey.isDown && this.lkey.isDown && this.boton1Activado && this.boton2Activado) { // comprobar que ambos jugadores están pulsando su tecla correspondiente
                console.log("Campo de fuerza desactivado");
                if (this.sound) {
                    this.sound.play('puerta', { volume: 0.7 });
                }
                this.campoFuerza.destroy();
                this.crearPuertaFinal();
            }
        }
    }

    crearPuertaFinal() {
        this.puertaFinal = this.physics.add.image(940, 370, null);
        this.puertaFinal.setImmovable(true);
        this.puertaFinal.body.allowGravity = false; 
        this.puertaFinal.setAlpha(0.0); 
        let desactivado = [false, false]; // array para controlar que ambos jugadores han llegado a la puerta final
        this.physics.add.overlap(this.players.get('player1').sprite, this.puertaFinal, () => {
            this.players.get('player1').sprite.disableBody(true, true);
            desactivado[0] = true; // el personaje ya ha entrado por la puerta y ha desaparecido
            this.entrarPuertaFinal(desactivado);
            const ws1 = this.walkSounds.get('player1');
            if (ws1) {
                try { if (ws1.isPlaying) ws1.stop(); } catch(err){ console.warn(err); }
            }
        });
        this.physics.add.overlap(this.players.get('player2').sprite, this.puertaFinal, () => {
            this.players.get('player2').sprite.disableBody(true, true);
            desactivado[1] = true;
            this.entrarPuertaFinal(desactivado);
            const ws2 = this.walkSounds.get('player2');
            if (ws2) {
                try { if (ws2.isPlaying) ws2.stop(); } catch(err){ console.warn(err); }
            }
        });  
    }       

    entrarPuertaFinal(desactivado) {
        if (desactivado[0] && desactivado[1]) { //cambiar de escena solo si ambos jugadores han llegado a la puerta final
            // Parar y destruir sonidos de pasos
            this.walkSounds.forEach(ws => {
                try { if (ws && ws.isPlaying) ws.stop(); } catch(err){ console.warn(err); }
                try { if (ws) ws.destroy(); } catch(err){ console.warn(err); }
            });
            this.walkSounds.clear();
            // Parar BGM
            try { if (this.bgm && (this.bgm.isPlaying || this.bgm.isPaused)) this.bgm.stop(); } catch(err){ console.warn(err); }
            // Fallback: parar cualquier instancia por clave
            if (this.sound) this.sound.stopByKey('walk');
            if (this.sound) this.sound.stopByKey('bgm');
            this.scene.start('DecisionScene');
        }
    }
    
    setUpPlayers() {
        const leftMago = new Mago(this, 'player1', 50, 400, 'idle_Azul');
        const rightMago = new Mago(this, 'player2', 950, 400, 'idle_Rojo');

        this.players.set('player1', leftMago);
        this.players.set('player2', rightMago);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D',
                jump: 'SPACE'
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                jump: 'ENTER'
            }
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

    endGame(id) {
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);

        this.titulo = this.add.image(500, 240, 'titulo')
        this.titulo.setScale(0.25);
        this.boton = this.add.image(500, 450, 'boton')
        this.boton.setScale(0.1);

        this.players.forEach(mago => {
            mago.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        // Detener la mÃºsica de fondo
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.stop();
        }

        const texto = id === 'player1' ? 'El jugador 1\n  ha muerto' : ' El jugador 2\n  ha muerto';
        this.add.text(500, 250, texto, {
            fontSize: '64px',
            color: ' #ff0000ff',

        }).setOrigin(0.5);

        const menuBtn = this.add.text(500, 450, 'Menú', {
            fontSize: '30px',
            color: '#000000ff'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setStyle({ fill: '#02ff89ff' }))
            .on('pointerout', () => menuBtn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
    }

    dañoJugLeft() {
        const player1 = this.players.get('player1');
        player1.vida--;
        this.healthLeft.setText(player1.vida.toString());
        console.log('El jugador de la izquierda ha recibido daño');
        if (player1.vida <= 0) this.endGame('player1');
    }

    dañoJugRight() {
        const player2 = this.players.get('player2');
        player2.vida--;
        this.healthRight.setText(player2.vida.toString());
        console.log('El jugador de la derecha ha recibido daño');
        if (player2.vida <= 0) this.endGame('player2');
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
}