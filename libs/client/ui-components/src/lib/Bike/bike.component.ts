import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Bike } from '@cpt/shared/domain';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faCircle,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { EditableModule } from '@ngneat/edit-in-place';

/**
 * Create a type for the FormGroup, using only the properties of
 * a to-do item that we want to be able to edit.
 */
type BikeFormType = {
  [k in keyof Pick<Bike, 'manufacturer' | 'model'>]: FormControl<string>;
};

@Component({
  selector: 'cpt-bike',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    EditableModule,
  ],
  templateUrl: './bike.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeComponent implements OnInit {
  faCheck = faCheck;
  faCircleOutline = faCircle;
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  bikeForm!: FormGroup<BikeFormType>;

  @Input() bike: Bike | undefined;

  @Output() toggleComplete = new EventEmitter<Bike>();
  @Output() updateBike = new EventEmitter<Bike>();
  @Output() deleteBike = new EventEmitter<Bike>();

  ngOnInit(): void {
    if (this.bike) {
      this.bikeForm = new FormGroup({
        manufacturer: new FormControl(this.bike.manufacturer, {
          nonNullable: true,
        }),
        model: new FormControl(this.bike.model, {
          nonNullable: true,
        }),
      });
    }
  }

  saveEdit() {
    this.triggerUpdate({
      ...this.bike,
      ...this.bikeForm.value,
    });
  }

  cancelEdit() {
    this.bikeForm.reset();
  }

  triggerToggleComplete() {
    this.triggerUpdate({
      ...this.bike,
      archived: !this.bike?.archived,
    });
  }

  triggerUpdate(bike: Partial<Bike>) {
    if (!this.bike) {
      return;
    }
    this.updateBike.emit({
      ...this.bike,
      ...bike,
    });
  }

  triggerDelete() {
    this.deleteBike.emit(this.bike);
  }
}
