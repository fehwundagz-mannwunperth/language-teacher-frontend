import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-blog-editor',
  imports: [MatCardModule],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent {}
