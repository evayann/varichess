export function parseSquare(nb: number): [number, number] {
    return [nb % 8, 7 - Math.floor(nb / 8)];
}

export function toSquare(x: number, y: number): number {
    return x + (7 - y) * 8;
}