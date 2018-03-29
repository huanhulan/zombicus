import {CellLoop, MillisecondsTimerSystem, StreamLoop, Unit} from "sodiumjs";
import {defaultFps} from "../constants";

// animation loop/timer
export default (fps = defaultFps) => {
    const toWait = Math.ceil(1000 / fps);
    const sys = new MillisecondsTimerSystem();
    const t0 = sys.time.sample();
    const cTargetTime = new CellLoop<number>();
    const sTick = new StreamLoop<Unit>();
    const sTimeIdeal = sys.at(cTargetTime).map(t => t + toWait);
    const cTime = cTargetTime.map(t => (t - t0) * 0.001);
    /**
     * Ideally, the cTarget would be a sequence with step of 17,
     * but since the javascript is single process, there will
     * be frames left for the animation and other computational work.
     * But the margin of target time and ideal time will always be 17.
     */
    cTargetTime.loop(sTimeIdeal.map(t => t + toWait).hold(t0));
    sTick.loop(sTimeIdeal.map(t => Unit.UNIT));

    return {
        cTime,
        sTick,
        fps
    };
};
