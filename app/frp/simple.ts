import {Operational, Stream} from "sodiumjs";
import Character from "../Character";
import lib from "../lib";
import SimpleHomoSapiens from "../SimpleHomoSapiens";
import {IPoint} from "../types";
import tick from "./tick";

// does nothing but generate humans to touring around the scene, no zombies :D
export default (windowSize, characterSize) => {
    const {cTime, sTick} = tick();
    const chars: Array<Stream<Character>> = [];
    let id = 0;

    for (let x = 100; x < windowSize.width; x += 100) {
        for (let y = 100; y < windowSize.height; y += 100) {
            const pos = {x, y} as IPoint;
            const h = new SimpleHomoSapiens(id, windowSize, characterSize, pos, cTime, sTick);
            chars.push(Operational.updates(h.character));
            id++;
        }
    }

    return lib.balanceMerge(chars, (a, b) => a.concat(b)) as Stream<Character[]>;
};
