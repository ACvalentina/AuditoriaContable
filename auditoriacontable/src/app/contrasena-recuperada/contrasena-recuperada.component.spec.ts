import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrasenaRecuperadaComponent } from './contrasena-recuperada.component';

describe('ContrasenaRecuperadaComponent', () => {
  let component: ContrasenaRecuperadaComponent;
  let fixture: ComponentFixture<ContrasenaRecuperadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContrasenaRecuperadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrasenaRecuperadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
