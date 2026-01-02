import Phaser from 'phaser';

export class HistoriaScene extends Phaser.Scene {
    constructor() {
        super('HistoriaScene');
    }
    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png');
        this.load.image('boton', '/imagenes/botonTexto.png');
    }

    create() {
        this.titulo = this.add.image(500,120, 'titulo')
        this.titulo.setScale(0.25);
        this.boton1 = this.add.image(500,530, 'boton')
        this.boton1.setScale(0.1);
        this.add.text(500, 120, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            fontFamily: 'Tagesschrift',
            color: '#070707ff'
        }).setOrigin(0.5)
        .setAngle(-8);

        this.add.text(500, 240, 'Historia', {
            fontSize: '50px',
             fontFamily: 'Tagesschrift',
           color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(500, 380, 'Después de años de entrenamiento, por fin ha llegado el momento en el que naquellos magos por\nfin iban a conseguir ser magos de verdad. Llevaban mucho tiempo preparándose y estudiando para\neste momento, y por fin van a recibir aquel elixir deseado por todo mago,\n“el elixir de la vida eterna”.\n\nSin embargo, no será sencillo, aún deberán demostrar por última vez que están hechos para obtener\nesta gran virtud. La tradición cuenta que para conseguir ser un verdadero mago será necesario\nconseguir por ellos mismos este elixir adentrándose en la Torre Encantada, demostrando que son\nmerecedores del título de mago eterno y que poseen las habilidades necesarias. La más importante,\nla colaboración, puesto que por uno solo no siempre se puede llegar al lugar deseado. \n\nPor este motivo, los jóvenes aprendices que deseen ascender, se adentrarán en aquella vieja torre,\n y atravesarán, una a una, sus salas hasta llegar arriba del todo, dónde se encuentra el elixir\nque tanto desean. En cada sala se encontrarán con numerosos obstáculos que deberán sobrepasar \ndemostrando sus habilidades obtenidas durante todos estos años de esfuerzo.', {
            fontSize: '16px',
            //fontFamily: 'Tagesschrift',
            color: '#ffffffff',
        }).setOrigin(0.5)


        const ReturnBtn = this.add.text(500, 530, 'Volver', {
            fontSize: '34px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#00ff88ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#000000ff' }))
        .on('pointerdown', () => {
            try { if (this.sound) this.sound.stopByKey('musicaMenu'); } catch(err){ console.warn(err); }
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}