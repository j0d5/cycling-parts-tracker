import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BikeService } from '@cpt/client/data-access';
import { BikeComponent } from '@cpt/client/ui-components';
import { Bike, CreateBike } from '@cpt/shared/domain';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  selector: 'cpt-feature-dashboard',
  standalone: true,
  imports: [CommonModule, BikeComponent, FontAwesomeModule],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent implements OnInit {
  private readonly bikeService = inject(BikeService);
  faPlusSquare = faPlusSquare;

  bikeItems$ = new BehaviorSubject<Bike[]>([]);

  addingBike = false;

  trackBike(idx: number, todo: Bike) {
    return todo.id;
  }

  ngOnInit(): void {
    this.refreshItems();
  }

  refreshItems() {
    this.bikeService
      .getAllBikeItems()
      .pipe(take(1))
      .subscribe((items) => this.bikeItems$.next(items));
  }

  triggerEmptyBike() {
    this.addingBike = !this.addingBike;
  }

  toggleArchive(bike: Bike) {
    this.bikeService
      .updateBike(bike.id, { archived: !bike.archived })
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  deleteBike({ id }: Bike) {
    this.bikeService
      .deleteBike(id)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  editBike(bike: Bike) {
    this.bikeService
      .updateBike(bike.id, bike)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
  }

  createBike(data: CreateBike) {
    this.bikeService
      .createBike(data)
      .pipe(take(1))
      .subscribe(() => {
        this.refreshItems();
      });
    this.addingBike = false;
  }
}
