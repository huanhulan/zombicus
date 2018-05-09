import {Cell, lambda2, Stream} from "sodiumjs";
import Vector from "vectory";
import {holeColor} from "../constants";
import {IPoint} from "../types";

// using balanced binary tree to merge the streams for efficiency.
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
    p2v(p: IPoint) {
        return Vector.from([p.x, p.y]);
    },
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
    /**
     * @param input
     * @param deps
     * @returns {Cell}
     * We need to inject the dependencies manually to avoid the accidentally GC of the Cell causing by the JS engine.
     */
        sequence<A>(input: Array<Cell<A>>, deps?: Array<Stream<any> | Cell<any>>): Cell<A[]> {
        let out = new Cell([] as A[]);

        for (const c of input) {
            out = out.lift(c,
                lambda2((list0, a) => {
                    const list = [...list0];
                    list.push(a);
                    return list;
                }, Array.isArray(deps) ? deps : []));
        }
        return out;
    },
    drawHoles(ctx: CanvasRenderingContext2D, path: IPoint[], icon: HTMLImageElement) {
        if (path.length) {
            const {x, y} = path[0];
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = holeColor;
            ctx.moveTo(x, y);
            path.slice(1).forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            path.forEach(point => ctx.drawImage(icon, point.x - icon.width / 2,
                point.y - (icon.height - 5)));
        }
    },
    mergeToPolygonPath(xs: number[], ys: number[]) {
        if (xs.length !== ys.length) {
            throw new Error("the length of coordinate list must be equal to each other.");
        }
        return xs.map((x, idx) => ({x, y: ys[idx]}));
    },
};

export default lib;
