declare class vectory {
    public x: number;
    public y: number;
    public xx: vectory;
    public xy: vectory;
    public yx: vectory;
    public yy: vectory;

    constructor(x: number, y: number)

    public static from: (list: Array<number>) => vectory;
    public static fromAngle: (angle: number, magnitude: number) => vectory;
    public static parse: (str: string) => vectory;
    public static add: (one: vectory, another: vectory) => vectory;
    public static iadd: (one: vectory, another: vectory) => vectory;
    public static sub: (one: vectory, another: vectory) => vectory;
    public static isub: (one: vectory, another: vectory) => vectory;
    public static mul: (scalar: number, vectory: vectory) => vectory;
    public static imul: (scalar: number, vectory: vectory) => vectory;
    public static div: (scalar: number, vectory: vectory) => vectory;
    public static idiv: (scalar: number, vectory: vectory) => vectory;
    public static lerp: (one: vectory, another: vectory, t: number) => vectory;
    public static normalized: (vectory: vectory) => vectory;
    public static normalize: (vectory: vectory) => vectory;
    public static magnitude: (vectory: vectory) => vectory;
    public static dot: (one: vectory, another: vectory) => vectory;
    public static distance: (one: vectory, another: vectory) => number;
    public static angleOf: (one: vectory, another: vectory) => number;
    public static angleTo: (one: vectory, another: vectory) => number;
    public static rotate: (theta: number, vectory: vectory) => vectory;
    public static irotate: (theta: number, vectory: vectory) => vectory;
    public static reset: (one: vectory, another: vectory) => vectory;
    public static zero: (vectory: vectory) => vectory;
    public static set: (x: number, y: number, vectory: vectory) => vectory;
    public static copy: (vectory: vectory) => vectory;
    public static equals: (one: vectory, another: vectory) => boolean;
    public static compare: (one: vectory, another: vectory) => number;

    public add: (vectory: vectory) => vectory;
    public iadd: (vectory: vectory) => vectory;
    public sub: (vectory: vectory) => vectory;
    public isub: (vectory: vectory) => vectory;
    public mul: (scalar: number) => vectory;
    public imul: (scalar: number) => vectory;
    public div: (scalar: number) => vectory;
    public idiv: (scalar: number) => vectory;
    public lerp: (vectory: vectory, t: number) => vectory;
    public normalized: () => vectory;
    public normalize: () => vectory;
    public magnitude: () => number;
    public dot: (vectory: vectory) => vectory;
    public distance: (vectory: vectory) => number;
    public angleOf: (vectory: vectory) => number;
    public angleTo: (vectory: vectory) => number;
    public rotate: (theta: number) => vectory;
    public irotate: (theta: number) => vectory;
    public reset: (vectory: vectory) => vectory;
    public zero: () => vectory;
    public set: (x: number, y: number) => vectory;
    public copy: () => vectory;
    public equals: (vectory: vectory) => boolean;
    public compare: (vectory: vectory) => -1|0|1;
}

export = vectory;