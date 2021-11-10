import { Piece } from "./piece";
import { Position } from "./position";
import { Direction } from "./directions";

export class State {
    private board: Piece[][];
    private static EMPTY = -1;

    private constructor(fen: string) {
        this.board = new Array(8).fill(State.EMPTY).map(() => new Array(8).fill(State.EMPTY));
        this.parseFen(fen);
    }

    move(xFrom: number, yFrom: number, xTo: number, yTo: number): void {
        this.board[yTo][xTo] = this.board[yFrom][xFrom];
        this.board[yFrom][xFrom] = State.EMPTY;
    }

    convertBoardToPosition(): Position[] {
        let pos: Position[] = [];
        this.board.forEach((row, y) => row.forEach((el, x) => {
            if (el !== State.EMPTY)
                pos.push({x: x, y: y, type: Piece[el]});
        }));
        return pos;
    }

    getMoveFor(currX: number, currY: number, length: number, dirs: Direction[]): Position[] {
        return dirs.reduce((acc, dir) => {
            for (let i = 1; i <= length; i++) {
                let x: number = currX + i * dir.x;
                let y: number = currY + i * dir.y;
                
                if (0 <= x && x < 8 && 0 <= y && y < 8) {
                    if (this.board[y][x] !== State.EMPTY) 
                        break;

                    acc.push({ x: x, y: y, type: "MOVEMENT" });
                }

            }
            return acc;
        }, [] as Position[]);
    }

    parseFen(fen: string): void {
        if (! this.checkFen(fen))
            return;

        fen.split("/").map((row, rowIndex) => [...row].reduce((acc, char) => {
            let charNumber = Number(char);
            if (isNaN(charNumber)) {
                this.board[rowIndex][acc] = Piece[char as keyof typeof Piece];
                acc++;
            }
            else {
                acc += charNumber;
            }
            return acc;
        }, 0));        
    }

    checkFen(fen: string): boolean {
        return true; // TODO 
    }

    getFen(): string {
        let fen: string = "";
        this.board.forEach(row => {
            const acc = row.reduce((acc, el) => {
                if (el !== State.EMPTY) {
                    // Add space zone
                    if (acc > 0)
                        fen += `${acc}`;
                    fen += `${Piece[el]}`;
                    return 0; // Reset counter
                }
                else {
                    return acc + 1;
                }
            }, 0);

            if (acc > 0)
                fen += acc;
            
            fen += "/";
        });      
        return fen;
    }

    static fromFen(fen: string): State {
        return new State(fen);
    }
}