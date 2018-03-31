import { Cell, CellLoop, Stream, Unit } from "sodiumjs";
import { humanSpeed } from "../constants";
import { CharacterType, IPoint } from "../types";
import Character from "./Character";
import Trajectory from "./SimpleTrajectory";

class SimpleHomoSapiens {
    public cCharacter: Cell<Character>;

    constructor(
        self: number,
        posInit: IPoint,
        cTime: Cell<number>,
        sTick: Stream<Unit>,
        speed = humanSpeed,
    ) {
        const cTraj = new CellLoop<Trajectory>();
        const sChange = sTick.snapshot3(cTraj, cTime,
            (u, trajectory, time) => time - trajectory.t0 >= trajectory.period
                ? Unit.UNIT
                : null,
        ).filterNotNull();

        cTraj.loop(
            sChange.snapshot(cTraj, (u, trajectory) =>
                new Trajectory(cTime.sample(),
                    trajectory.positionAt(cTime.sample()), speed),
            ).hold(new Trajectory(cTime.sample(), posInit, speed)),
        );

        this.cCharacter = cTraj.lift(cTime, (trajectory, t) =>
            new Character(self, CharacterType.SAPIENS,
                trajectory.positionAt(t), trajectory.velocity),
        );
    }
}

export default SimpleHomoSapiens;
