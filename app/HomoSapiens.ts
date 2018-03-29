import {Cell, CellLoop, Stream, Unit} from "sodiumjs";
import Character from "./Character";
import {humanSpeed} from "./constants";
import Trajectory from "./Trajectory";
import {CharacterType, IPoint} from "./types";
import World from "./World";

class HomoSapiens {
    public cCharacter: Cell<Character>;

    constructor(world: World,
                self: number,
                posInit: IPoint,
                cTime: Cell<number>,
                sTick: Stream<Unit>,
                step: number,
                speed = humanSpeed) {
        const cTraj = new CellLoop<Trajectory>();
        const sChange = sTick.snapshot3(cTraj, cTime,
            (u, trajectory, time) =>
                (world.hitsObstacle((trajectory.positionAt(time + step)))
                || (time - trajectory.t0 >= trajectory.period))
                    ? Unit.UNIT
                    : null,
        ).filterNotNull();

        cTraj.loop(
            sChange.snapshot(cTraj, (u, trajectory) =>
                new Trajectory(cTime.sample(),
                    trajectory.positionAt(cTime.sample()), speed, step, world),
            ).hold(new Trajectory(cTime.sample(), posInit, speed, step, world)),
        );

        this.cCharacter = cTraj.lift(cTime, (trajectory, t) =>
            new Character(self, CharacterType.SAPIENS,
                trajectory.positionAt(t), trajectory.velocity),
        );
    }
}

export default HomoSapiens;
