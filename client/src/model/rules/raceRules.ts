import { ChessRules } from "./chessRules";

export class RaceRules extends ChessRules {

    defaultBoardFen(): string {
        return "8/8/8/8/8/8/krbnNBRK/qrbnNBRQ";
    }

    kingCanBeCheck(): boolean {
        return false;
    }
}