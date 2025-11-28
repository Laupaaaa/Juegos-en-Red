import { Command } from "./Command";

export class MoveMagoCommand extends Command {
    constructor(mago, direction, salto){
        super();
        this.mago = mago;
        this.direction = direction; 
        this.salto = salto; 
    }

    execute(){
        if(this.direction === 'up'){
            this.mago.sprite.setVelocityY(-this.mago.baseSpeed);
        } else if(this.direction === 'down'){
            this.mago.sprite.setVelocityY(+this.mago.baseSpeed);
        } else if(this.direction === 'left'){
            this.mago.sprite.setVelocityX(-this.mago.baseSpeed);
        } else if(this.direction === 'right'){
            this.mago.sprite.setVelocityX(+this.mago.baseSpeed);
        }else{
            this.mago.sprite.setVelocityY(0); 
            this.mago.sprite.setVelocityX(0); 
        }
        if(this.salto){
            this.mago.sprite.setVelocityY(-this.mago.baseSpeed*9 );
        }
    }
}