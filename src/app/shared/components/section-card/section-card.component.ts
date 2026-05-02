import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-section-card',
  imports: [MatCardModule],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss',
})
export class SectionCardComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly description = input.required<string>();
}
