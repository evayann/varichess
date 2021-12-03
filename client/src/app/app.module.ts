import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { BoardComponent } from './board/board.component';
import { PieceComponent } from './piece/piece.component';
import { PositionComponent } from './position/position.component';
import { RulesComponent } from './rules/rules.component';
import { OverlayComponent } from './overlay/overlay.component';
import { VariantRulesComponent } from './variant-rules/variant-rules.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameComponent } from './game/game.component';
import { RulesPieceComponent } from './rules-piece/rules-piece.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PieceComponent,
    PositionComponent,
    RulesComponent,
    OverlayComponent,
    VariantRulesComponent,
    PageNotFoundComponent,
    GameComponent,
    RulesPieceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,

    FormsModule,
    ReactiveFormsModule,
    
    AppRoutingModule
  ],
  exports: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
