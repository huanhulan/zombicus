import Vector from "vectory";
import lib from "../lib";
import { IPoint } from "../types";

class SimpleTrajectory {
    public t0;
    public orig;
    public period;
    public velocity;

    constructor(t0: number, orig: IPoint, speed: number) {
        const angle = Math.random() * Math.PI * 2;
        this.t0 = t0;
        this.orig = orig;
        this.period = Math.random() + 0.5;
        this.velocity = new Vector(Math.sin(angle), Math.cos(angle))
            .mul(speed);
    }

    public positionAt(t) {
        const { x, y } = lib.v2p(this.orig, this.velocity.mul(t - this.t0));
        return {
            x,
            y,
        };
    }
}

export default SimpleTrajectory;
