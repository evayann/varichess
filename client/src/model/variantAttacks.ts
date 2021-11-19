import { SquareSet } from "chessops/squareSet";
import { BySquare, Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { bishopAttacks, knightAttacks, queenAttacks } from "chessops/attacks";


function computeRange(square: Square, deltas: number[]): SquareSet {
    let range = SquareSet.empty();
    for (const delta of deltas) {
      const sq = square + delta;      
      if (0 <= sq && sq < 64 && Math.abs(squareFile(square) - squareFile(sq)) <= 3)
        range = range.with(sq);
    }
    return range;
}

function tabulate<T>(f: (square: Square) => T): BySquare<T> {
    const table = [];
    for (let square = 0; square < 64; square++) table[square] = f(square);
    return table;
}

/**
 * Print stupid helper in python for case offset
 * for i in range(8):
 *  for j in range(8):
 *      print(f"{36 - (i * 8 + j):03}", end=", ")
 *  print()
 */

const UNICORN_ATTACKS = tabulate(sq => computeRange(sq, [-25, -23, -17, -15, -11, -10, -6, -5, 5, 6, 10, 11, 15, 17, 23, 25]));
const ELEPHANT_ATTACKS = tabulate(sq => computeRange(sq, [-18, -16, -14, -9, -8, -7, -1, 1, 7, 8, 9, 14, 16, 18]));
const CORPORAL_ATTACKS = {
    white: tabulate(sq => computeRange(sq, [7, 8, 9])),
    black: tabulate(sq => computeRange(sq, [-7, -8, -9])),
};
const ZEBRA_ATTACKS = tabulate(sq => computeRange(sq, [-16, -8, -4, -3, -2, -1, 1, 2, 3, 4, 8, 16]));


/**
 * Gets squares attacked or defended by a unicorn on `square`.
 */
export function unicornAttacks(square: Square): SquareSet {
    return UNICORN_ATTACKS[square];
}

/**
 * Gets squares attacked or defended by an elephant on `square`.
 */
export function elephantAttacks(square: Square): SquareSet {
    return ELEPHANT_ATTACKS[square];
}

/**
 * Gets squares attacked or defended by a corporal on `square`.
 */
export function corporalAttacks(color: Color, square: Square): SquareSet {
    return CORPORAL_ATTACKS[color][square];
}

/**
 * Gets squares attacked or defended by a giraffe on `square`.
 */
export function giraffeAttacks(square: Square, occupied: SquareSet): SquareSet {
    return bishopAttacks(square, occupied).union(knightAttacks(square));
}

/**
 * Gets squares attacked or defended by a zebra on `square`.
 */
export function zebraAttacks(square: Square, occupied: SquareSet): SquareSet {
    return ZEBRA_ATTACKS[square].union(queenAttacks(square, occupied));
}