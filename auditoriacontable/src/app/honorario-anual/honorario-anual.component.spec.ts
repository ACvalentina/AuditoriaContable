import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorarioAnualComponent } from './honorario-anual.component';

describe('HonorarioAnualComponent', () => {
  let component: HonorarioAnualComponent;
  let fixture: ComponentFixture<HonorarioAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonorarioAnualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorarioAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
