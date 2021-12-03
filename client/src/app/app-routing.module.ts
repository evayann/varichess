import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { VariantRulesComponent } from "./variant-rules/variant-rules.component";

const routes: Routes = [
  {
    path: "", // Redirection when open site
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path: "variant",
    component: VariantRulesComponent
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
