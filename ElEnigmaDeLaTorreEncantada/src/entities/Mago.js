export class Mago{
    constructor(scene, id, x, y, idSprite){
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

        this.sprite = this.scene.physics.add.sprite(x, y, idSprite);
        this.sprite.setScale(0.40);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false; 

        
    }

    andar_animacion(){
        if(!this.sprite.anims.isPlaying){
            this.sprite.play("andar_mago");
        }
    }

    andar_animacion_parar(idSprite){
        if(this.sprite.anims.isPlaying){
            this.sprite.anims.stop();
            this.sprite.setTexture(idSprite);
        }
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