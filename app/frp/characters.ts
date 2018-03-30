import { Cell, CellLoop, Operational, Stream, Unit } from "sodiumjs";
import Character from "../Character";
import HomoSapiens from "../HomoSapiens";
import HomoZombicus from "../HomoZombicus";
import lib from "../lib";
import { IPoint, ISize } from "../types";
import World from "../World";
import tick from "./tick";

// worlds with zombies and humans, but no bites :D
export default (windowSize: ISize, characterSize: ISize, world: World) => {
    const { cTime, sTick, fps } = tick();
    const charStreams: Array<Stream<Character>> = [];
    const charCells: Array<Cell<Character>> = [];
    const cScene = new CellLoop<Character[]>();
    let id = 0;

    for (let x = 100; x < world.windowSize.width; x += 200) {
        for (let y = 100; y < world.windowSize.height; y += 200) {
            const pos = { x, y } as IPoint;
            if (world.hitsObstacle(pos)) {
                break;
            }
            if (id % 7) {
                const h = new HomoSapiens(world, id, pos,
                    cTime, sTick, Math.ceil(1000 / fps) / 1000);
                charCells.push(h.cCharacter);
                charStreams.push(Operational.updates(h.cCharacter));
            } else {
                const z = new HomoZombicus(id, pos,
                    cTime, sTick, cScene);
                charCells.push(z.cCharacter);
                charStreams.push(Operational.updates(z.cCharacter));
            }
            id++;
        }
    }
    cScene.loop(lib.sequence(charCells));

    return lib.balanceMerge(charStreams, (a, b) => a.concat(b)) as Stream<Character[]>;
};
