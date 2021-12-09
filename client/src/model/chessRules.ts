import { Role, Rules } from "./variantType";

export const CHECK = ["CheckMate", "XCheck", "Explode", "Horde"];
export type CheckWin = typeof CHECK[number]; 

export const EXPLODE = ["Atomic"];
export type ExplodeWin = typeof EXPLODE[number]; 

export const EAT = ["AntiChess"];
export type EatWin = typeof EAT[number];

export const MOVE = ["RaceTop", "KingHill"];
export type MoveWin = typeof MOVE[number];

export interface Win {
    type: CheckWin | ExplodeWin | MoveWin | EatWin
    piece: Role | "all"
    repeat?: number
}

export const PIECE_DIED = ["ExploseArround", "ExploseRowColumn"];
export type OnPieceDied = typeof PIECE_DIED[number];

export interface RulesList {
    canBeCheck?: boolean,
    onPieceDied?: OnPieceDied,
    toWin: Win[],
    pieces: Role[],
    nbTotalPieces: number
}

const checkMateKing: Win = {type: "CheckMate" as CheckWin, piece: "king" as Role};
const traditionalPieces: Role[] = ["king", "queen", "knight", "bishop", "rook", "pawn"];

const allRules: Map<Rules, RulesList> = new Map([
    ["chess", {
        canBeCheck: true,
        toWin: [checkMateKing],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList],
    ["3check", {
        canBeCheck: true,
        toWin: [checkMateKing, {type: "XCheck", piece: "king", repeat: 3 /* Nb Check */}],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList], 
    ["racingkings", {
        canBeCheck: false,
        toWin: [{type: "RaceTop", piece: "king" as Role}],
        pieces: ["king", "queen", "knight", "bishop", "rook"],
        nbTotalPieces: 16
    } as RulesList],
    ["kingofthehill", {
        canBeCheck: true,
        toWin: [{type: "KingHill", piece: "king" as Role}],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList],
    ["atomic", {
        canBeCheck: true,
        onPieceDied: "ExploseArround",
        toWin: [checkMateKing, {type: "Explode", piece: "king" as Role}],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList],
    ["explode", {
        canBeCheck: true,
        onPieceDied: "ExploseRowColumn",
        toWin: [checkMateKing],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList], 
    ["zoo", {
        canBeCheck: true,
        toWin: [{type: "CheckMate" as CheckWin, piece: "royalknight" as Role}],
        pieces: ["corporal", "elephant", "royalknight", "giraffe", "unicorn", "zebra"],
        nbTotalPieces: 32
    } as RulesList],
    ["horde", {
        canBeCheck: true,
        toWin: [checkMateKing],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    } as RulesList],
    ["antichess", {
        canBeCheck: true,
        toWin: [{type: "AntiChess" as EatWin, piece: "all"}],
        pieces: traditionalPieces,
        nbTotalPieces: 32
    }]
]);

export function getRulesList(rules: string): RulesList {
    return allRules.get(rules as Rules) || {} as RulesList;
}