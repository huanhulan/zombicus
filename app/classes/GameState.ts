import { Cell, Stream, Unit } from "sodiumjs";
import Character from "../classes/Character";
import World from "../classes/World";

class GameState {
    public static fallDownHole(
        self: number,
        sTick: Stream<Unit>,
        cCharacter: Cell<Character>,
        world: World,
    ) {
        return sTick.snapshot(
            cCharacter,
            (u, ch) => world.hitsHole({
                x: ch.pos.x + world.characterSize.width / 2,
                y: ch.pos.y + world.characterSize.height - 4.5,
            })
                ? self
                : null,
        ).filterNotNull() as Stream<number>;
    }

    public nextID: number;
    public chars: Map<number, Cell<Character>>;
    public sBites: Map<number, Stream<number>>;
    public sDestroys: Map<number, Stream<number>>;

    constructor(
        nextID = 0,
        chars = new Map(),
        sBites = new Map(),
        sDestroys = new Map(),
    ) {
        this.nextID = nextID;
        this.chars = chars;
        this.sBites = sBites;
        this.sDestroys = sDestroys;
    }

    public add(
        chr: Cell<Character>,
        sBite: Stream<number>,
        sDestroys: Stream<number>,
    ) {
        const tmpChars = this.chars;
        const tmpSBites = this.sBites;
        const tmpSDestroys = this.sDestroys;

        tmpChars.set(this.nextID, chr);
        tmpSBites.set(this.nextID, sBite);
        tmpSDestroys.set(this.nextID, sDestroys);

        return new GameState(this.nextID + 1, tmpChars, tmpSBites, tmpSDestroys);
    }

    public remove(ids: number[]) {
        const tmpChars = this.chars;
        const tmpSBites = this.sBites;
        const tmpSDestroys = this.sDestroys;

        ids.forEach(id => {
            tmpChars.delete(id);
            tmpSBites.delete(id);
            tmpSDestroys.delete(id);
        });

        return new GameState(this.nextID + 1, tmpChars, tmpSBites, tmpSDestroys);
    }
}

export default GameState;
