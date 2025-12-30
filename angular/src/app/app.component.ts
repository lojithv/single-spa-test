import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'builderbid-angular';
  user: any = null;

  private handleLogin = (event: any) => {
    this.user = event.detail.user;
  };

  private handleLogout = () => {
    this.user = null;
  };

  ngOnInit() {
    window.addEventListener('builderbid:auth:login', this.handleLogin);
    window.addEventListener('builderbid:auth:logout', this.handleLogout);
  }

  ngOnDestroy() {
    window.removeEventListener('builderbid:auth:login', this.handleLogin);
    window.removeEventListener('builderbid:auth:logout', this.handleLogout);
  }
}
