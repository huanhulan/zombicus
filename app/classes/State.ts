import Vector from "vectory";
import { attackRange } from "../constants";
import lib from "../lib";
import { CharacterType, IPoint, Optional } from "../types/index";
import Character from "./Character";
import World from "./World";

class State {
    public t0: number;
    public orig: IPoint;
    public velocity: Vector;

    constructor(
        t0: number,
        orig: IPoint,
        self: number,
        scene: Character[],
        speed: number,
        world, step,
    ) {
        this.t0 = t0;
        this.orig = orig;
        const other: Optional<Character> = this.nearest(self, scene);

        if (other !== null) {
            this.velocity = Vector.sub(lib.p2v(this.orig), lib.p2v(other.pos))
                .normalize()
                .mul(other.type === CharacterType.SAPIENS ? speed : -speed);

            if (world.hitsBoundary(this.positionAt(t0 + step * 2))) {
                this.velocity = this.velocity.mul(-1);
            }
        } else {
            this.velocity = new Vector(0, 0);
        }
    }

    /**
     * @param self
     * @param scene
     * @returns {Optional<Character>}
     * Eat the nearest human or go to the zombie within 60 pixels;
     */
    public nearest(self: number, scene: Character[], bestDist = attackRange) {
        let best: Optional<Character> = null;

        scene.filter(ch => ch.id !== self).forEach(ch => {
            const dist = Vector.distance(lib.p2v(ch.pos), lib.p2v(this.orig));
            if (ch.type === CharacterType.ZOMBICUS && dist > 60) {
                return;
            } else if (best === null || dist < bestDist) {
                bestDist = dist;
                best = ch;
            }
        });

        return best as Optional<Character>;
    }

    public nearestSapiens(self: number, scene: Character[]) {
        const sapiens = scene.filter(ch => ch.type === CharacterType.SAPIENS);
        return this.nearest(self, sapiens);
    }

    public positionAt(t: number) {
        const { x, y } = lib.v2p(this.orig, this.velocity.mul(t - this.t0));
        return {
            x,
            y,
        };
    }
}

export default State;
