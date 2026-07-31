import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickActionMenuComponent } from './quick-action-menu.component';

describe('QuickActionMenuComponent', () => {
  let component: QuickActionMenuComponent;
  let fixture: ComponentFixture<QuickActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
