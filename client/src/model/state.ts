import { Piece, isWhite } from "./piece";
import { Position } from "./position";
import { Direction } from "./directions";

export class State {
    private board: Piece[][];
    private static EMPTY = -1;

    private constructor(fen: string) {
        this.board = new Array(8).fill(State.EMPTY).map(() => new Array(8).fill(State.EMPTY));
        this.parseFen(fen);
    }

    /**
     * Move a piece from x,y to x, y and return a boolean 
     * to indicate if a piece was eat  during movement
     * @param xFrom the x pos from
     * @param yFrom the y pos from
     * @param xTo the x pos to
     * @param yTo the y pos to
     * @returns indication of if a piece was eat
     */
    move(xFrom: number, yFrom: number, xTo: number, yTo: number): boolean {       
        const eat = this.board[yTo][xTo] !== State.EMPTY;
        this.board[yTo][xTo] = this.board[yFrom][xFrom];
        this.board[yFrom][xFrom] = State.EMPTY;
        return eat;
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

    getEatFor(type:string, currX: number, currY: number, length: number, dirs: Direction[]): Position[] {
        return dirs.reduce((acc, dir) => {
            for (let i = 1; i <= length; i++) {
                let x: number = currX + i * dir.x;
                let y: number = currY + i * dir.y;
                
                if (0 <= x && x < 8 && 0 <= y && y < 8) {
                    if (this.board[y][x] !== State.EMPTY) {
                        if (isWhite(this.board[y][x]) !== isWhite(Piece[type as keyof typeof Piece]))
                            acc.push({ x: x, y: y, type: "EAT" });
                        break;
                    }
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