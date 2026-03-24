import { Component, HostListener, OnInit, signal, computed } from '@angular/core';

/**
 * Interface representing the positioning and animation data
 * for the V-formation circles.
 */
interface Circle {
  x: number;
  y: number;
  delay: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  actionText: string;
  titleFont: string;
  imageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  // --- PARALLAX STATE ---
  mouseX = 0;
  mouseY = 0;

  // --- ANIMATION STATE (SIGNALS) ---
  isEmbarking = signal(false);
  isSpawningCircles = signal(false);
  isVortexing = signal(false); // New: The Orbit phase
  isMenuOpen = signal(false); // New: Final landing state

  // --- CAROUSEL STATE ---
  activeChapterIndex = signal(0);

  // Automatically updates whenever activeChapterIndex changes!
  activeChapter = computed(() => this.chapters()[this.activeChapterIndex()]);

  // --- CHAPTER DATA ---
  chapters = signal<Chapter[]>([
    {
      id: 'odyssey',
      title: 'I. ODYSSEY',
      description: 'The journey that forged the traveler',
      actionText: 'SAIL',
      titleFont: '"Quintessential",serif',
      imageUrl: 'Odyssey.png',
      primaryColor: '#2A9D8F',
      secondaryColor: '#264653',
    },
    {
      id: 'oceanus',
      title: 'II. OCEANUS',
      description: 'Dissolving the borders of a world once small.',
      actionText: 'EXPLORE',
      titleFont: '"Fontdiner Swanky", serif',
      imageUrl: 'Oceanus.png',
      primaryColor: '#E07A5F',
      secondaryColor: '#F4F1DE',
    },
    {
      id: 'daedalus',
      title: 'III. DAEDALUS',
      description: 'The alchemy of translating thought into form.',
      actionText: 'CREATE',
      titleFont: '"Special Elite", system-ui',
      imageUrl: 'Daedalus.png',
      primaryColor: '#FAAE7B',
      secondaryColor: '#432371',
    },
    {
      id: 'talos',
      title: 'IV. TALOS',
      description: 'The logical pulse of a machine born to work.',
      actionText: 'BUILD',
      titleFont: '"Girassol", serif',
      imageUrl: 'Talos.png',
      primaryColor: '#F9A8BB',
      secondaryColor: '#1A1265',
    },
    {
      id: 'elysium',
      title: 'V. ELYSIUM',
      description: 'A stillness found where the noise of the world fades.',
      actionText: 'BREATHE',
      titleFont: '"Eagle Lake", serif',
      imageUrl: 'Elysium.png',
      primaryColor: '#B5BEDD',
      secondaryColor: '#470B24',
    },
    {
      id: 'kairos',
      title: 'VI. KAIROS',
      description: 'Immersed in the vastness of the singular now.',
      actionText: 'DIVE',
      titleFont: '"Faculty Glyphic", serif',
      imageUrl: 'Kairos.png',
      primaryColor: '#F6E3E5',
      secondaryColor: '#213F95',
    },
    {
      id: 'prometheus',
      title: 'VII. PROMETHEUS',
      description: 'The blueprint of a fire waiting for its spark.',
      actionText: 'IGNITE',
      titleFont: '"Rye", system-ui',
      imageUrl: 'Prometheus.png',
      primaryColor: '#E30B5C',
      secondaryColor: '#2E1E1F',
    },
  ]);

  // --- NAVIGATION METHODS ---

  /**
   * Jumps to a specific chapter when a sidebar circle is clicked.
   */
  goToChapter(index: number): void {
    this.activeChapterIndex.set(index);
  }

  /**
   * Cycles to the previous chapter (loops to the end if at the beginning).
   */
  prevChapter(): void {
    const current = this.activeChapterIndex();
    const total = this.chapters().length;
    // The (current - 1 + total) % total ensures we safely loop backwards
    this.activeChapterIndex.set((current - 1 + total) % total);
  }

  /**
   * Cycles to the next chapter (loops to the start if at the end).
   */
  nextChapter(): void {
    const current = this.activeChapterIndex();
    const total = this.chapters().length;
    this.activeChapterIndex.set((current + 1) % total);
  }

  handleUpAction(): void {
    if (this.activeChapterIndex() === 0) {
      this.goBack();
    } else {
      this.prevChapter();
    }
  }

  // --- DATA PROPERTIES ---
  numberOfCircles = 7;
  circles: Circle[] = [];

  // --- LIFECYCLE ---
  ngOnInit(): void {
    this.generateCircles();
  }

  /**
   * Calculates the staggered V-formation layout for the background circles.
   */
  generateCircles(): void {
    const mid = Math.floor(this.numberOfCircles / 2);

    this.circles = Array.from({ length: this.numberOfCircles }).map((_, i) => {
      const distance = Math.abs(i - mid);

      return {
        x: i - mid, // Horizontal offset: -2, -1, 0, 1, 2
        y: -distance, // Vertical offset creates the 'V' shape
        delay: distance * 0.2, // Staggered spawn timing
      };
    });
  }

  // --- EVENT LISTENERS ---

  /**
   * Tracks mouse movement to drive the parallax effect.
   * Locked during active animation sequences to prevent jitter.
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isEmbarking() || this.isSpawningCircles()) {
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.mouseX = (centerX - event.clientX) / 50;
    this.mouseY = (centerY - event.clientY) / 50;
  }

  // --- CORE ACTIONS ---

  /**
   * Triggers the sequence: Spawns circles -> Braces -> Plunges -> Resets.
   */
  startEmbark(): void {
    // Stage 1: Lock parallax and show V-formation
    this.isSpawningCircles.set(true);
    this.mouseX = 0;
    this.mouseY = 0;

    // 1. Start the 5s Plunge
    setTimeout(() => {
      this.isEmbarking.set(true);

      // 2. Wait for Plunge to finish (5s), then Vortex for 1.2s
      setTimeout(() => {
        this.isVortexing.set(true);

        // 3. Slingshot to the Sidebar and open the Menu
        setTimeout(() => {
          this.isVortexing.set(false);
          this.isMenuOpen.set(true);
        }, 1200);
      }, 5000);
    }, 1000);
  }
  /**
   * Rewinds the entire experience back to the start.
   */
  goBack(): void {
    this.isMenuOpen.set(false);
    this.isVortexing.set(false);
    this.isEmbarking.set(false);
    this.isSpawningCircles.set(false);
  }
}
