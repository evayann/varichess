import { APP_INITIALIZER, NgModule } from "@angular/core";
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

/* #region  Service */
import { UiThemesService } from './ui-themes.service';
import { LocalStorageService } from './local-storage.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
/* #endregion Service */

export function themeFactory(themeService: UiThemesService) {
  return () => themeService.setThemeOnStart();
}

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
    
    AppRoutingModule,
         ServiceWorkerModule.register('ngsw-worker.js', {
           enabled: environment.production,
           // Register the ServiceWorker as soon as the app is stable
           // or after 30 seconds (whichever comes first).
           registrationStrategy: 'registerWhenStable:30000'
         })
  ],
  providers: [
    UiThemesService,
    LocalStorageService,
    { provide: APP_INITIALIZER, useFactory: themeFactory, deps: [UiThemesService], multi: true },
  ],
  exports: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
