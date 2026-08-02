import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardSheetComponent } from './reward-sheet.component';

describe('RewardSheetComponent', () => {
  let component: RewardSheetComponent;
  let fixture: ComponentFixture<RewardSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardSheetComponent);
    fixture.componentRef.setInput('recipients', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
