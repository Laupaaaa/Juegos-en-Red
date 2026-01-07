import Phaser from 'phaser';
import { loginUser } from '../api.js';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        this.load.image('fondoM', '/imagenes/logoSinFondo.png');
    }

    create() {
        
        this.fondo = this.add.image(500, 350, 'fondoM')
        this.fondo.setScale(0.8);
        // this.add.rectangle(500, 280, 1000, 560, 0x1a1a1a);

        const loginForm = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginButton = document.getElementById('loginButton');

        console.log('LoginScene iniciada');

        if (loginForm) {
            loginForm.classList.add('active');
        }

        if (loginButton) {
            loginButton.addEventListener('click', async () => {
                const username = usernameInput.value.trim();

                if (username === '') {
                    alert('Por favor ingresa un usuario');
                    return;
                }

                try {
                    // Login en el servidor
                    await loginUser(username);
                    console.log('Login exitoso:', username);
                    
                    // Guardar usuario en sessionStorage
                    sessionStorage.setItem('currentUsername', username);
                    
                    // Ocultar formulario y limpiar
                    if (loginForm) {
                        loginForm.classList.remove('active');
                    }
                    usernameInput.value = '';
                    passwordInput.value = '';

                    // Ir al menú
                    this.time.delayedCall(500, () => {
                        this.scene.start('MenuScene');
                    });
                } catch (error) {
                    console.error('Error en login:', error.message);
                    alert('Error: ' + error.message);
                }
            });
        }

        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginButton.click();
                }
            });
        }
    }
}