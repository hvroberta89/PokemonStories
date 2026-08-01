import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEventDetailsComponent } from './recent-event-details.component';

describe('RecentEventDetailsComponent', () => {
  let component: RecentEventDetailsComponent;
  let fixture: ComponentFixture<RecentEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEventDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentEventDetailsComponent);
    fixture.componentRef.setInput('event', {
      id: 'event', type: 'note', title: 'Note', content: 'Content', timeLabel: 'Now', icon: 'add-note',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
