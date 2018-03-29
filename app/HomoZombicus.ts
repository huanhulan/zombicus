import {Cell, CellLoop, Stream, Unit} from "sodiumjs";
import Vector from "vectory";
import Character from "./Character";
import {zombieSpeed, zombieSensPeriod} from "./constants";
import State from "./State";
import {CharacterType, IPoint, Optional} from "./types";

class HomoZombicus {
    public cCharacter: Cell<Character>;
    public sBite: Stream<number>;

    constructor(self: number,
                posInit: IPoint,
                cTime: Cell<number>,
                sTick: Stream<Unit>,
                scene: Cell<Character[]>,
                speed = zombieSpeed) {
        const cState = new CellLoop<State>();
        const emptyScene: Character[] = [];
        const sChage = sTick.snapshot(cState,
            (u, st) => {
                const t = cTime.sample();

                return t - st.t0 >= zombieSensPeriod
                    ? new State(t, st.positionAt(t),
                        self, scene.sample(), speed)
                    : null;
            }
        ).filterNotNull() as Stream<State>;

        // First time, decides based on an empty scene
        cState.loop(sChage.hold(new State(cTime.sample(), posInit, self, emptyScene, speed)));

        // Output:  representation in the scene
        this.cCharacter = cState.lift(cTime, (st, t) =>
            new Character(self, CharacterType.ZOMBICUS,
                st.positionAt(cTime.sample()), st.velocity));

        // Bites if a human is within 10 pixels
        this.sBite = sTick.snapshot(cState,
            (u, st) => {
                const victim: Optional<Character> = st.nearestSapiens(self, scene.sample());
                if (victim !== null) {
                    const myPos = st.positionAt(cTime.sample());
                    if (Vector.distance(victim.pos, myPos) < 10)
                        return victim.id;
                }
                return null;
            }
        ).filterNotNull() as Stream<number>;
    }
}

export default HomoZombicus;