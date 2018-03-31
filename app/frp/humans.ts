import { Operational, Stream } from "sodiumjs";
import Character from "../classes/Character";
import HomoSapiens from "../classes/HomoSapiens";
import World from "../classes/World";
import lib from "../lib";
import { IPoint, ISize } from "../types";
import tick from "./tick";

// humans that can detect obstacles, no zombies :D
export default (windowSize: ISize, characterSize: ISize, world: World) => {
    const { cTime, sTick, fps } = tick();
    const chars: Array<Stream<Character>> = [];
    let id = 0;

    for (let x = 100; x < windowSize.width; x += 100) {
        for (let y = 100; y < windowSize.height; y += 100) {
            const pos = { x, y } as IPoint;
            if (world.hitsObstacle(pos)) {
                break;
            }
            // step's unit is Second
            const h = new HomoSapiens(world, id, pos, cTime, sTick, Math.ceil(1000 / fps) / 1000);
            chars.push(Operational.updates(h.cCharacter));
            id++;
        }
    }

    return lib.balanceMerge(chars, (a, b) => a.concat(b)) as Stream<Character[]>;
};
