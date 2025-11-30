import Phaser from 'phaser';

export class DecisionScene extends Phaser.Scene {
    constructor() {
        super('DecisionScene');
    }

    create(){
        let aleatorio = Phaser.Math.Between(1, 2);
        if (aleatorio === 1){
            this.add.text(500, 50, 'El jugador 1 ha recogido', {
        fontSize: '32px',
        color: '#ffffffff',
    }).setOrigin(0.5);
        }
        else if (aleatorio === 2){
        this.add.text(500, 50, 'El jugador 2 ha recogido', {
        fontSize: '32px',
        color: '#ffffffff',
    }).setOrigin(0.5);
}

    this.add.text(500, 100, 'el Elixir de la Vida Eterna,', {
        fontSize: '32px',
        color: '#ffffffff',
    }).setOrigin(0.5);

    this.add.text(500, 150, 'ahora deberá elegir:', {
        fontSize: '32px',
        color: '#ffffffff',
    }).setOrigin(0.5);

        const btn1 = this.add.text(280, 300, 'Compartir el elixir', {
            fontSize: '24px',
            color: '#ffffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn1.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn1.setStyle({ fill: '#ffffffff' }))
            .on('pointerdown', () => {
                this.scene.start('FinalBScene');
            });

        const btn2 = this.add.text(730, 300, 'Beber el elixir', {
            fontSize: '24px',
            color: '#ffffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn2.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn2.setStyle({ fill: '#ffffffff' }))
            .on('pointerdown', () => {
                if (aleatorio === 1){
                    this.scene.start('FinalM1Scene');
                }
                else if (aleatorio === 2){
                    this.scene.start('FinalM2Scene');
                }
            });
    }
    
}

