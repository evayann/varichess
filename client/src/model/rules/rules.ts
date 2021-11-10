// import { Position } from "../position";

// export interface Direction {
//     x: number, 
//     y: number
// }

// export const Directions = {
//     MAX: 8,
    
//     ROW_FORWARD: { x: 1, y: 0 },
//     ROW_BACKWARD: { x: -1, y: 0 },
//     ROW: [{ x: 1, y: 0 }, { x: -1, y: 0 }],

//     COL_FORWARD: { x: 0, y: 1 },
//     COL_BACKWARD: { x: 0, y: -1 },
//     COL: [{ x: 0, y: 1 }, { x: 0, y: -1 }],

//     DIAG_TL_FORWARD: { x: 1, y: -1 },
//     DIAG_TL_BACKWARD: { x: -1, y: 1 },
//     DIAG_TL: [{ x: 1, y: -1 }, { x: -1, y: 1 }],

//     DIAG_BL_FORWARD: { x: 1, y: 1 },
//     DIAG_BL_BACKWARD: { x: -1, y: -1 },
//     DIAG_BL: [{ x: 1, y: 1 }, { x: -1, y: -1 }]
// }

import { Direction } from "../directions";

enum ActionEvent {
    KILL
}

abstract class Action {
    type: ActionEvent;
    how: Direction[];

    constructor(type: ActionEvent, how: Direction[]) {
        this.type = type;
        this.how = how;
    }
}

export const MOVEMENT = "MOVEMENT"; 

export abstract class Rules {

    private keyFct: Map<string, (...args: any[]) => any> = new Map();

    constructor() {
        this.keyFct.set("k", this.mvtOfKing);
        this.keyFct.set("K", this.mvtOfKing);
        this.keyFct.set("q", this.mvtOfQueen);
        this.keyFct.set("Q", this.mvtOfQueen);
        this.keyFct.set("r", this.mvtOfRook);
        this.keyFct.set("R", this.mvtOfRook);
        this.keyFct.set("n", this.mvtOfKnight);
        this.keyFct.set("N", this.mvtOfKnight);
        this.keyFct.set("b", this.mvtOfBishop);
        this.keyFct.set("B", this.mvtOfBishop);
        this.keyFct.set("p", this.mvtOfPawn);
        this.keyFct.set("P", this.mvtOfPawn);
    }

    // computeMovements(currentX: number, currentY: number, length: number, dirs: Direction[]): Position[] {       
    //     return dirs.reduce((acc, dir) => {
    //         for (let i = 1; i <= length; i++) {
    //             let x: number = currentX + i * dir.x;
    //             let y: number = currentY + i * dir.y;
    //             if (0 <= x && x < 8 && 0 <= y && y < 8)
    //                 acc.push({ x: x, y: y, type: MOVEMENT });
    //         }
    //         return acc;
    //     }, [] as Position[]);
    // }

    abstract defaultBoardFen(): string;

    // Movements
    // getPlayFor(type: string, x: number, y: number): Position[] {
    getPlayFor(type: string): [number, Direction[]] {
        // const fct = this.keyFct.get(type);
        // return fct ? fct.call(this, x, y) : [];
        // return fct ? fct.call(this) : [];
        return this.keyFct.get(type)?.call(this) ?? [];
    }

    abstract mvtOfKing(): [number, Direction[]];
    abstract mvtOfQueen(): [number, Direction[]];
    abstract mvtOfRook(): [number, Direction[]];
    abstract mvtOfBishop(): [number, Direction[]];
    abstract mvtOfKnight(): [number, Direction[]];
    abstract mvtOfPawn(): [number, Direction[]];

    // // On Check

    // // On Movements
    // onKMvt(): Action,

    // // On Dead
    // onKDead(): Action
}

// export class Explosion extends Action {
//     constructor() {
//         super(ActionEvent.KILL, [ROW, COL]);
//     }
// }
