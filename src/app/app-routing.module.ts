import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExplorerComponent } from './modules/explorer.component';

const routes: Routes = [
  { path: '', component: ExplorerComponent, },
  { path: '**', component: ExplorerComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
