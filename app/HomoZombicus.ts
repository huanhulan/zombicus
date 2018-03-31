import { Cell, CellLoop, Stream, Unit } from "sodiumjs";
import Vector from "vectory";
import Character from "./Character";
import { zombieSensPeriod, zombieSpeed } from "./constants";
import lib from "./lib";
import State from "./State";
import { CharacterType, IPoint, Optional } from "./types";
import World from "./World";

class HomoZombicus {
    public cCharacter: Cell<Character>;
    public sBite: Stream<number>;

    constructor(
        self: number,
        posInit: IPoint,
        cTime: Cell<number>,
        sTick: Stream<Unit>,
        cScene: Cell<Character[]>,
        step: number,
        world: World,
        speed = zombieSpeed,
    ) {
        const cState = new CellLoop<State>();
        const emptyScene: Character[] = [];
        const sChage = sTick.snapshot3(cScene, cState,
            (u, scene, st) => {
                const t = cTime.sample();

                return t - st.t0 >= zombieSensPeriod
                    ? new State(t, st.positionAt(t),
                        self, scene, speed, world, step)
                    : null;
            },
        ).filterNotNull() as Stream<State>;

        // First time, decides based on an empty scene
        cState.loop(sChage.hold(new State(cTime.sample(), posInit, self, emptyScene, speed, world, step)));

        // Output:  representation in the scene
        this.cCharacter = cState.lift(cTime, (st, t) =>
            new Character(self, CharacterType.ZOMBICUS,
                st.positionAt(cTime.sample()), st.velocity));

        // Bites if a human is within 10 pixels
        this.sBite = sTick.snapshot3(cScene, cState,
            (u, scene, st) => {
                const victim: Optional<Character> = st.nearestSapiens(self, scene);
                if (victim !== null) {
                    const myPos = st.positionAt(cTime.sample());
                    if (Vector.distance(victim.pos, lib.p2v(myPos)) < 10) {
                        return victim.id;
                    }
                }
                return null;
            },
        ).filterNotNull() as Stream<number>;
    }
}

export default HomoZombicus;
