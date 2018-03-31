import { Cell, CellLoop, Operational, Stream, StreamLoop, Unit } from "sodiumjs";
import BitableHomosapiens from "../BitableHomosapiens";
import Character from "../Character";
import HomoZombicus from "../HomoZombicus";
import lib from "../lib";
import { IPoint, ISize } from "../types";
import World from "../World";
import tick from "./tick";

// doomed world :(
export default (windowSize: ISize, characterSize: ISize, world: World) => {
    const { cTime, sTick, fps } = tick();
    const charStreams: Array<Stream<Character>> = [];
    const charCells: Array<Cell<Character>> = [];
    const cScene = new CellLoop<Character[]>();
    const sBite = new StreamLoop<number[]>();
    const biteStreams: Array<Stream<number>> = [];
    let id = 0;

    for (let x = 100; x < world.windowSize.width; x += 200) {
        for (let y = 100; y < world.windowSize.height; y += 200) {
            const pos = { x, y } as IPoint;
            if (world.hitsObstacle(pos)) {
                break;
            }
            if (id % 4) {
                const h = new BitableHomosapiens(world, id, pos,
                    cTime, sTick, sBite, cScene, Math.ceil(1000 / fps) / 1000);
                charCells.push(h.cCharacter);
                biteStreams.push(h.sBite);
                charStreams.push(Operational.updates(h.cCharacter));
            } else {
                const z = new HomoZombicus(id, pos,
                    cTime, sTick, cScene, Math.ceil(1000 / fps) / 1000, world);
                charCells.push(z.cCharacter);
                biteStreams.push(z.sBite);
                charStreams.push(Operational.updates(z.cCharacter));
            }
            id++;
        }
    }

    cScene.loop(lib.sequence(charCells));
    sBite.loop(lib.balanceMerge(biteStreams, (a, b) => a.concat(b)));

    return lib.balanceMerge(charStreams, (a, b) => a.concat(b)) as Stream<Character[]>;
};
