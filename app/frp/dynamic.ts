import { Cell, CellLoop, Stream, StreamLoop, Unit, Operational } from 'sodiumjs';
import BitableHomoSapiens from "../classes/BitableHomoSapiens";
import Character from '../classes/Character';
import State from "../classes/GameState";
import HomoZombicus from "../classes/HomoZombicus";
import World from "../classes/World";
import lib from "../lib";
import { IPoint, ISize } from "../types";
import tick from "./tick";

const periodicTimer = (
    cTime: Cell<number>,
    sTick: Stream<Unit>,
    period: number,
) => {
    const tAlarm: CellLoop<number> = new CellLoop();
    const sAlarm: Stream<number> =
        sTick.snapshot3(tAlarm, cTime,
            (u, alarm, time) => time >= alarm
                ? time + period
                : null).filterNotNull() as Stream<number>;
    const t0 = cTime.sample() + period;
    tAlarm.loop(sAlarm.hold(t0));
    return sAlarm.map(u => Unit.UNIT);
};

// dynamically add characters
export default (windowSize: ISize, characterSize: ISize, world: World, period = 6) => {
    const { cTime, sTick, fps } = tick();
    const cState = new CellLoop<State>();
    const cScene = new CellLoop<Character[]>();
    const center = {
        x: world.windowSize.width / 2,
        y: world.windowSize.height / 2,
    };
    const step = Math.ceil(1000 / fps) / 1000;

    let initState = new State();
    const firstZombie = new HomoZombicus(initState.nextID,
        { x: windowSize.width / 8 * 1, y: windowSize.height / 8 * 5 },
        cTime, sTick, cScene, step, world);
    const sBite = new StreamLoop<number[]>();
    const sDestroy = new StreamLoop<number[]>();

    // not so referential transparent
    initState = initState.add(firstZombie.cCharacter, firstZombie.sBite,
        State.fallDownHole(initState.nextID, sTick, firstZombie.cCharacter, world));

    const sAdd = periodicTimer(
        cTime,
        sTick,
        period,
    ).map(u =>
        st => {
            const h = new BitableHomoSapiens(
                world, st.nextID, center, cTime, sTick,
                sBite, cScene, step);
            return st.add(h.cCharacter, h.sBite,
                State.fallDownHole(st.nextID, sTick, h.cCharacter,
                    world));
        },
    );

    const sRemove = sDestroy.map(ids => st => st.remove(ids));

    const sChange = sAdd.merge(sRemove,
        (f1, f2) => a => f1(f2(a)));

    cState.loop(sChange.snapshot(cState, (f, st) => f(st)).hold(initState));

    const ccChars: Cell<Cell<Character[]>> = cState.map(st => lib.sequence([...st.chars.values()]));
    const csBite = cState.map(st => lib.balanceMerge(
        [...st.sBites.values()],
        (a, b) => a.concat(b)));
    const csDestroy = cState.map(st =>
        lib.balanceMerge(
            [...st.sDestroys.values()],
            (a, b) => a.concat(b)));

    cScene.loop(Cell.switchC(ccChars));
    sBite.loop(Cell.switchS(csBite));
    sDestroy.loop(Cell.switchS(csDestroy));

    return Operational.updates(cScene);
};
