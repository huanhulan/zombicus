import Vector from "vectory";
import {CharacterType, IPoint} from "./types";

class Character {
    public id: number;
    public type: CharacterType;
    public pos: IPoint;
    public velocity: Vector;
    public leftPic: HTMLImageElement;
    public rightPic: HTMLImageElement;

    constructor(id, type, pos, velocity) {
        this.id = id;
        this.type = type;
        this.pos = pos;
        this.velocity = velocity;
    }
}

export default Character;
