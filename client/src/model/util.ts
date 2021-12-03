import { Piece } from "./variantType";

export function parseSquare(nb: number): [number, number] {
    return [nb % 8, 7 - Math.floor(nb / 8)];
}

export function toSquare(x: number, y: number): number {
    return x + (7 - y) * 8;
}

export function getPieceAcronyme(p: Piece): string {
    let type: string = p.role[0];
    
    if (p.role === "knight") type = "n";
    else if (p.role === "royalknight") type = "rk";
    
    return type + p.color[0];
  }