import {CellLoop, MillisecondsTimerSystem, StreamLoop, Unit} from "sodiumjs";

export default (fps = 60) => {
    const toWait = Math.ceil(1000 / fps);
    const sys = new MillisecondsTimerSystem();
    const t0 = sys.time.sample();
    const cTargetTime = new CellLoop<number>();
    const sTick = new StreamLoop<Unit>();
    const sTimeIdeal = sys.at(cTargetTime).map(t => t + toWait);
    const cTime = cTargetTime.map(t => (t - t0) * 0.001);
    cTargetTime.loop(sTimeIdeal.map(t => t + toWait).hold(t0));
    sTick.loop(sTimeIdeal.map(t => Unit.UNIT));

    return {
        cTime,
        sTick,
    };
};
