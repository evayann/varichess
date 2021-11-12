import { Rules } from "./rules";
import { Direction, MAX, ROW, COL, COL_BACKWARD, DIAGS, L, DIAG_TL_FORWARD, DIAG_BL_BACKWARD, COL_FORWARD, DIAG_TL_BACKWARD, DIAG_BL_FORWARD } from "../directions";

export class ChessRules extends Rules {

    defaultBoardFen(): string {
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    }

    //#region Movements
    private mvtOfKing(): [number, Direction[]] {
        return [1, [
                ...ROW,
                ...COL, 
                ...DIAGS
            ]
        ];
    }

    private mvtOfQueen(): [number, Direction[]] {
        return [MAX, [
                ...ROW,
                ...COL,
                ...DIAGS
            ]
        ];
    }

    private mvtOfRook(): [number, Direction[]] {
        return [MAX, [
                ...ROW,
                ...COL
            ]
        ];
    }

    private mvtOfKnight(): [number, Direction[]] {
        return [1, L];
    }

    private mvtOfBishop(): [number, Direction[]] {
        return [MAX, DIAGS];
    }

    mvtOfBlackKing(): [number, Direction[]] {
        return this.mvtOfKing();
    }

    mvtOfWhiteKing(): [number, Direction[]] {
        return this.mvtOfKing();
    }

    mvtOfBlackQueen(): [number, Direction[]] {
        return this.mvtOfQueen();
    }

    mvtOfWhiteQueen(): [number, Direction[]] {
        return this.mvtOfQueen();
    }

    mvtOfBlackRook(): [number, Direction[]] {
        return this.mvtOfRook();
    }

    mvtOfWhiteRook(): [number, Direction[]] {
        return this.mvtOfRook();
    }

    mvtOfBlackKnight(): [number, Direction[]] {
        return this.mvtOfKnight();
    }

    mvtOfWhiteKnight(): [number, Direction[]] {
        return this.mvtOfKnight();
    }

    mvtOfBlackBishop(): [number, Direction[]] {
        return this.mvtOfBishop();
    }

    mvtOfWhiteBishop(): [number, Direction[]] {
        return this.mvtOfBishop();
    }

    mvtOfBlackPawn(): [number, Direction[]] {
        return [1, [COL_FORWARD]];
    }

    mvtOfWhitePawn(): [number, Direction[]] {
        return [1, [COL_BACKWARD]];
    }
    //#endregion Movements

    //#region Eat
    eatOfBlackKing(): [number, Direction[]] {
        return this.mvtOfKing();
    }

    eatOfWhiteKing(): [number, Direction[]] {
        return this.mvtOfKing();
    }

    eatOfBlackQueen(): [number, Direction[]] {
        return this.mvtOfQueen();
    }

    eatOfWhiteQueen(): [number, Direction[]] {
        return this.mvtOfQueen();
    }

    eatOfBlackRook(): [number, Direction[]] {
        return this.mvtOfRook();
    }

    eatOfWhiteRook(): [number, Direction[]] {
        return this.mvtOfRook();
    }

    eatOfBlackKnight(): [number, Direction[]] {
        return this.mvtOfKnight();
    }

    eatOfWhiteKnight(): [number, Direction[]] {
        return this.mvtOfKnight();
    }

    eatOfBlackBishop(): [number, Direction[]] {
        return this.mvtOfBishop();
    }

    eatOfWhiteBishop(): [number, Direction[]] {
        return this.mvtOfBishop();
    }

    eatOfBlackPawn(): [number, Direction[]] {
        return [1, [DIAG_TL_BACKWARD, DIAG_BL_FORWARD]];
    }

    eatOfWhitePawn(): [number, Direction[]] {
        return [1, [DIAG_TL_FORWARD, DIAG_BL_BACKWARD]];
    }
    //#endregion Eat

    kingCanBeCheck(): boolean {
        return true;
    }
}