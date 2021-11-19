import { Color, ROLES as STD_ROLES, RULES as STD_RULES, Square } from 'chessops/types';

export const ROLES = ['royalknight', 'unicorn', 'elephant', 'corporal', 'zebra', 'giraffe', ...STD_ROLES] as const;

export type Role = typeof ROLES[number];

/**
 * Indexable by 
 * std : `pawn`, `knight`, `bishop`, `rook`, `queen` and `king`
 * var : `royalknight`, `unicorn`, `elephant`, 'corporal`, `zebra`, `giraffe`
 */
export type ByRole<T> = {
  [role in Role]: T;
};

export interface Piece {
  role: Role;
  color: Color;
  promoted?: boolean;
}

export interface NormalMove {
  from: Square;
  to: Square;
  promotion?: Role;
}

export interface DropMove {
  role: Role;
  to: Square;
}

export type Move = NormalMove | DropMove;

export const RULES = ['zoo', 'explode', 'variantChess', ...STD_RULES];

export type Rules = typeof RULES[number];