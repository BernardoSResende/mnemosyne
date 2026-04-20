import { Component, HostListener, NgZone, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

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
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
})
export class Menu implements OnInit {
  constructor(
    private router: Router,
    private ngZone: NgZone,
  ) {}
  // --- PARALLAX STATE ---
  mouseX = 0;
  mouseY = 0;
  usingGyroscope = false; // Tracks if physical sensors have taken over

  // --- MOBILE CURTAIN STATE (SIGNALS) ---
  isMobile = signal(false);
  curtainDismissed = signal(false);

  // --- ANIMATION STATE (SIGNALS) ---
  isEmbarking = signal(false);
  isSpawningCircles = signal(false);
  isVortexing = signal(false); // New: The Orbit phase
  isMenuOpen = signal(false); // New: Final landing state
  isSettled = signal(false); // New: After the menu is fully open
  enteringChapterId = signal<string | null>(null); // New: Track which chapter is being entered for the sidebar highlight

  // --- CAROUSEL STATE ---
  activeChapterIndex = signal(0);

  // Automatically updates whenever activeChapterIndex changes!
  activeChapter = computed(() => this.chapters()[this.activeChapterIndex()]);

  // --- CHAPTER DATA ---
  chapters = signal<Chapter[]>([
    {
      id: 'odyssey',
      title: 'I. ODYSSEY',
      description: 'Embark in my international internship experience in Germany.',
      actionText: 'SAIL',
      titleFont: '"Quintessential",serif',
      imageUrl: 'Odyssey.png',
      primaryColor: '#2A9D8F',
      secondaryColor: '#264653',
    },
    {
      id: 'oceanus',
      title: 'II. OCEANUS',
      description: 'See the world (or a tiny part of it) through my lens',
      actionText: 'EXPLORE',
      titleFont: '"Fontdiner Swanky", serif',
      imageUrl: 'Oceanus.png',
      primaryColor: '#E07A5F',
      secondaryColor: '#F4F1DE',
    },
    {
      id: 'daedalus',
      title: 'III. DAEDALUS',
      description: 'Creativity is a big part of my life. These are some of my projects.',
      actionText: 'FORGE',
      titleFont: '"Special Elite", system-ui',
      imageUrl: 'Daedalus.png',
      primaryColor: '#FAAE7B',
      secondaryColor: '#432371',
    },
    {
      id: 'talos',
      title: 'IV. TALOS',
      description: 'Software is the foundation of our world. Here are some of my contributions.',
      actionText: 'BUILD',
      titleFont: '"Girassol", serif',
      imageUrl: 'Talos.png',
      primaryColor: '#F9A8BB',
      secondaryColor: '#1A1265',
    },
    {
      id: 'elysium',
      title: 'V. ELYSIUM',
      description: 'Art is peace in amidst chaos. These are a few of my favorite works.',
      actionText: 'CLEANSE',
      titleFont: '"Eagle Lake", serif',
      imageUrl: 'Elysium.png',
      primaryColor: '#B5BEDD',
      secondaryColor: '#470B24',
    },
    {
      id: 'kairos',
      title: 'VI. KAIROS',
      description: 'The only thing we really have is the present. This is my current endeavor.',
      actionText: 'DIVE',
      titleFont: '"Faculty Glyphic", serif',
      imageUrl: 'Kairos.png',
      primaryColor: '#F6E3E5',
      secondaryColor: '#213F95',
    },
    {
      id: 'prometheus',
      title: 'VII. PROMETHEUS',
      description:
        "Futureseeing is a fool's game, but goals keep us moving. Here's where I'm headed.",
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
    // Only allow navigation if the menu is actually open
    if (this.isMenuOpen()) {
      this.activeChapterIndex.set(index);
    }
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

    // Check if the device is mobile on initial load
    if (window.innerWidth <= 768) {
      this.isMobile.set(true);
    } else {
      // If desktop, instantly dismiss the curtain state
      this.curtainDismissed.set(true);
    }
  }

  unlockExperience(): void {
    this.requestGyroPermissions();
    this.curtainDismissed.set(true); // Fades the curtain out
  }

  requestGyroPermissions(): void {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            this.enableGyro();
          }
        })
        .catch(console.error);
    } else {
      this.enableGyro();
    }
  }

  enableGyro(): void {
    this.usingGyroscope = true;
    // Register outside Angular's zone so we don't trigger CD on every gyro tick (~60Hz).
    // We re-enter the zone manually inside the handler only when values actually change.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
    });
  }

  handleOrientation(event: DeviceOrientationEvent): void {
    // Ignore gyro input during locked animation sequences, matching the mouse behavior
    if ((this.isEmbarking() || this.isSpawningCircles()) && !this.isMenuOpen()) {
      return;
    }

    const gamma = event.gamma || 0; // left/right tilt [-90, 90]
    const beta = event.beta || 0; // front/back tilt [-180, 180]
    const maxTilt = 45;

    // X AXIS
    const constrainedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
    // Normalize to -1..1, then scale to match the mouse-driven magnitude.
    // Mouse path produces ~ (viewport/2)/50 => roughly ±10 on a phone, so we scale
    // the normalized gyro value by 15 to get visible, mouse-equivalent parallax.
    const normalizedX = constrainedGamma / maxTilt;

    // Y AXIS (Offset by 45 degrees for natural hand position)
    const normalizedBeta = beta - 45;
    const constrainedBeta = Math.max(-maxTilt, Math.min(maxTilt, normalizedBeta));
    const normalizedY = constrainedBeta / maxTilt;

    const PARALLAX_SCALE = 15;
    const nextX = normalizedX * PARALLAX_SCALE;
    const nextY = normalizedY * PARALLAX_SCALE;

    // Only re-enter Angular's zone if the value actually changed enough to matter.
    // This keeps CD cost low while still driving the CSS vars.
    if (Math.abs(nextX - this.mouseX) < 0.05 && Math.abs(nextY - this.mouseY) < 0.05) {
      return;
    }

    this.ngZone.run(() => {
      this.mouseX = nextX;
      this.mouseY = nextY;
    });
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
    if (this.usingGyroscope) return;

    if ((this.isEmbarking() || this.isSpawningCircles()) && !this.isMenuOpen()) {
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.mouseX = (centerX - event.clientX) / 50;
    this.mouseY = (centerY - event.clientY) / 50;
  }

  // --- SCROLL WHEEL NAVIGATION ---
  // Tracks the last wheel event time so we only advance one chapter per gesture,
  // not one per raw tick (trackpads especially fire dozens per swipe).
  private lastWheelTime = 0;
  private readonly wheelCooldown = 900; // ms, matches the carousel transition feel

  @HostListener('document:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    // Only intercept scroll when we're in the chapter menu
    if (!this.isMenuOpen() || !this.isSettled()) return;

    // Ignore while a chapter dive is in progress
    if (this.enteringChapterId() !== null) return;

    const now = Date.now();
    if (now - this.lastWheelTime < this.wheelCooldown) return;

    // Require a meaningful delta to filter out inertial noise at the tail of a swipe
    if (Math.abs(event.deltaY) < 10) return;

    this.lastWheelTime = now;

    if (event.deltaY > 0) {
      this.nextChapter();
    } else {
      this.prevChapter();
    }
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
          setTimeout(() => {
            this.isSettled.set(true);
          }, 2500);
        }, 1200);
      }, 5000);
    }, 1000);
  }
  /**
   * Rewinds the entire experience back to the start.
   */

  /**
   * Triggers the liquid dive transition into a specific chapter.
   */
  enterChapter(chapterId: string): void {
    // 1. Lock the button and start the explosion
    this.enteringChapterId.set(chapterId);

    setTimeout(() => {
      // If chapterId is 'daedalus', this navigates to localhost:4200/daedalus
      // Which cleanly loads the standalone DaedalusComponent!
      this.router.navigate([`/chapter`, chapterId]);
    }, 3500);
  }

  goBack(): void {
    this.isMenuOpen.set(false);
    this.isVortexing.set(false);
    this.isEmbarking.set(false);
    this.isSpawningCircles.set(false);
    this.isSettled.set(false);
  }
}
