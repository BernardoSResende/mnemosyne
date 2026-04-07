import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // 1. Import Router & RouterOutlet

@Component({
  selector: 'app-chapter-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './chapter-layout.html',
  styleUrls: ['./chapter-layout.scss'],
})
export class ChapterLayout {
  constructor(private router: Router) {}

  goToMenu(): void {
    this.router.navigate(['/']);
  }
}
