import {Cell, lambda1, lambda2, Stream, Unit} from "sodiumjs";
import {humanSpeed, zombieSpeed} from "../constants";
import {IPoint} from "../types";
import Character from "./Character";
import HomoSapiens from "./HomoSapiens";
import HomoZombicus from "./HomoZombicus";
import World from "./World";

class BietableHomoSapiens {
    public cCharacter: Cell<Character>;
    public sBite: Stream<number>;

    constructor(world: World,
                self: number,
                posInit: IPoint,
                cTime: Cell<number>,
                sTick: Stream<Unit>,
                sBite: Stream<number[]>,
                cScene: Cell<Character[]>,
                step: number,
                hSpeed = humanSpeed,
                zSpeed = zombieSpeed) {
        const h = new HomoSapiens(world, self, posInit, cTime, sTick, step, hSpeed);

        // Filters out a bite event if it isn’t for this character, and only fires once.
        const sBiteMe = sBite.filter(lambda1(ids => ids.findIndex(id => id === self) !== -1,
            [sTick, cScene, cTime])).once();

        // Stream containing the new zombie
        const sBecome = sBiteMe.snapshot(h.cCharacter, lambda2((id, ch) =>
            new HomoZombicus(
                self,
                ch.pos, // Zombie starts at human’s current position
                cTime,
                sTick,
                cScene,
                step,
                world,
                zSpeed,
            ), [cTime, cScene, sTick]),
        );

        // Starts as HomoSapiens, and then turns into the character from sBecome
        this.cCharacter = Cell.switchC(
            sBecome.map(lambda1(z => z.cCharacter, [cTime, cScene, sTick])).hold(h.cCharacter),
        );

        // Starts as a never, because humans don’t bite, and then turns into the bite from sBecome
        this.sBite = Cell.switchS(
            sBecome.map(lambda1(z => z.sBite, [cTime, cScene, sTick])).hold(new Stream<number>()),
        );

        sBiteMe.listen(i => i);
        sBecome.listen(i => i);
        this.sBite.listen(i => i);
    }
}

export default BietableHomoSapiens;
