import {Stream} from "sodiumjs";
import Vector from "vectory";
import {IPoint} from "../types";

function balanceMerge<T>(input: Array<Stream<T>>, f) {
    if (input.length === 0) {
        return new Stream<T>();
    }
    if (input.length === 1) {
        return input[0].map(u => [u]);
    }

    const middle = Math.floor(input.length / 2);

    const l = balanceMerge(input.slice(0, middle), f);
    const h = balanceMerge(input.slice(middle), f);
    return l.merge(h, f);
}

const lib = {
    v2p(p: IPoint, v: Vector) {
        return {
            x: p.x + v.x,
            y: p.y + v.y,
        } as IPoint;
    },
    getImgPromise(src) {
        const img = new Image();
        img.src = src;

        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = e => reject(img);
        }) as Promise<HTMLImageElement>;
    },
    balanceMerge,
};

export default lib;
