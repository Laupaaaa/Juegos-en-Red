import Phaser from 'phaser';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
    }

    create() {
        this.add.rectangle(500, 280, 1000, 560, 0x1a1a1a);

        const loginForm = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginButton = document.getElementById('loginButton');

        console.log('LoginScene iniciada');

        if (loginForm) {
            loginForm.classList.add('active');
        }

        if (loginButton) {
            loginButton.addEventListener('click', () => {
                console.log('Click en login');
                const username = usernameInput.value;
                const password = passwordInput.value;

                console.log('Username:', username, 'Password:', password);

                if (username !== '' && password !== '') {
                    console.log('Login exitoso, iniciando MenuScene');
                    
                    // Ocultar el formulario
                    if (loginForm) {
                        loginForm.classList.remove('active');
                    }

                    this.time.delayedCall(500, () => {
                        this.scene.start('MenuScene');
                    });
                } else {
                    console.log('Campos vacíos');
                    alert('Por favor completa todos los campos');
                }
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginButton.click();
                }
            });
        }
    }
}