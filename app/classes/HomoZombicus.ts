import { Cell, CellLoop, Stream, Unit } from "sodiumjs";
import Vector from "vectory";
import { zombieSensPeriod, zombieSpeed } from "../constants";
import lib from "../lib";
import { CharacterType, IPoint, Optional } from "../types";
import Character from "./Character";
import State from "./State";
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
        const t0 = cTime.sample();
        const sChage = sTick.snapshot4(cScene, cState, cTime,
            (u, scene, st, t) => {
                return t - st.t0 >= zombieSensPeriod
                    ? new State(t, st.positionAt(t),
                        self, scene, speed, world, step)
                    : null;
            },
        ).filterNotNull() as Stream<State>;

        // First time, decides based on an empty scene
        cState.loop(sChage.hold(new State(t0, posInit, self, emptyScene, speed, world, step)));

        // Output:  representation in the scene
        this.cCharacter = cState.lift(cTime, (st, t) =>
            new Character(self, CharacterType.ZOMBICUS,
                st.positionAt(t), st.velocity));

        // Bites if a human is within 10 pixels
        this.sBite = sTick.snapshot4(cScene, cState, cTime,
            (u, scene, st, t) => {
                const victim: Optional<Character> = st.nearestSapiens(self, scene);
                if (victim !== null) {
                    const myPos = st.positionAt(t);
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
