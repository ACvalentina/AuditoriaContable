import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorarioDiarioComponent } from './honorario-diario.component';

describe('HonorarioDiarioComponent', () => {
  let component: HonorarioDiarioComponent;
  let fixture: ComponentFixture<HonorarioDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonorarioDiarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorarioDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
