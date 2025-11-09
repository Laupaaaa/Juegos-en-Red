export class Paddle{
    constructor(scene, id, x, y){
        this.id = id;
        this.scene = scene;
        this.score = 0; 

        this.baseWidht = 20;
        this.baseHeight = 100;
        this.baseSpeed = 300;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(0, 0, this.baseWidht, this.baseHeight);
        graphics.generateTexture(`paddle-${id}`, this.baseWidht, this.baseHeight);
        graphics.destroy();

        this.sprite = this.scene.physics.add.sprite(x, y, `paddle-${id}`);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false; 
    }
}