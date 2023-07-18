import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '@cpt/client/data-access';
import { BikeComponent } from '@cpt/client/ui-components';
import { Bike } from '@cpt/shared/domain';
import { take } from 'rxjs';

@Component({
  selector: 'cycling-parts-tracker-feature-dashboard',
  standalone: true,
  imports: [CommonModule, BikeComponent],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  bikeItems$ = this.apiService.getAllBikeItems();

  trackTodo(idx: number, todo: Bike) {
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

  toggleComplete(todo: Bike) {
    this.apiService
      .updateBike(todo.id, { archived: !todo.archived })
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  deleteTodo({ id }: Bike) {
    this.apiService
      .deleteBike(id)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }
}
