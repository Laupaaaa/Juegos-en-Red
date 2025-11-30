import Phaser from 'phaser';

export class FinalM1Scene extends Phaser.Scene {
        constructor() {
            super('FinalM1Scene');
        }

        preload() {
            this.load.image('fondo_1M', '/imagenes/traicion_ranaRoja.png');
        }
    
        create(){

            this.fondo_1M = this.physics.add.image(500,300, 'fondo_1M');
            this.fondo_1M.setImmovable(true);
            this.fondo_1M.body.allowGravity = false;
    
            this.add.text(500, 50, 'El jugador 1 ha decidido', {
                fontSize: '32px',
                color: '#ffffffff',
            }).setOrigin(0.5);

            this.add.text(500, 100, 'no compartir el Elixir de la Vida Eterna,', {
                fontSize: '32px',
                color: '#ffffffff',
            }).setOrigin(0.5);

            this.add.text(500, 150, 'ahora debe enfrentar las consecuencias de su elección y vivir solo', {
                fontSize: '16px',
                color: '#ffffffff',
            }).setOrigin(0.5);

            // this.add.text(500, 200, ' de su elección y vivir solo', {
            //     fontSize: '16px',
            //     color: '#ffffffff',
            // }).setOrigin(0.5);

            this.add.text(500, 175, 'hasta la eternidad...', {
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