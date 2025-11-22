export class Paddle{
    constructor(scene, id, x, y){
        this.id = id;
        this.scene = scene;
        this.vida = 3; 

        this.baseWidht = 20;
        this.baseHeight = 100;
        this.baseSpeed = 300;

        // Salto
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.groundY = y;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(0, 0, this.baseWidht, this.baseHeight);
        graphics.generateTexture(`paddle-${id}`, this.baseWidht, this.baseHeight);
        graphics.destroy();

        this.sprite = this.scene.physics.add.sprite(x, y, `paddle-${id}`);
        //this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false; 
    }

    jump() {
        if (!this.isJumping ) {
            this.isJumping = true;
            this.groundY = this.sprite.y; // establecer la altura a la que tiene que volver como la actual 
            this.sprite.setVelocityY(-100000); // Velocidad inicial de salto
            this.sprite.body.allowGravity = true; // activar gravedad en los saltos
        }
    }

    update(delta) {
        if (this.isJumping ) {
            // Check if landed (back to ground level or below)
            if (this.sprite.y >= this.groundY && this.sprite.body.velocity.y >= 0) { // Comprobar si tiene que volver a area de suelo
                this.sprite.y = this.groundY; // ir a la posición en la que comenzó 
                this.sprite.setVelocityY(0);
                this.sprite.body.allowGravity = false; // desactivar gravedad 
                this.isJumping = false; // ya no está saltando
            }

        }
    }
}