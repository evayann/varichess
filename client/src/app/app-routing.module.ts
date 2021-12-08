import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { VariantRulesComponent } from "./variant-rules/variant-rules.component";

const routes: Routes = [
  {
    path: "", // Redirection when open site
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path: "variant/:variant",
    component: VariantRulesComponent
  },
  {
    path: "play/:variant/:3d",
    component: GameComponent
  },
  {
    path: "play/:variant",
    component: GameComponent
  },
  {
    path: "**", // 404
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
