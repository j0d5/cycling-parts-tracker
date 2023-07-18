import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Bike } from '@cpt/shared/domain';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faCircle,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cpt-bike',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeComponent {
  faCheck = faCheck;
  faCircleOutline = faCircle;
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  @Input() bike: Bike | undefined;

  @Output() toggleComplete = new EventEmitter<Bike>();
  @Output() editBike = new EventEmitter<Bike>();
  @Output() deleteBike = new EventEmitter<Bike>();

  /**
   * Simply emit the opposite of the current completed value
   */
  triggerToggleComplete() {
    this.toggleComplete.emit(this.bike);
  }

  /**
   * Emit the current bike data so that a service or parent component
   * knows what to work with.
   */
  triggerEdit() {
    this.editBike.emit(this.bike);
  }

  /**
   * Emit the current bike data, although only the ID will most likely
   * be needed for deletion.
   */
  triggerDelete() {
    this.deleteBike.emit(this.bike);
  }
}
