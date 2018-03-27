import Vector from "vectory";
import lib from "./lib";
import {IPoint, IWindowSize} from "./types";

class Trajectory {
    public t0;
    public orig;
    public period;
    public velocity;
    private boundary;

    constructor(t0: number, orig: IPoint, boundary: IWindowSize, speed: number) {
        const angle = Math.random() * Math.PI * 2;
        this.boundary = boundary;
        this.t0 = t0;
        this.orig = orig;
        this.period = Math.random() + 0.5;
        this.velocity = new Vector(Math.sin(angle), Math.cos(angle))
            .mul(speed);
    }

    public positionAt(t) {
        const idealPos = lib.v2p(this.orig, this.velocity.mul(t - this.t0));
        return {
            x: idealPos.x <= 0 ? 0 : (idealPos.x >= this.boundary.width ? this.boundary.width : idealPos.x),
            y: idealPos.y <= 0 ? 0 : (idealPos.y >= this.boundary.height ? this.boundary.height : idealPos.y),
        };
    }
}

export default Trajectory;
