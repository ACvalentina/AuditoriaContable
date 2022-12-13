import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadVentasComponent } from './contabilidad-ventas.component';

describe('ContabilidadVentasComponent', () => {
  let component: ContabilidadVentasComponent;
  let fixture: ComponentFixture<ContabilidadVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabilidadVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContabilidadVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
