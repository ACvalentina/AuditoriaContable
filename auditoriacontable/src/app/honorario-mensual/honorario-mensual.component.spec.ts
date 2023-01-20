import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorarioMensualComponent } from './honorario-mensual.component';

describe('HonorarioMensualComponent', () => {
  let component: HonorarioMensualComponent;
  let fixture: ComponentFixture<HonorarioMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonorarioMensualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorarioMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
