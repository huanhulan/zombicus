import Vector from "vectory";
import lib from "../lib";
import { IPoint } from "../types";
import World from "./World";

class Trajectory {
    public t0;
    public orig;
    public period;
    public velocity;

    constructor(t0: number, orig: IPoint, speed: number, step: number, world: World) {
        this.t0 = t0;
        this.orig = orig;
        this.period = Math.random() + 0.5;
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.velocity = new Vector(Math.sin(angle), Math.cos(angle))
                .mul(speed);

            // if the point will fall into the obstacle within 12 frames...
            if (!world.hitsObstacle(this.positionAt(t0 + step * 12))) {
                break;
            }
        }

    }

    public positionAt(t) {
        const { x, y } = lib.v2p(this.orig, this.velocity.mul(t - this.t0));
        return {
            x,
            y,
        };
    }
}

export default Trajectory;
