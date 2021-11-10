import { Rules } from "./rules";
import { Direction, MAX, ROW, COL, COL_BACKWARD, DIAGS, L } from "../directions";

export class ChessRules extends Rules {
    defaultBoardFen(): string {
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    }

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
}