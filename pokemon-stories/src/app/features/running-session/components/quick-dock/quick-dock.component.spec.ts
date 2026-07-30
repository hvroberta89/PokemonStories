import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickDockComponent } from './quick-dock.component';

describe('QuickDockComponent', () => {
  let component: QuickDockComponent;
  let fixture: ComponentFixture<QuickDockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickDockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickDockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
