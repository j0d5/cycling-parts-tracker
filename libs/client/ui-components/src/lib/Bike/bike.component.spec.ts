import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createMockBike } from '@cpt/shared/util-testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EditableModule } from '@ngneat/edit-in-place';
import { BikeComponent } from './bike.component';

describe('BikeComponent', () => {
  let component: BikeComponent;
  let fixture: ComponentFixture<BikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BikeComponent,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        EditableModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with data without issue', () => {
    const bike = createMockBike();
    component.bike = bike;
    component.ngOnInit();
    expect(component.bikeForm).toBeDefined();
  });

  it('should save data', (done) => {
    const bike = createMockBike();
    component.updateBike.subscribe((data) => {
      expect(data).toStrictEqual(bike);
      done();
    });

    component.bike = bike;
    component.ngOnInit();
    component.saveEdit();
  });

  it('should cancel an edit', () => {
    const bike = createMockBike();
    component.bike = bike;
    component.ngOnInit();
    component.bikeForm.controls.manufacturer.setValue('foo');
    component.cancelEdit();
    expect(component.bikeForm.value.manufacturer).toBe(bike.manufacturer);
  });

  it('should successfully toggle completion', (done) => {
    const bike = createMockBike();

    component.updateBike.subscribe((data) => {
      expect(data).toStrictEqual({ ...bike, archived: !bike.archived });
      done();
    });

    component.bike = bike;
    component.ngOnInit();
    component.triggerToggleComplete();
  });

  it('should not trigger update when bike is undefined', () => {
    const res = component.triggerUpdate({});
    expect(res).toBeUndefined();
  });

  it('should save data', (done) => {
    const bike = createMockBike();
    component.deleteBike.subscribe((data) => {
      expect(data).toStrictEqual(bike);
      done();
    });

    component.bike = bike;
    component.ngOnInit();
    component.triggerDelete();
  });
});
