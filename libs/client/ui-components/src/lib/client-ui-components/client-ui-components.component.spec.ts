import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientUiComponentsComponent } from './client-ui-components.component';

describe('ClientUiComponentsComponent', () => {
  let component: ClientUiComponentsComponent;
  let fixture: ComponentFixture<ClientUiComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientUiComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientUiComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
