import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/auth/login/login.component";
import { PageListComponent } from "./features/pages/page-list/page-list.component";
import { PageFormComponent } from "./features/pages/page-form/page-form.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "main",
    canActivate: [authGuard],
    children: [
      {
        path: "",
        component: PageListComponent,
      },
      {
        path: "create",
        component: PageFormComponent,
      },
      {
        path: "edit/:id",
        component: PageFormComponent,
      },
    ],
  },
  {
    path: "**",
    redirectTo: "main",
  },
];
