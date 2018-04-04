import { Cell, CellLoop, lambda2, Stream, Unit } from "sodiumjs";
import { humanSpeed } from "../constants";
import { CharacterType, IPoint } from "../types";
import Character from "./Character";
import Trajectory from "./Trajectory";
import World from "./World";

class HomoSapiens {
    public cCharacter: Cell<Character>;

    constructor(
        world: World,
        self: number,
        posInit: IPoint,
        cTime: Cell<number>,
        sTick: Stream<Unit>,
        step: number,
        speed = humanSpeed,
    ) {
        const cTraj = new CellLoop<Trajectory>();
        const t0 = cTime.sample();
        const sChange = sTick.snapshot3(cTraj, cTime,
            (u, trajectory, time) =>
                (world.hitsObstacle((trajectory.positionAt(time + step)))
                    || (time - trajectory.t0 >= trajectory.period))
                    ? Unit.UNIT
                    : null,
        ).filterNotNull();

        cTraj.loop(
            sChange.snapshot3(cTraj, cTime, (u, trajectory, t) =>
                new Trajectory(t,
                    trajectory.positionAt(t), speed, step, world))
                .hold(new Trajectory(t0, posInit, speed, step, world)),
        );

        this.cCharacter = cTraj.lift(cTime, (trajectory, t) =>
            new Character(self, CharacterType.SAPIENS,
                trajectory.positionAt(t), trajectory.velocity),
        );
    }
}

export default HomoSapiens;
