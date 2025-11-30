import Phaser from 'phaser';

export class FinalM2Scene extends Phaser.Scene {
        constructor() {
            super('FinalM2Scene');
        }
    
        create(){
    
            this.add.text(500, 50, 'El jugador 2 ha decidido', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 100, 'no compartir el Elixir de la Vida Eterna,', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 150, 'ahora debe enfrentar las consecuencias', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 200, ' de su elección y vivir solo', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        this.add.text(500, 250, 'hasta la eternidad...', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5);

        const btn = this.add.text(500, 500, 'Volver al menú principal', {
            fontSize: '16px',
            color: '#ffffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn.setStyle({ fill: '#ffffffff' }))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            })

        }
}