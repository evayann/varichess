import { Rules, MOVEMENT, Directions } from "./rules";
import { Position } from "../position";

export class ChessRules extends Rules {
    defaultBoardFen(): string {
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    }

    mvtOfKing(currentX: number, currentY: number): Position[] {
        return this.computeMovements(currentX, currentY, 1, [
                ...Directions.ROW,
                ...Directions.COL,
                ...Directions.DIAG_BL,
                ...Directions.DIAG_TL
            ]
        );
    }

    mvtOfQueen(currentX: number, currentY: number): Position[] {
        return this.computeMovements(currentX, currentY, Directions.MAX, [
                ...Directions.ROW,
                ...Directions.COL,
                ...Directions.DIAG_BL,
                ...Directions.DIAG_TL
            ]
        );
    }

    mvtOfRook(currentX: number, currentY: number): Position[] {
        return this.computeMovements(currentX, currentY, Directions.MAX, [
                ...Directions.ROW,
                ...Directions.COL
            ]
        );
    }

    mvtOfKnight(currentX: number, currentY: number): Position[] {
        let positions: Position[] = [];
        let xCandidate: number, yCandidate: number;

        // Top
        if ((xCandidate = currentX + 2) < 8 && (yCandidate = currentY + 1) < 8) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX + 1) < 8 && (yCandidate = currentY + 2) < 8) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX - 1) >= 0 && (yCandidate = currentY + 2) < 8) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX - 2) >= 0 && (yCandidate = currentY + 1) < 8) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        // Bottom
        if ((xCandidate = currentX + 2) < 8 && (yCandidate = currentY - 1) > 0) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX + 1) < 8 && (yCandidate = currentY - 2) > 0) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX - 1) >= 0 && (yCandidate = currentY - 2) > 0) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        if ((xCandidate = currentX - 2) >= 0 && (yCandidate = currentY - 1) > 0) 
            positions.push({x: xCandidate, y: yCandidate, type: MOVEMENT} as Position);

        return positions;
    }

    mvtOfBishop(currentX: number, currentY: number): Position[] {
        return this.computeMovements(currentX, currentY, Directions.MAX, [
                ...Directions.DIAG_BL,
                ...Directions.DIAG_TL
            ]
        );
    }

    mvtOfPawn(currentX: number, currentY: number): Position[] {
        return this.computeMovements(currentX, currentY, 1, [Directions.COL_BACKWARD]);
    }
}