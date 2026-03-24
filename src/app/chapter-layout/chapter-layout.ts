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
  // 2. Inject the Router into the constructor
  constructor(private router: Router) {}

  // 3. The method triggered by your back button
  goToMenu(): void {
    // Navigates right back to the root path (your cinematic menu)
    this.router.navigate(['/']);
  }
}
