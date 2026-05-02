import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-content-editor',
  imports: [MatCardModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss',
})
export class ContentEditorComponent {}
