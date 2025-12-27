import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

/**
 * Escena que se muestra cuando se pierde la conexión con el servidor
 * Pausa el resto de escenas y comprueba continuamente hasta que se restablezca
 */
export class ConnectionLostScene extends Phaser.Scene {
    constructor() {
        super('ConnectionLostScene');
        this.reconnectCheckInterval = null;
    }

    preload(){
        this.load.image('titulo', '/imagenes/pergaminoTitulo.png'); 
    }  

     

    init(data) {
        // Guardar la escena que estaba activa cuando se perdió la conexión
        this.previousScene = data.previousScene;
    }

    create() {
        // Fondo semi-transparente        
        this.add.rectangle(500, 280, 1000, 560, 0x000000, 0.7);

        this.titulo = this.add.image(500,180, 'titulo')
        this.titulo.setScale(0.25);



        // Título
        this.add.text(500, 180, 'CONEXIÓN PERDIDA', {
            fontSize: '48px',
            color: '#c90000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mensaje
        this.statusText = this.add.text(500, 320, 'Intentando reconectar...', {
            fontSize: '24px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        // Contador de intentos
        this.attemptCount = 0;
        this.attemptText = this.add.text(500, 390, 'Intentos: 0', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Indicador parpadeante
        this.dotCount = 0;
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.dotCount = (this.dotCount + 1) % 4;
                const dots = '.'.repeat(this.dotCount);
                this.statusText.setText(`Intentando reconectar${dots}`);
            },
            loop: true
        });

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            if (data.connected) {
                this.onReconnected();
            }
        };
        connectionManager.addListener(this.connectionListener);

        // Intentar reconectar cada 2 segundos
        this.reconnectCheckInterval = setInterval(() => {
            this.attemptReconnect();
        }, 2000);

        // Primer intento inmediato
        this.attemptReconnect();
    }

    async attemptReconnect() {
        this.attemptCount++;
        this.attemptText.setText(`Intentos: ${this.attemptCount}`);
        await connectionManager.checkConnection();
    }

    onReconnected() {
        // Limpiar interval
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }

        // Remover listener
        connectionManager.removeListener(this.connectionListener);

        // Mensaje de éxito
        this.statusText.setText('¡Conexión restablecida!');
        this.statusText.setColor('#00ff00');

        // Volver a la escena anterior
        this.time.delayedCall(1000, () => {
            this.scene.stop();
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }
        });
    }

    shutdown() {
        // Limpiar el interval al cerrar la escena
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}
