import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene{
    constructor(){
        super('PauseScene');
    }

    create(data){
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);
        this.add.text(500, 200, 'Juego Pausado', {
            fontSize: '74px', 
            color:'#ffffff'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(500, 300, 'Volver', {
            fontSize: '32px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => resumeBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => resumeBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume(); 
        });

        const menuBtn = this.add.text(500, 350, 'Menú', {
            fontSize: '32px',
            color: '#c300ffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setStyle({ fill: '#c29dffff' }))
        .on('pointerout', () => menuBtn.setStyle({ fill: '#c300ffff' }))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
            this.scene.stop(data.originalScene);
        });
    }
}