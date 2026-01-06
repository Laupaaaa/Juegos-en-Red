import Phaser from 'phaser';
import { getUserGameStats } from '../api.js';

export class StatsScene extends Phaser.Scene {
    constructor() {
        super('StatsScene');
    }

    preload() {
        this.load.image('boton', '/imagenes/botonTexto.png');
    }

    create(data) {
        const username = data?.username || 'Jugador';
        const mode = data?.mode || 'local';
        const lastGameDuration = data?.duration || 0;

        // Fondo
        this.add.rectangle(500, 280, 1000, 560, 0x1a1a2e).setDepth(-1);

        // Título
        this.add.text(500, 100, 'TIEMPO DE PARTIDA', {
            fontSize: '32px',
            fontFamily: 'Tagesschrift',
            color: '#4bffabff',
        }).setOrigin(0.5);

        // Última partida
        const lastGameSeconds = (lastGameDuration / 1000).toFixed(2);
        this.add.text(500, 200, `Esta partida: ${lastGameSeconds}s`, {
            fontSize: '24px',
            fontFamily: 'Tagesschrift',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Cargar promedio
        getUserGameStats(username, mode)
            .then(stats => {
                const avgSeconds = typeof stats.tiempoPromedio === 'string'
                    ? stats.tiempoPromedio
                    : (stats.tiempoPromedio / 1000).toFixed(2) + 's';
                
                this.add.text(500, 280, `Promedio: ${avgSeconds}`, {
                    fontSize: '24px',
                    fontFamily: 'Tagesschrift',
                    color: '#4bffabff',
                    fontStyle: 'bold',
                }).setOrigin(0.5);

                this.add.text(500, 330, `Partidas jugadas: ${stats.totalPartidas}`, {
                    fontSize: '18px',
                    fontFamily: 'Tagesschrift',
                    color: '#ffffff',
                }).setOrigin(0.5);
            })
            .catch(error => console.warn('Error al cargar tiempo promedio:', error));

        // Botón volver al menú
        const btn = this.add.text(500, 450, 'Volver al menú', {
            fontSize: '20px',
            fontFamily: 'Tagesschrift',
            color: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btn.setStyle({ fill: '#4bffabff' });
            })
            .on('pointerout', () => btn.setStyle({ fill: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
    }
}

