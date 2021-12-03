import { Result } from '@badrap/result';
import { Piece, Setup, Square } from 'chessops';
import { Chess, PositionError } from 'chessops/chess';
import { parseSquare, toSquare } from './util';
import { Rules } from './variantType';

export class Explode extends Chess {
    variantRules: Rules;
    protected constructor() {
        super();
        this.variantRules = "explode";
    }
    
    static default(): Explode {
        return super.default() as Explode;
    }
    
    static fromSetup(setup: Setup): Result<Explode, PositionError> {
        return super.fromSetup(setup) as Result<Explode, PositionError>;
    }
    
    clone(): Explode {
        return super.clone() as Explode;
    }
    
    protected playCaptureAt(square: Square, captured: Piece): void {
        super.playCaptureAt(square, captured);
        
        const [x, y]: [number, number] = parseSquare(square);

        // Check if king on the cross
        const kingOnCross: (x: number, y: number) => boolean = (x, y) => {
            const [k1, k2] = [...this.board.king];
            const [k1x, k1y] = parseSquare(k1);
            const [k2x, k2y] = parseSquare(k2);
            return k1x === x || k1y === y || k2x === x || k2y === y; //k1x === x ? k1y !== y : k1y === y || k2x === x ? k2y !== y : k2y === y; // (k1x=x xor k1y=y) or (k2x=x xor k2y=y)  
        }
        if (kingOnCross(x, y))
            return;

        // Apply it if king isn't on cross
        for (let ix = 0; ix < 8; ix++)
            if (ix !== x)
                this.board.take(toSquare(ix, y));            
        for (let iy = 0; iy < 8; iy++)
            if (iy !== y)
                this.board.take(toSquare(x, iy));
    }
}