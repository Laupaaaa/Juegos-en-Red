import Phaser from 'phaser';
import { Mago } from '../entities/Mago'
import { CommandProcessor } from '../command/commandProcessor';
import { MoveMagoCommand } from '../command/MoveMagoCommand';

export class LibreriaScene extends Phaser.Scene {

    constructor() {
        super('LibreriaScene');
    }

    preload() {
        this.load.image('paredR', '/imagenes/paredYTecho.png');
        this.load.image('bolaCristalColor', '/imagenes/bolaCristalColor.png');
        this.load.image('estanteriaR', '/imagenes/estanteria.png');
        this.load.image('plantaColor', '/imagenes/plantaColor.png');
        this.load.image('pocionesAz', '/imagenes/pocionAzul.png');
        this.load.image('pocionesAm', '/imagenes/pocionesAmarillo.png');
        this.load.image('pocionesN', '/imagenes/pocionNaranja.png');
        this.load.image('pocionesRo', '/imagenes/pocionRosa.png');
        this.load.image('pocionesM', '/imagenes/pocionMorada.png');
        this.load.image('pocionesV', '/imagenes/pocionVerde.png');
        this.load.image('velasColor', '/imagenes/velasColor.png');
        this.load.image('librosColor', '/imagenes/librosColor.png');
        this.load.image('idle', '/imagenes/mano.png');
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.abrir = false;
        //this.isPaused = false;
        this.escWasDown = false;
        this.datos;
        this.processor = new CommandProcessor();

        this.pocionesRecogidas = {
            bolaCristal: false,
            planta: false,
            pocionAm: false,
            pocionN: false,
            pocionM: false,
            pocionR: false,
            pocionV: false,
            pocionAz: false,
            velas: false,
            libro: false
        };
    }


    create(data) {
        this.mago = this.add.image(100, 100, "idle");
        this.mago.setScale(1.9);
        this.crearEscenario();
        this.setUpPlayers();
        this.establecerColisiones();
        this.datos = data;
        

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.lkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.qkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (this.escKey.isDown && !this.escWasDown) {
            this.scene.resume(this.datos.originalScene, { pociones: this.datos.pociones });
            this.scene.stop();
            // this.scene.get(this.datos.originalScene).resume(); 
        }

        this.abir = false; //volver a poner a false si no ha habido overlap
        if (this.lkey.isDown) this.abrir = true;
        if (this.qkey.isDown) this.abrir = true;

        this.inputMappings.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            let direction = null;
            if (mapping.upKeyObj.isDown) {
                direction = 'up';
            } else if (mapping.downKeyObj.isDown) {
                direction = 'down';
            } else if (mapping.leftKeyObj.isDown) {
                direction = 'left';
            } else if (mapping.rightKeyObj.isDown) {
                direction = 'right';
            } else {
                direction = 'stop';
            }
            let moveCommand = new MoveMagoCommand(paddle, direction);
            this.processor.process(moveCommand);
        });
    }

    crearEscenario() {
        this.pared = this.physics.add.image(500, 205, 'paredR');
        this.pared.setImmovable(true);
        this.pared.setScale(1.7);
        this.pared.body.allowGravity = false;
        this.estanteria = this.physics.add.image(440, 270, 'estanteriaR');
        this.estanteria.setImmovable(true);
        this.estanteria.setScale(1.7);
        this.estanteria.body.allowGravity = false;
        this.bolaCristal = this.physics.add.image(485, 280, 'bolaCristalColor');
        this.bolaCristal.setImmovable(true);
        this.bolaCristal.setScale(1.7);
        this.bolaCristal.body.allowGravity = false;
        this.planta = this.physics.add.image(440, 450, 'plantaColor');
        this.planta.setImmovable(true);
        this.planta.setScale(1.7);
        this.planta.body.allowGravity = false;
        this.pocionAm = this.physics.add.image(530, 165, 'pocionesAm');
        this.pocionAm.setImmovable(true);
        this.pocionAm.setScale(1.7);
        this.pocionAm.body.allowGravity = false;
        this.pocionN = this.physics.add.image(595, 175, 'pocionesN');
        this.pocionN.setImmovable(true);
        this.pocionN.setScale(1.7);
        this.pocionN.body.allowGravity = false;
        this.pocionM = this.physics.add.image(280, 165, 'pocionesM');
        this.pocionM.setImmovable(true);
        this.pocionM.setScale(1.7);
        this.pocionM.body.allowGravity = false;
        this.pocionR = this.physics.add.image(405, 165, 'pocionesRo');
        this.pocionR.setImmovable(true);
        this.pocionR.setScale(1.7);
        this.pocionR.body.allowGravity = false;
        this.pocionV = this.physics.add.image(345, 175, 'pocionesV');
        this.pocionV.setImmovable(true);
        this.pocionV.setScale(1.7);
        this.pocionV.body.allowGravity = false;
        this.pocionAz = this.physics.add.image(470, 170, 'pocionesAz');
        this.pocionAz.setImmovable(true);
        this.pocionAz.setScale(1.7);
        this.pocionAz.body.allowGravity = false;
        this.velas = this.physics.add.image(350, 290, 'velasColor');
        this.velas.setImmovable(true);
        this.velas.setScale(1.7);
        this.velas.body.allowGravity = false;
        this.libro = this.physics.add.image(370, 33, 'librosColor');
        this.libro.setImmovable(true);
        this.libro.setScale(1.7);
        this.libro.body.allowGravity = false;
    }

    establecerColisiones() {
        this.players.forEach(player => {
            this.physics.add.overlap(player.sprite, this.bolaCristal, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.bolaCristal) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.bolaCristal = true;
                    }
                    this.bolaCristal.setAlpha(0.5);
                    this.datos.pociones[9] = true; // marcar que se ha recogido la bola de cristal
                    this.abrir = false;
                    console.log("BOLA CRISTAL RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.planta, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.planta) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.planta = true;
                    }
                    this.planta.setAlpha(0.5);
                    this.datos.pociones[10] = true; // marcar que se ha recogido la planta
                    this.abrir = false;
                    console.log("PLANTA RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionAm, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionAm) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionAm = true;
                    }
                    this.pocionAm.setAlpha(0.5);
                    this.datos.pociones[6] = true; // marcar que se ha recogido la pocion amarilla
                    this.abrir = false;
                    console.log("POCION AMARILLA RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionN, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionN) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionN = true;
                    }
                    this.pocionN.setAlpha(0.5);
                    this.datos.pociones[7] = true; // marcar que se ha recogido la pocion naranja
                    this.abrir = false;
                    console.log("POCION NARANJA RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionM, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionM) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionM = true;
                    }
                    this.pocionM.setAlpha(0.5);
                    this.datos.pociones[2] = true; // marcar que se ha recogido la pocion morada
                    this.abrir = false;
                    console.log("POCION MORADA RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionR, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionR) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionR = true;
                    }
                    this.pocionR.setAlpha(0.5);
                    this.datos.pociones[4] = true; // marcar que se ha recogido la pocion rosa
                    this.abrir = false;
                    console.log("POCION ROSA RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionV, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionV) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionV = true;
                    }
                    this.pocionV.setAlpha(0.5);
                    this.datos.pociones[3] = true; // marcar que se ha recogido la pocion verde
                    this.abrir = false;
                    console.log("POCION VERDE RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.pocionAz, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.pocionAz) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.pocionAz = true;
                    }
                    this.pocionAz.setAlpha(0.5);
                    this.datos.pociones[5] = true; // marcar que se ha recogido la pocion azul
                    this.abrir = false;
                    console.log("POCION AZUL RECOGIDA");
                }
            });
            this.physics.add.overlap(player.sprite, this.velas, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.velas) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.velas = true;
                    }
                    this.velas.setAlpha(0.5);
                    this.datos.pociones[8] = true; // marcar que se ha recogido las velas
                    this.abrir = false;
                    console.log("VELAS RECOGIDAS");
                }
            });
            this.physics.add.overlap(player.sprite, this.libro, () => {
                if (this.abrir) {
                    if (this.datos.sound && !this.pocionesRecogidas.libro) {
                        this.datos.sound.play('recogerPocion', { volume: 0.6 });
                        this.pocionesRecogidas.libro = true;
                    }
                    this.libro.setAlpha(0.5);
                    this.datos.pociones[1] = true; // marcar que se ha recogido los libros
                    this.abrir = false;
                    console.log("LIBROS RECOGIDOS");
                }
            });
        });
    }

    setUpPlayers() {

        const leftMago = new Mago(this, 'player1', 50, 300, 'idle');
        leftMago.setScale(0.08);
        
        this.players.set('player1', leftMago);
        
        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT'
            }
        ]

        //this.intputMappings = InputConfig; 
        this.inputMappings = InputConfig.map(config => {
            console.log(config);
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });
    }
}