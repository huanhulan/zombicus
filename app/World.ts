import polygon from "polygon";
import {IPoint, ISize} from "./types";

class World {
    public windowSize: ISize;
    public characterSize: ISize;
    private holes: polygon[];

    constructor(windowSize, characterSize, holes = [] as polygon[]) {
        this.windowSize = windowSize;
        this.characterSize = characterSize;
        this.holes = holes;
    }

    public hitsHole(pt: IPoint) {
        return this.holes.reduce((res, h) => res || h.containsPoint(pt), false);
    }

    public hitsObstacle(pt: IPoint) {
        return this.hitsHole({x: pt.x + this.characterSize.width / 2, y: pt.y + this.characterSize.height - 6}) ||
            pt.x <= 0 || pt.x >= (this.windowSize.width - this.characterSize.width) ||
            pt.y <= 0 || pt.y >= (this.windowSize.height - this.characterSize.height);
    }
}

export default World;
