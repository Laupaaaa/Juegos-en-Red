import Phaser from 'phaser';

export class HistoriaScene extends Phaser.Scene {
    constructor() {
        super('HistoriaScene');
    }

    create() {
        this.add.text(500, 100, 'El Enigma de la\nTorre Encantada', {
            fontSize: '56px',
            color: '#ffffff'
        }).setOrigin(0.5);       
        
        this.add.text(500, 200, 'Historia', {
            fontSize: '50px',
            color: '#a7a7a7ff'
        }).setOrigin(0.5);

        this.add.text(500, 350, 'Después de años de entrenamiento, por fin ha llegado el momento en el que naquellos magos por\nfin iban a conseguir ser magos de verdad. Llevaban mucho tiempo preparándose y estudiando para\neste momento, y por fin van a recibir aquel elixir deseado por todo mago,\n“el elixir de la vida eterna”.\n\nSin embargo, no será sencillo, aún deberán demostrar por última vez que están hechos para obtener\nesta gran virtud. La tradición cuenta que para conseguir ser un verdadero mago será necesario\nconseguir por ellos mismos este elixir adentrándose en la Torre Encantada, demostrando que son\nmerecedores del título de mago eterno y que poseen las habilidades necesarias. La más importante,\nla colaboración, puesto que por uno solo no siempre se puede llegar al lugar deseado. \n\nPor este motivo, los jóvenes aprendices que deseen ascender, se adentrarán en aquella vieja torre,\n y atravesarán, una a una, sus salas hasta llegar arriba del todo, dónde se encuentra el elixir\nque tanto desean. En cada sala se encontrarán con numerosos obstáculos que deberán sobrepasar \ndemostrando sus habilidades obtenidas durante todos estos años de esfuerzo.', {
            fontSize: '16px',
            color: '#04ebebff',
        }).setOrigin(0.5)

        
        const ReturnBtn = this.add.text(500, 500, 'Volver', {
            fontSize: '34px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => ReturnBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => ReturnBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}