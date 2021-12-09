import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'model/variantType';
import { getRulesList, RulesList } from 'model/chessRules';
import { getPieceAcronyme } from 'model/util';
import { ActivatedRoute } from '@angular/router';
import { toTitle } from 'app/utilites';
@Component({
  selector: 'app-variant-rules',
  templateUrl: './variant-rules.component.html',
  styleUrls: ['./variant-rules.component.scss']
})
export class VariantRulesComponent implements OnInit {

  @Input() variant!: string;
  @Input() rules!: RulesList;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.variant = params["variant"];
      this.rules = getRulesList(this.variant);
    })
  }

  toPiece(piece: Role | "all", color: "white" | "black" = "white") {
    return piece === "all" ? "all" + color[0]: getPieceAcronyme({role: piece, color: color});
  }

  toTitle(str: string): string {
    return toTitle(str);
  }

}