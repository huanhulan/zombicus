import {Cell, CellLoop, Stream, Unit} from "sodiumjs";
import Character from "./Character";
import Trajectory from "./SimpleTrajectory";
import {CharacterType, IPoint} from "./types";

const speed = 80;

class SimpleHomoSapiens {
    public character: Cell<Character>;

    constructor(self: number, posInit: IPoint, cTime: Cell<number>, sTick: Stream<Unit>) {
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

        this.character = cTraj.lift(cTime, (trajectory, t) =>
            new Character(self, CharacterType.SAPIENS,
                trajectory.positionAt(t), trajectory.velocity),
        );
    }
}

export default SimpleHomoSapiens;
