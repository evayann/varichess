import { Rules } from "./rules";
import { Direction, MAX, ROW, COL, COL_BACKWARD, DIAGS, L, DIAG_BL_FORWARD, DIAG_TL_BACKWARD, DIAG_TL_FORWARD, DIAG_BL_BACKWARD } from "../directions";

export class ChessRules extends Rules {

    defaultBoardFen(): string {
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    }

    //#region Movements
    mvtOfKing(): [number, Direction[]] {
        return [1, [
                ...ROW,
                ...COL, 
                ...DIAGS
            ]
        ];
    }

    mvtOfQueen(): [number, Direction[]] {
        return [MAX, [
                ...ROW,
                ...COL,
                ...DIAGS
            ]
        ];
    }

    mvtOfRook(): [number, Direction[]] {
        return [MAX, [
                ...ROW,
                ...COL
            ]
        ];
    }

    mvtOfKnight(): [number, Direction[]] {
        return [1, L];
    }

    mvtOfBishop(): [number, Direction[]] {
        return [MAX, DIAGS];
    }

    mvtOfPawn(): [number, Direction[]] {
        return [1, [COL_BACKWARD]];
    }
    //#endregion Movements

    //#region Eat
    eatOfKing(): [number, Direction[]] {
        return this.mvtOfKing();
    }

    eatOfQueen(): [number, Direction[]] {
        return this.mvtOfQueen();
    }

    eatOfRook(): [number, Direction[]] {
        return this.mvtOfRook();
    }

    eatOfKnight(): [number, Direction[]] {
        return this.mvtOfKnight();
    }

    eatOfBishop(): [number, Direction[]] {
        return this.mvtOfBishop();
    }

    eatOfPawn(): [number, Direction[]] {
        return [1, [DIAG_TL_FORWARD, DIAG_BL_BACKWARD]];
    }
    //#endregion Eat
}