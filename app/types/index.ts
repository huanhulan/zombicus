enum CharacterType {
    SAPIENS,
    ZOMBICUS,
}

interface IPoint {
    x: number;
    y: number;
}

interface ISize {
    width: number;
    height: number;
}

type Optional<T> = T|null;

export {
    CharacterType,
    IPoint,
    ISize,
    Optional,
};
