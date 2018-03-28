import {Transaction} from "sodiumjs";
import * as modernizrConfig from "./../.modernizrrc.json";
import * as homoSapienLeft from "./assets/homo-sapien-left.png";
import * as homoSapienRight from "./assets/homo-sapien-right.png";
import * as homoZombicusLeft from "./assets/homo-zombicus-left.png";
import * as homoZombicusRight from "./assets/homo-zombicus-right.png";
import simple from "./frp/simple";
import lib from "./lib";
import {CharacterType} from "./types";

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
        onloadPromise,
    ])
        .then(res => {
                const homoSepientLeftPic = res[0] as HTMLImageElement;
                const homoSepientRightPic = res[1] as HTMLImageElement;
                const homoZombicusLeftPic = res[2] as HTMLImageElement;
                const homoZombicusRightPic = res[3] as HTMLImageElement;
                $container.innerHTML = "<canvas id='canvas' width='1680' height='720' style='width: 100%;" +
                    "border:1px solid;box-sizing: border-box;'></canvas>";
                const $canvas = document.getElementById("canvas") as HTMLCanvasElement;
                const ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
                const characterSize = {
                    width: Math.max(homoSepientLeftPic.width, homoSepientRightPic.width,
                        homoZombicusLeftPic.width, homoZombicusRightPic.width),
                    height: Math.max(homoSepientLeftPic.height, homoSepientRightPic.height,
                        homoZombicusLeftPic.height, homoZombicusRightPic.height),
                };

                const main = () => {
                    const windowSize = {
                        width: $canvas.width,
                        height: $canvas.height,
                    };

                    Transaction.run(() => {
                        const sCharacters = simple(windowSize);

                        sCharacters.listen(characters => {
                            characters
                                .sort((a, b) => a.pos.y === b.pos.y ? 0 : a.pos.y < b.pos.y ? -1 : 1);
                            requestAnimationFrame(() => {
                                ctx.clearRect(0, 0, windowSize.width, windowSize.height);
                                characters
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
            e => e,
        );
}
