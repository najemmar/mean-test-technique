import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: 'articles/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },
  { path: 'new-articles', component: ArticleFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Writer', 'Editor', 'Admin'] } },
  { path: 'articles/:id/edit', component: ArticleFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Writer', 'Editor', 'Admin'] } },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] } },
  { path: '', redirectTo: '/articles', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }