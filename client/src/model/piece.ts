export enum Piece {
    r, n, b, q, k, p,
    R, N, B, Q, K, P
}

export function isWhite(p: Piece): boolean {
    return [Piece.r, Piece.n, Piece.b, Piece.q, Piece.k, Piece.p].includes(p);
}