interface IPoint {
    x: number;
    y: number;
}

declare class polygon {
    constructor(pt: Array<IPoint>)

    public containsPoint(pt: IPoint): boolean
}

export = polygon;