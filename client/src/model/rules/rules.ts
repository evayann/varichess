import { Direction } from "../directions";

export const MOVEMENT = "MOVEMENT"; 

type Action = (...args: any[]) => any;

export abstract class Rules {

    private static EAT: string = "e";
    private static MOVE: string = "m";

    private keyFct: Map<string, Action> = new Map();

    constructor() {
        const moves: Array<[string, Action]> = [
            ["k", this.mvtOfBlackKing],
            ["q", this.mvtOfBlackQueen],
            ["r", this.mvtOfBlackRook],
            ["n", this.mvtOfBlackKnight],
            ["b", this.mvtOfBlackBishop],
            ["p", this.mvtOfBlackPawn],
            ["K", this.mvtOfWhiteKing],
            ["Q", this.mvtOfWhiteQueen],
            ["R", this.mvtOfWhiteRook],
            ["N", this.mvtOfWhiteKnight],
            ["B", this.mvtOfWhiteBishop],
            ["P", this.mvtOfWhitePawn],
         ];
        moves.forEach(([piece, action]) => this.keyFct.set(Rules.MOVE + piece, action));

        const eats: Array<[string, Action]> = [
            ["k", this.eatOfBlackKing],
            ["q", this.eatOfBlackQueen],
            ["r", this.eatOfBlackRook],
            ["n", this.eatOfBlackKnight],
            ["b", this.eatOfBlackBishop],
            ["p", this.eatOfBlackPawn],
            ["K", this.eatOfWhiteKing],
            ["Q", this.eatOfWhiteQueen],
            ["R", this.eatOfWhiteRook],
            ["N", this.eatOfWhiteKnight],
            ["B", this.eatOfWhiteBishop],
            ["P", this.eatOfWhitePawn]
         ];
         eats.forEach(([piece, action]) => this.keyFct.set(Rules.EAT + piece, action));
    }

    abstract defaultBoardFen(): string;

    private getActionFor(action: string, type: string): Action | undefined {
        return this.keyFct.get(action + type);
    }

    //#region Movements
    getPlayFor(type: string): [number, Direction[]] {
        return this.getActionFor(Rules.MOVE, type)?.call(this) ?? [];
    }

    abstract mvtOfWhiteKing(): [number, Direction[]];
    abstract mvtOfWhiteQueen(): [number, Direction[]];
    abstract mvtOfWhiteRook(): [number, Direction[]];
    abstract mvtOfWhiteBishop(): [number, Direction[]];
    abstract mvtOfWhiteKnight(): [number, Direction[]];
    abstract mvtOfWhitePawn(): [number, Direction[]];

    abstract mvtOfBlackKing(): [number, Direction[]];
    abstract mvtOfBlackQueen(): [number, Direction[]];
    abstract mvtOfBlackRook(): [number, Direction[]];
    abstract mvtOfBlackBishop(): [number, Direction[]];
    abstract mvtOfBlackKnight(): [number, Direction[]];
    abstract mvtOfBlackPawn(): [number, Direction[]];
    //#endregion Movements

    //#region Eat
    getEatFor(type: string): [number, Direction[]] {
        return this.getActionFor(Rules.EAT, type)?.call(this) ?? [];
    }

    abstract eatOfWhiteKing(): [number, Direction[]];
    abstract eatOfWhiteQueen(): [number, Direction[]];
    abstract eatOfWhiteRook(): [number, Direction[]];
    abstract eatOfWhiteBishop(): [number, Direction[]];
    abstract eatOfWhiteKnight(): [number, Direction[]];
    abstract eatOfWhitePawn(): [number, Direction[]];

    abstract eatOfBlackKing(): [number, Direction[]];
    abstract eatOfBlackQueen(): [number, Direction[]];
    abstract eatOfBlackRook(): [number, Direction[]];
    abstract eatOfBlackBishop(): [number, Direction[]];
    abstract eatOfBlackKnight(): [number, Direction[]];
    abstract eatOfBlackPawn(): [number, Direction[]];
    //#endregion Eat

    abstract kingCanBeCheck(): boolean;

    // On Check

    // // On Movements
    // onKMvt(): Action,

    // // On Dead
    // onKDead(): Action
}

// enum ActionEvent {
//     KILL
// }

// abstract class Action {
//     type: ActionEvent;
//     how: Direction[];

//     constructor(type: ActionEvent, how: Direction[]) {
//         this.type = type;
//         this.how = how;
//     }
// }

// export class Explosion extends Action {
//     constructor() {
//         super(ActionEvent.KILL, [ROW, COL]);
//     }
// }
