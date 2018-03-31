import { Cell, CellLoop, Stream, Unit } from "sodiumjs";
import Character from "./Character";
import { humanSpeed, zombieSpeed } from "./constants";
import HomoSapiens from "./HomoSapiens";
import HomoZombicus from "./HomoZombicus";
import { IPoint } from "./types";
import World from "./World";

class BietableHomoSapiens {
    public cCharacter: Cell<Character>;
    public sBite: Stream<number>;

    constructor(
        world: World,
        self: number,
        posInit: IPoint,
        cTime: Cell<number>,
        sTick: Stream<Unit>,
        sBite: Stream<number[]>,
        cScene: Cell<Character[]>,
        step: number,
        hSpeed = humanSpeed,
        zSpeed = zombieSpeed,
    ) {
        const h = new HomoSapiens(world, self, posInit, cTime, sTick, step, hSpeed);

        // Filters out a bite event if it isn’t for this character, and only fires once.
        const sBiteMe = sBite.filter(ids => ids.findIndex(id => id === self) !== -1).once();

        // Stream containing the new zombie
        const sBecome = sBiteMe.snapshot(h.cCharacter, (id, ch) =>
            new HomoZombicus(
                self,
                ch.pos, // Zombie starts at human’s current position
                cTime,
                sTick,
                cScene,
                step,
                world,
                zSpeed,
            ),
        );

        // Starts as HomoSapiens, and then turns into the character from sBecome
        this.cCharacter = Cell.switchC(
            sBecome.map(z => z.cCharacter).hold(h.cCharacter),
        );

        // Starts as a never, because humans don’t bite, and then turns into the bite from sBecome
        this.sBite = Cell.switchS(
            sBecome.map(z => z.sBite).hold(new Stream<number>()),
        );
    }
}

export default BietableHomoSapiens;
