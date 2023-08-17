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
  Validators,
} from '@angular/forms';
import { Bike, CreateBike } from '@cpt/shared/domain';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faCircle,
  faFloppyDisk,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { EditableModule } from '@ngneat/edit-in-place';

/**
 * Create a type for the FormGroup, using only the properties of
 * a bike item that we want to be able to edit.
 */
type BikeFormType = {
  [k in keyof Pick<Bike, 'manufacturer' | 'model' | 'date'>]: FormControl;
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
  styleUrls: ['./bike.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeComponent implements OnInit {
  faCheck = faCheck;
  faCircleOutline = faCircle;
  faPencil = faPencil;
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;

  bikeForm!: FormGroup<BikeFormType>;

  @Input() bike: Bike | undefined;

  @Output() toggleArchive = new EventEmitter<Bike>();
  @Output() updateBike = new EventEmitter<Bike>();
  @Output() deleteBike = new EventEmitter<Bike>();
  @Output() createBike = new EventEmitter<CreateBike>();

  ngOnInit(): void {
    this.bikeForm = new FormGroup({
      manufacturer: new FormControl(this.bike?.manufacturer, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(1)],
      }),
      model: new FormControl(this.bike?.model, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(1)],
      }),
      date: new FormControl(
        this.bike?.date || new Date().toLocaleDateString('de-DE'),
        {
          nonNullable: true,
        }
      ),
    });
  }

  saveEdit() {
    if (this.bikeForm.valid && this.bikeForm.dirty) {
      this.triggerUpdate({
        ...this.bike,
        ...this.bikeForm.value,
        date: new Date(this.bikeForm.value.date),
      });
    } else {
      console.log(`Form invalid, not saving`);
    }
  }

  cancelEdit() {
    this.bikeForm.reset();
  }

  triggerToggleArchive() {
    this.triggerUpdate({
      ...this.bike,
      archived: !this.bike?.archived,
    });
  }

  triggerUpdate(bike: Partial<Bike>) {
    if (!this.bike) {
      console.log(`No bike, not saving`);
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

  triggerCreate() {
    if (this.bikeForm.valid && this.bikeForm.dirty) {
      this.createBike.emit(this.bikeForm.getRawValue());
    } else {
      console.log(`Form invalid, not creating`, this.bikeForm);
    }
  }
}
