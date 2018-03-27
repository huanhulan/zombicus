import {Cell, CellLoop, Operational, Stream, Unit} from "sodiumjs";
import Character from "./Character";
import Trajectory from "./Trajectory";
import {CharacterType, IPoint, IWindowSize} from "./types";

const speed = 80;

class SimpleHomoSapiens {
    public character: Cell<Character>;

    constructor(self: number, windowSize: IWindowSize, characterSize: IWindowSize,
                posInit: IPoint, cTime: Cell<number>, sTick: Stream<Unit>) {
        const cTraj = new CellLoop<Trajectory>();
        const sChange = sTick.snapshot3(cTraj, cTime,
            (u, trajectory, time) => time - trajectory.t0 >= trajectory.period
                ? Unit.UNIT
                : null,
        ).filterNotNull();

        const boundary = {
            width: windowSize.width - characterSize.width,
            height: windowSize.height - characterSize.height,
        };

        cTraj.loop(
            sChange.snapshot(cTraj, (u, trajectory) =>
                new Trajectory(cTime.sample(),
                    trajectory.positionAt(cTime.sample()),
                    boundary, speed),
            ).hold(new Trajectory(cTime.sample(), posInit, boundary, speed)),
        );

        this.character = cTraj.lift(cTime, (trajectory, t) =>
            new Character(self, CharacterType.SAPIENS,
                trajectory.positionAt(t), trajectory.velocity),
        );
    }
}

export default SimpleHomoSapiens;
