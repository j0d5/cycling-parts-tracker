import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '@cpt/client/data-access';
import { BikeComponent } from '@cpt/client/ui-components';
import { Bike } from '@cpt/shared/domain';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  selector: 'cpt-feature-dashboard',
  standalone: true,
  imports: [CommonModule, BikeComponent],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  bikeItems$ = new BehaviorSubject<Bike[]>([]);

  trackBike(idx: number, todo: Bike) {
    return todo.id;
  }

  ngOnInit(): void {
    this.refreshItems();
  }

  refreshItems() {
    this.apiService
      .getAllBikeItems()
      .pipe(take(1))
      .subscribe((items) => this.bikeItems$.next(items));
  }

  toggleComplete(bike: Bike) {
    this.apiService
      .updateBike(bike.id, { archived: !bike.archived })
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  deleteBike({ id }: Bike) {
    this.apiService
      .deleteBike(id)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  editBike(bike: Bike) {
    this.apiService
      .updateBike(bike.id, bike)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }
}
