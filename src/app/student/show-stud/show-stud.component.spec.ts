import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudComponent } from './show-stud.component';

describe('ShowStudComponent', () => {
  let component: ShowStudComponent;
  let fixture: ComponentFixture<ShowStudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowStudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
