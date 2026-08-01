import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardQueueComponent } from './reward-queue.component';

describe('RewardQueueComponent', () => {
  let component: RewardQueueComponent;
  let fixture: ComponentFixture<RewardQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardQueueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardQueueComponent);
    fixture.componentRef.setInput('items', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
