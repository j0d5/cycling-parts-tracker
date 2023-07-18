import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '@cpt/client/data-access';

@Component({
  selector: 'cycling-parts-tracker-feature-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent {
  private readonly apiService = inject(ApiService);

  bikeItems$ = this.apiService.getAllBikeItems();
}
