import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-public-layout',
  imports: [MatButtonModule, MatMenuModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  protected readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Lessons', path: '/lessons' },
    { label: 'Prices', path: '/prices' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];
}
