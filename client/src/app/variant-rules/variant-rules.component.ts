import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'model/variantType';
import { getRulesList, RulesList } from 'model/chessRules';
import { getPieceAcronyme } from 'model/util';
import { ActivatedRoute } from '@angular/router';

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

  toPiece(piece: Role | "All") {
    return piece === "All" ? "allw": getPieceAcronyme({role: piece, color: "white"});
  }

}