import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsVoiceInputDirective } from './ps-voice-input.directive';

@Component({
  standalone: true,
  imports: [PsVoiceInputDirective],
  template: '<textarea psVoiceInput (input)="value.set($any($event.target).value)"></textarea>',
})
class VoiceInputHostComponent {
  readonly value = signal('');
}

describe('PsVoiceInputDirective', () => {
  let fixture: ComponentFixture<VoiceInputHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VoiceInputHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(VoiceInputHostComponent);
    fixture.detectChanges();
  });

  it('adds a disabled voice control when browser speech recognition is unavailable', () => {
    const button = fixture.nativeElement.querySelector('.ps-voice-input__button') as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.disabled).toBe(true);
    expect(button.title).toContain('nem támogatja');
  });
});