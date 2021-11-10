export interface Direction {
    x: number, 
    y: number
}

export function inverse(dir: Direction): Direction {
    return {x: -dir.x, y: -dir.y} as Direction;
}

export const MAX: number = 8;

export const ROW_FORWARD: Direction = { x: 1, y: 0 };
export const ROW_BACKWARD: Direction = inverse(ROW_FORWARD);
export const ROW: Direction[] = [ROW_FORWARD, ROW_BACKWARD];

export const COL_FORWARD: Direction = { x: 0, y: 1 };
export const COL_BACKWARD: Direction = inverse(COL_FORWARD);
export const COL: Direction[] = [COL_FORWARD, COL_BACKWARD];

export const DIAG_TL_FORWARD: Direction = { x: 1, y: -1 };
export const DIAG_TL_BACKWARD: Direction = inverse(DIAG_TL_FORWARD);
export const DIAG_TL: Direction[] = [DIAG_TL_FORWARD, DIAG_TL_BACKWARD];
 
export const DIAG_BL_FORWARD: Direction = { x: 1, y: 1 };
export const DIAG_BL_BACKWARD: Direction = inverse(DIAG_BL_FORWARD);
export const DIAG_BL: Direction[] = [DIAG_BL_FORWARD, DIAG_BL_BACKWARD];

export const DIAGS: Direction[] = [...DIAG_TL, ...DIAG_BL];

export const L_RIGHT_FORWARD: Direction = {x: 2, y: 1};
export const L_LEFT_FORWARD: Direction = {x: -2, y: 1};
export const L_TOP_RIGHT_FORWARD: Direction = {x: 1, y: 2};
export const L_TOP_LEFT_FORWARD: Direction = {x: -1, y: 2};
export const L_RIGHT_BACKWARD: Direction = inverse(L_RIGHT_FORWARD);
export const L_LEFT_BACKWARD: Direction = inverse(L_LEFT_FORWARD);
export const L_TOP_RIGHT_BACKWARD: Direction = inverse(L_TOP_RIGHT_FORWARD);
export const L_TOP_LEFT_BACKWARD: Direction = inverse(L_TOP_LEFT_FORWARD);
export const L: Direction[] = [L_RIGHT_FORWARD, L_LEFT_FORWARD, L_TOP_RIGHT_FORWARD, L_TOP_LEFT_FORWARD, 
    L_RIGHT_BACKWARD, L_LEFT_BACKWARD, L_TOP_RIGHT_BACKWARD, L_TOP_LEFT_BACKWARD];
 