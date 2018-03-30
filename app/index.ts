import Polygon from "polygon";
import { Transaction } from "sodiumjs";
import * as modernizrConfig from "./../.modernizrrc.json";
import * as homoSapienLeft from "./assets/homo-sapien-left.png";
import * as homoSapienRight from "./assets/homo-sapien-right.png";
import * as homoZombicusLeft from "./assets/homo-zombicus-left.png";
import * as homoZombicusRight from "./assets/homo-zombicus-right.png";
import * as roadiusConium from "./assets/roadius-conium.png";
// import simple from "./frp/simple";
// import humans from "./frp/humans";
import characters from "./frp/characters";
import lib from "./lib";
import { CharacterType, IPoint } from "./types";
import World from "./World";

import "./style/index.scss";

const modernizr = modernizrConfig;
const $container = document.getElementById("viewport") as HTMLDivElement;
const features = ["flexbox", "canvas", "promises"];
const supports = features.map(f => modernizr[f]);

if (supports.filter(support => !support).length) {
    const notSupports = supports.reduce((tupple, support, index) => {
        if (!support) {
            tupple.push(features[index]);
        }
        return tupple;
    }, []).join(", ");
    $container.innerHTML = `Your browser does not support: ${notSupports}.`
        + "Please use modern browsers like Chrome to get the best user experience.";
} else {
    const onloadPromise = new Promise(resolve => {
        window.onload = () => resolve();
    });

    Promise.all([
        lib.getImgPromise(homoSapienLeft),
        lib.getImgPromise(homoSapienRight),
        lib.getImgPromise(homoZombicusLeft),
        lib.getImgPromise(homoZombicusRight),
        lib.getImgPromise(roadiusConium),
        onloadPromise,
    ]).then(
        res => {
            const canvasWith = document.documentElement.clientWidth;
            const canvasHeight = document.documentElement.clientHeight;
            const homoSepientLeftPic = res[0] as HTMLImageElement;
            const homoSepientRightPic = res[1] as HTMLImageElement;
            const homoZombicusLeftPic = res[2] as HTMLImageElement;
            const homoZombicusRightPic = res[3] as HTMLImageElement;
            const roadiusConiumPic = res[4] as HTMLImageElement;

            $container.innerHTML = `<canvas id='canvas' width='${canvasWith}' height='${canvasHeight}'
                    style='width: 100%;border:1px solid;box-sizing: border-box;'></canvas>`;
            const $canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
            const characterSize = {
                width: Math.max(homoSepientLeftPic.width, homoSepientRightPic.width,
                    homoZombicusLeftPic.width, homoZombicusRightPic.width),
                height: Math.max(homoSepientLeftPic.height, homoSepientRightPic.height,
                    homoZombicusLeftPic.height, homoZombicusRightPic.height),
            };
            const windowSize = {
                width: $canvas.width,
                height: $canvas.height,
            };
            const holesPaths: IPoint[][] = [
                [{ x: 200, y: 200 }, { x: 200, y: 700 }, { x: 1000, y: 380 }],
            ];
            const holesPolygons = holesPaths.map(p => new Polygon(p));
            const scence = new World(windowSize, characterSize, holesPolygons);
            const main = () => {
                Transaction.run(() => {
                    const sCharacters = characters(windowSize, characterSize, scence);

                    sCharacters.listen(chs => {
                        chs
                            .sort((a, b) => a.pos.y === b.pos.y ? 0 : a.pos.y < b.pos.y ? -1 : 1);

                        // draw
                        requestAnimationFrame(() => {
                            ctx.clearRect(0, 0, windowSize.width, windowSize.height);
                            holesPaths.forEach(p => lib.drawHoles(ctx, p, roadiusConiumPic));
                            chs
                                .forEach(c => {
                                    if (c.velocity.x < 0) {
                                        ctx.drawImage(c.type === CharacterType.SAPIENS
                                            ? homoSepientLeftPic
                                            : homoZombicusLeftPic,
                                            c.pos.x,
                                            c.pos.y);
                                    } else {
                                        ctx.drawImage(c.type === CharacterType.SAPIENS
                                            ? homoSepientRightPic
                                            : homoZombicusRightPic,
                                            c.pos.x,
                                            c.pos.y);
                                    }
                                });
                        });
                    });
                });
            };
            main();
        },
        e => $container.innerHTML = e,
    );
}
