import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toTitle } from 'app/utilites';
import { getRulesList, RulesList } from "model/chessRules";
import { Chess } from 'model/variantChess';
import { Role } from 'model/variantType';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('game') game!: ElementRef;
  @Input() threeD: boolean = false;
  @Input() variant: string = "chess";
  chess: Chess | undefined;
  private rules: RulesList | undefined;

  waves: number[] = [1, 2, 3, 4, 5];
  
  maxPieces: string = "00000000000000000000000000000000";
  nbPieces: number = 32;
  private currentY: number = 0;
  private lastUpdate: number | undefined;
  private totalTime: number = 0;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const variant = params["variant"];
      this.rules = getRulesList(variant);
      this.variant = toTitle(variant);
      this.threeD = params["3d"] === "true";
    });
  }

  ngAfterViewInit() {
    this.updateWaves();
  }

  getPiecesList(): Role[] {
    return this.rules?.pieces || [] as Role[];
  }

  getRulesList(): RulesList {
    return this.rules || {} as RulesList;
  }

  setChess(chess: Chess) {
    this.chess = chess;
  }
   
  getY() {
    const nbPieces: number = this.rules?.nbTotalPieces || 32;
    this.nbPieces = !this.chess ? nbPieces : [... this.chess?.board].length;
    return .05 + (this.nbPieces / nbPieces) * .7;
  }

  calculateWavePoints(factor: number,
      waveRatio: number,
      speed: number = 1, waveDelta: number = 20, 
      wavePoints: number = 10, waveScaleSpeed: number = 100) {
    let points: Array<{x: number, y: number}> = [];
    const el = this.game.nativeElement;
    const waveWidth: number = el.clientWidth;

    if (this.currentY !== this.getY()) {
      const jump: number = Math.abs(this.getY() - this.currentY) / waveScaleSpeed;
      this.currentY = this.currentY > this.getY() + .001 ? this.currentY - jump : this.getY(); 
    }

    for (var i = 0; i <= wavePoints; i++) {
      const x = i / wavePoints * waveWidth;
      const sinSeed = (factor + (i + i % wavePoints)) * speed * 100;
      const sinHeight = Math.sin(sinSeed / 100) * waveDelta;
      const waveHeight: number = (this.currentY + (waveRatio / 6)) * el.clientHeight;
      const yPos = Math.sin(sinSeed / 100) * sinHeight + waveHeight;
      points.push({x: x, y: yPos});
    }
  
    return points;
  }

  buildPath(points: Array<{x: number, y: number}>) {
    const strToPt = (key: string, pt: {x: number, y: number}) => key + pt.x + " " + pt.y;

    let path = strToPt("M ", points[0]);
  
    let cp0 = {
      x: (points[1].x - points[0].x) / 2,
      y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
    };
  
    path += strToPt(" C ", cp0) + strToPt(" ", cp0) + strToPt(" ", points[1]);
  
    var prevCp = cp0;
    var inverted = -1;
  
    for (var i = 1; i < points.length-1; i++) {
      var cp1 = {
        x: (points[i].x - prevCp.x) + points[i].x,
        y: (points[i].y - prevCp.y) + points[i].y
      };
  
      path += strToPt(" C ", cp1) + strToPt(" ", cp1) + strToPt(" ", points[i + 1])
      prevCp = cp1;
      inverted = -inverted;
    };
  
    const width: number = this.game.nativeElement.clientWidth;
    const height: number = this.game.nativeElement.clientHeight;
    path += " L " + width + " " + height;
    path += " L 0 " + height + " Z";
    return path;
  }

  updateWaves() {
    const now: number = window.Date.now();
    if (this.lastUpdate) {
      const elapsed = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
  
      this.totalTime += elapsed;
      
      for (let id = 5; id > 1; id--) {
        const factor: number = (id / 5 * Math.PI + this.totalTime) * Math.PI;
        document.getElementById("wave" + id)?.setAttribute("d", 
          this.buildPath(this.calculateWavePoints(factor, id / 5, 1, Math.max(1, 30 - this.nbPieces)))
          );
      }
    } else {
      this.lastUpdate = now;
    }

    window.requestAnimationFrame(this.updateWaves.bind(this));
  }
}
