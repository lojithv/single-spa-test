import { Routes, RouterLink, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-templates',
  template: `
    <div style="padding: 10px; border: 1px dashed #ccc;">
      <h2>Templates List</h2>
      <p>This page is managed by <strong>Angular</strong>.</p>
      <ul>
        <li><a routerLink="/app/templates/1">Standard Template</a></li>
        <li><a routerLink="/app/templates/2">Custom Template</a></li>
      </ul>
    </div>
  `,
  imports: [RouterLink]
})
export class TemplatesComponent {}

@Component({
  standalone: true,
  selector: 'app-project',
  template: `
    <div style="padding: 10px; border: 1px dashed #ccc;">
      <h2>Project Details</h2>
      <p>This section is managed by <strong>Angular</strong>.</p>
      <nav>
        <a routerLink="./">Overview</a> | 
        <a routerLink="./estimate">Estimate</a> | 
        <a routerLink="./specifications">Specifications</a> |
        <a href="/app/project/123/schedule">Schedule (React)</a>
      </nav>
      <div style="margin-top: 20px; padding: 10px; background: #fff;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  imports: [RouterLink, RouterOutlet]
})
export class ProjectComponent {}

@Component({
  standalone: true,
  template: '<h3>Project Overview</h3><p>General project information and status.</p>'
})
export class ProjectOverviewComponent {}

@Component({
  standalone: true,
  template: '<h3>Project Estimate</h3><p>Detailed cost breakdown and budgeting.</p>'
})
export class ProjectEstimateComponent {}

export const routes: Routes = [
  { path: 'app/templates', component: TemplatesComponent },
  { 
    path: 'app/project/:projectId', 
    component: ProjectComponent,
    children: [
      { path: '', component: ProjectOverviewComponent },
      { path: 'estimate', component: ProjectEstimateComponent },
      { path: 'specifications', component: ProjectOverviewComponent },
      { path: 'request-bids', component: ProjectOverviewComponent },
    ]
  }
];
