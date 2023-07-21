import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiService } from '@cpt/client/data-access';
import { createMockBike } from '@cpt/shared/util-testing';
import { FeatureDashboardComponent } from './feature-dashboard.component';

describe('FeatureDashboardComponent', () => {
  let component: FeatureDashboardComponent;
  let apiService: ApiService;
  let fixture: ComponentFixture<FeatureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDashboardComponent, HttpClientTestingModule],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDashboardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a unique id for each bike', () => {
    const bike = createMockBike();
    expect(component.trackBike(0, bike)).toBe(bike.id);
  });

  // it('should trigger a refresh of data', (done) => {
  //   const bikes = Array.from({ length: 5 }).map(() => createMockBike());
  //   const spy = jest
  //     .spyOn(apiService, 'getAllBikeItems')
  //     .mockReturnValue(of(bikes));
  //   component.refreshItems();
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.bikes$.value.length).toBe(bikes.length);
  //   done();
  // });

  // it('should be able to toggle the completion of a bike', (done) => {
  //   const bike = createMockBike({ archived: false });
  //   const updateSpy = jest
  //     .spyOn(apiService, 'updateBike')
  //     .mockReturnValue(of({ ...bike, archived: true }));
  //   const refreshSpy = jest
  //     .spyOn(apiService, 'getAllBikeItems')
  //     .mockReturnValue(of([{ ...bike, archived: true }]));
  //   component.toggleComplete(bike);
  //   expect(refreshSpy).toHaveBeenCalled();
  //   expect(updateSpy).toHaveBeenCalled();
  //   expect(component.bikes$.value.length).toBe(1);
  //   expect(component.bikes$.value[0].archived).toBe(true);
  //   done();
  // });

  // it('should be able to delete a bike', (done) => {
  //   const bikes = Array.from({ length: 5 }).map(() => createMockBike());
  //   component.bikes$.next(bikes);
  //   const deleteSpy = jest
  //     .spyOn(apiService, 'deleteBike')
  //     .mockReturnValue(of(null));
  //   const refreshSpy = jest
  //     .spyOn(apiService, 'getAllBikeItems')
  //     .mockReturnValue(of([...bikes.slice(1)]));
  //   component.deleteBike(bikes[0]);
  //   expect(deleteSpy).toHaveBeenCalled();
  //   expect(refreshSpy).toHaveBeenCalled();
  //   expect(component.bikes$.value.length).toBe(4);
  //   done();
  // });

  // it('should be able to toggle the completion of a bike', (done) => {
  //   const bike = createMockBike({ archived: false });
  //   const updateSpy = jest
  //     .spyOn(apiService, 'updateBike')
  //     .mockReturnValue(of({ ...bike, archived: true }));
  //   const refreshSpy = jest
  //     .spyOn(apiService, 'getAllBikeItems')
  //     .mockReturnValue(of([{ ...bike, archived: true }]));
  //   component.editBike(bike);
  //   expect(refreshSpy).toHaveBeenCalled();
  //   expect(updateSpy).toHaveBeenCalled();
  //   expect(component.bikes$.value.length).toBe(1);
  //   expect(component.bikes$.value[0].archived).toBe(true);
  //   done();
  // });
});
