import { Routes } from '@angular/router';
import { App } from './app.js';
import { Odyssey } from './chapters/odyssey/odyssey.js';
import { Daedalus } from './chapters/daedalus/daedalus.js';
import { Oceanus } from './chapters/oceanus/oceanus.js';
import { Talos } from './chapters/talos/talos.js';
import { Elysium } from './chapters/elysium/elysium.js';
import { Kairos } from './chapters/kairos/kairos.js';
import { Prometheus } from './chapters/prometheus/prometheus.js';
import { ChapterLayout } from './chapter-layout/chapter-layout.js';
import { Menu } from './menu/menu.js';

export const routes: Routes = [
  { path: '', component: Menu },

  {
    path: 'chapter',
    component: ChapterLayout,
    children: [
      { path: 'odyssey', component: Odyssey },
      { path: 'oceanus', component: Oceanus },
      { path: 'daedalus', component: Daedalus },
      { path: 'talos', component: Talos },
      { path: 'elysium', component: Elysium },
      { path: 'kairos', component: Kairos },
      { path: 'prometheus', component: Prometheus },
    ],
  },
  { path: '**', redirectTo: '' },
];
