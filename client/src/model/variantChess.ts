import { Castles, Chess as StdChess, Context} from 'chessops/chess';
import { SquareSet } from 'chessops/squareSet';
import { defined, kingCastlesTo, opposite } from 'chessops/util';
import { CastlingSide, Color, Square } from 'chessops/types';
import { between, bishopAttacks, kingAttacks, knightAttacks, pawnAttacks, queenAttacks, ray, rookAttacks } from 'chessops/attacks';
import { Board as StdBoard } from 'chessops/board';

import { Board } from './variantBoard';
import { corporalAttacks, elephantAttacks, giraffeAttacks, unicornAttacks, zebraAttacks } from './variantAttacks';
import { Rules } from './variantType';

function attacksTo(square: Square, attacker: Color, board: Board, occupied: SquareSet): SquareSet {
    return board[attacker].intersect(
      rookAttacks(square, occupied)
        .intersect(board.rooksAndQueens())
        .union(bishopAttacks(square, occupied).intersect(board.bishopsAndQueens()))
        .union(knightAttacks(square).intersect(board.knight))
        .union(kingAttacks(square).intersect(board.king))
        .union(pawnAttacks(opposite(attacker), square).intersect(board.pawn))

        .union(zebraAttacks(square, occupied).intersect(board.zebra.union(board.queen)))
        .union(unicornAttacks(square).intersect(board.unicorn))
        .union(giraffeAttacks(square, board.occupied).intersect(board.giraffe))
        .union(elephantAttacks(square).intersect(board.elephant))
        .union(corporalAttacks(opposite(attacker), square).intersect(board.corporal))
    );
}

export class Chess extends StdChess {
    variantRules: Rules;
    
    constructor(variantRules?: Rules) {
        super();
        this.variantRules = variantRules || "variantChess";
    }

    ctx(): Context {
      const variantEnd = this.isVariantEnd();
      const king = (this.board as Board).royalKnightOf(this.turn);
      if (!defined(king))
        return { king, blockers: SquareSet.empty(), checkers: SquareSet.empty(), variantEnd, mustCapture: false };
      const snipers = rookAttacks(king, SquareSet.empty())
        .intersect(this.board.rooksAndQueens())
        .union(bishopAttacks(king, SquareSet.empty()).intersect(this.board.bishopsAndQueens()))
        .intersect(this.board[opposite(this.turn)]);
      let blockers = SquareSet.empty();
      for (const sniper of snipers) {
        const b = between(king, sniper).intersect(this.board.occupied);
        if (!b.moreThanOne()) blockers = blockers.union(b);
      }
      const checkers = this.royalKnightAttackers(king, opposite(this.turn), this.board.occupied);
      return {
        king,
        blockers,
        checkers,
        variantEnd,
        mustCapture: false,
      };
    }

    protected royalKnightAttackers(square: Square, attacker: Color, occupied: SquareSet): SquareSet {
      return attacksTo(square, attacker, this.board as Board, occupied);
    }

    private castlingDestExt(side: CastlingSide, ctx: Context): SquareSet {
        if (!defined(ctx.king) || ctx.checkers.nonEmpty()) return SquareSet.empty();
        const rook = this.castles.rook[this.turn][side];
        if (!defined(rook)) return SquareSet.empty();
        if (this.castles.path[this.turn][side].intersects(this.board.occupied)) return SquareSet.empty();
    
        const kingTo = kingCastlesTo(this.turn, side);
        const kingPath = between(ctx.king, kingTo);
        const occ = this.board.occupied.without(ctx.king);
        for (const sq of kingPath) {
          if (this.royalKnightAttackers(sq, opposite(this.turn), occ).nonEmpty()) return SquareSet.empty();
        }
    
        const rookTo = rookCastlesTo(this.turn, side);
        const after = this.board.occupied.toggle(ctx.king).toggle(rook).toggle(rookTo);
        if (this.royalKnightAttackers(kingTo, opposite(this.turn), after).nonEmpty()) return SquareSet.empty();
    
        return SquareSet.fromSquare(rook);
    }

    private canCaptureEpExt(pawn: Square, ctx: Context): boolean {
        if (!defined(this.epSquare)) return false;
        if (!pawnAttacks(this.turn, pawn).has(this.epSquare)) return false;
        if (!defined(ctx.king)) return true;
        const captured = this.epSquare + (this.turn === 'white' ? -8 : 8);
        const occupied = this.board.occupied.toggle(pawn).toggle(this.epSquare).toggle(captured);
        return !this.royalKnightAttackers(ctx.king, opposite(this.turn), occupied).intersects(occupied);
    }

    dests(square: Square, ctx?: Context): SquareSet {
        ctx = ctx || this.ctx();

        if (ctx.variantEnd) return SquareSet.empty();
        const piece = (this.board as Board).get(square);
        if (!piece || piece.color !== this.turn) return SquareSet.empty();
    
        let pseudo, legal;
        if (piece.role === 'pawn') {
          pseudo = pawnAttacks(this.turn, square).intersect(this.board[opposite(this.turn)]);
          const delta = this.turn === 'white' ? 8 : -8;
          const step = square + delta;
          if (0 <= step && step < 64 && !this.board.occupied.has(step)) {
            pseudo = pseudo.with(step);
            const canDoubleStep = this.turn === 'white' ? square < 16 : square >= 64 - 16;
            const doubleStep = step + delta;
            if (canDoubleStep && !this.board.occupied.has(doubleStep)) {
              pseudo = pseudo.with(doubleStep);
            }
          }
          if (defined(this.epSquare) && this.canCaptureEpExt(square, ctx)) {
            const pawn = this.epSquare - delta;
            if (ctx.checkers.isEmpty() || ctx.checkers.singleSquare() === pawn) {
              legal = SquareSet.fromSquare(this.epSquare);
            }
          }
        } else if (piece.role === 'bishop') pseudo = bishopAttacks(square, this.board.occupied);
        else if (piece.role === 'knight') pseudo = knightAttacks(square);
        else if (piece.role === 'rook') pseudo = rookAttacks(square, this.board.occupied);
        else if (piece.role === 'queen') pseudo = queenAttacks(square, this.board.occupied);
        else if (piece.role === 'corporal') {
          pseudo = corporalAttacks(piece.color, square);
          const delta = this.turn === 'white' ? 8 : -8;
          const step = square + delta;
          if (0 <= step && step < 64 && !this.board.occupied.has(step)) {
            pseudo = pseudo.with(step);
            const canDoubleStep = this.turn === 'white' ? square < 16 : square >= 64 - 16;
            const doubleStep = step + delta;
            if (canDoubleStep && !this.board.occupied.has(doubleStep)) {
              pseudo = pseudo.with(doubleStep);
            }
          }
          if (defined(this.epSquare) && this.canCaptureEpExt(square, ctx)) {
            const pawn = this.epSquare - delta;
            if (ctx.checkers.isEmpty() || ctx.checkers.singleSquare() === pawn) {
              legal = SquareSet.fromSquare(this.epSquare);
            }
          }
        }
        else if (piece.role === 'unicorn') pseudo = unicornAttacks(square);
        else if (piece.role === 'elephant') pseudo = elephantAttacks(square);
        else if (piece.role === 'giraffe') pseudo = giraffeAttacks(square, this.board.occupied);
        else if (piece.role === 'zebra') pseudo = zebraAttacks(square, this.board.occupied);
        else if (piece.role === 'royalknight') pseudo = knightAttacks(square);
        else pseudo = kingAttacks(square);
    
        pseudo = pseudo.diff(this.board[this.turn]);

        if (defined(ctx.king)) {
          if (piece.role === 'royalknight') {
            const occ = this.board.occupied.without(square);
            for (const to of pseudo) {
              if (this.royalKnightAttackers(to, opposite(this.turn), occ).nonEmpty()) pseudo = pseudo.without(to);
            }
            return pseudo.union(this.castlingDestExt('a', ctx)).union(this.castlingDestExt('h', ctx));
          }
    
          if (ctx.checkers.nonEmpty()) {
            const checker = ctx.checkers.singleSquare();
            if (!defined(checker)) return SquareSet.empty();
            pseudo = pseudo.intersect(between(checker, ctx.king).with(checker));
          }
    
          if (ctx.blockers.has(square)) pseudo = pseudo.intersect(ray(square, ctx.king));
        }
    
        if (legal) pseudo = pseudo.union(legal);
        return pseudo;
    }
}

function rookCastlesTo(color: Color, side: CastlingSide): Square {
    return color === 'white' ? (side === 'a' ? 3 : 5) : side === 'a' ? 59 : 61;
}

export class Zoo extends Chess {
    constructor() {
        super("zoo");
    }

    static default(): Chess {
        const pos = new this();
        pos.board = Board.zoo() as StdBoard;
        pos.pockets = undefined;
        pos.turn = 'white';
        pos.castles = Castles.default();
        pos.epSquare = undefined;
        pos.remainingChecks = undefined;
        pos.halfmoves = 0;
        pos.fullmoves = 1;
        return pos;
    }

    isCheck(): boolean {        
        const royalKnight = (this.board as Board).royalKnightOf(this.turn);
        return defined(royalKnight) && this.royalKnightAttackers(royalKnight, opposite(this.turn), this.board.occupied).nonEmpty();
    }

    isEnd(ctx?: Context): boolean {
        return [...(this.board as Board).royalknight].length < 2;
    }
}