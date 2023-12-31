import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeService } from '@cpt/client/data-access';
import { createMockBike, createMockUser } from '@cpt/shared/util-testing';
import { of } from 'rxjs';
import { FeatureDashboardComponent } from './feature-dashboard.component';

const mockUser = createMockUser();

describe('FeatureDashboardComponent', () => {
  let component: FeatureDashboardComponent;
  let bikeService: BikeService;
  let fixture: ComponentFixture<FeatureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDashboardComponent, HttpClientTestingModule],
      providers: [BikeService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDashboardComponent);
    component = fixture.componentInstance;
    bikeService = TestBed.inject(BikeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a unique id for each bike', () => {
    const bike = createMockBike(mockUser.id);
    expect(component.trackBike(0, bike)).toBe(bike.id);
  });

  it('should trigger a refresh of data', (done) => {
    const bikes = Array.from({ length: 5 }).map(() =>
      createMockBike(mockUser.id)
    );
    const spy = jest
      .spyOn(bikeService, 'getAllBikeItems')
      .mockReturnValue(of(bikes));
    component.refreshItems();
    expect(spy).toHaveBeenCalled();
    expect(component.bikeItems$.value.length).toBe(bikes.length);
    done();
  });

  it('should be able to toggle the completion of a bike', (done) => {
    const bike = createMockBike(mockUser.id, { archived: false });
    const updateSpy = jest
      .spyOn(bikeService, 'updateBike')
      .mockReturnValue(of({ ...bike, archived: true }));
    const refreshSpy = jest
      .spyOn(bikeService, 'getAllBikeItems')
      .mockReturnValue(of([{ ...bike, archived: true }]));
    component.toggleArchive(bike);
    expect(refreshSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(component.bikeItems$.value.length).toBe(1);
    expect(component.bikeItems$.value[0].archived).toBe(true);
    done();
  });

  it('should be able to delete a bike', (done) => {
    const bikes = Array.from({ length: 5 }).map(() =>
      createMockBike(mockUser.id)
    );
    component.bikeItems$.next(bikes);
    const deleteSpy = jest
      .spyOn(bikeService, 'deleteBike')
      .mockReturnValue(of(null));
    const refreshSpy = jest
      .spyOn(bikeService, 'getAllBikeItems')
      .mockReturnValue(of([...bikes.slice(1)]));
    component.deleteBike(bikes[0]);
    expect(deleteSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
    expect(component.bikeItems$.value.length).toBe(4);
    done();
  });

  it('should be able to toggle the completion of a bike', (done) => {
    const bike = createMockBike(mockUser.id, { archived: false });
    const updateSpy = jest
      .spyOn(bikeService, 'updateBike')
      .mockReturnValue(of({ ...bike, archived: true }));
    const refreshSpy = jest
      .spyOn(bikeService, 'getAllBikeItems')
      .mockReturnValue(of([{ ...bike, archived: true }]));
    component.editBike(bike);
    expect(refreshSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(component.bikeItems$.value.length).toBe(1);
    expect(component.bikeItems$.value[0].archived).toBe(true);
    done();
  });
});
