import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

interface SpeechRecognitionAlternativeLike {
  readonly transcript: string;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: ArrayLike<ArrayLike<SpeechRecognitionAlternativeLike>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

@Directive({
  selector: 'input[psVoiceInput], textarea[psVoiceInput]',
  standalone: true,
})
export class PsVoiceInputDirective implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private recognition: SpeechRecognitionLike | null = null;
  private button: HTMLButtonElement | null = null;
  private listening = false;

  ngAfterViewInit(): void {
    const button = this.renderer.createElement('button') as HTMLButtonElement;
    this.button = button;
    this.renderer.setAttribute(button, 'type', 'button');
    this.renderer.setAttribute(button, 'class', 'ps-voice-input__button');
    this.renderer.setAttribute(button, 'aria-label', 'Szöveg diktálása');
    this.renderer.setProperty(button, 'textContent', 'Diktálás');

    const Recognition = this.getRecognitionConstructor();
    if (!Recognition) {
      this.renderer.setProperty(button, 'disabled', true);
      this.renderer.setAttribute(button, 'title', 'A böngésző nem támogatja a hangbevitelt.');
    } else {
      this.renderer.setAttribute(button, 'title', 'Szöveg diktálása');
      const removeClickListener = this.renderer.listen(button, 'click', () => this.toggle(Recognition));
      this.destroyRef.onDestroy(removeClickListener);
    }

    this.renderer.insertBefore(this.host.nativeElement.parentNode, button, this.host.nativeElement.nextSibling);
    this.destroyRef.onDestroy(() => this.recognition?.stop());
  }

  private toggle(Recognition: SpeechRecognitionConstructor): void {
    if (this.listening) {
      this.recognition?.stop();
      return;
    }

    const recognition = new Recognition();
    this.recognition = recognition;
    recognition.lang = document.documentElement.lang || 'hu-HU';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => this.applyTranscript(event);
    recognition.onend = () => this.setListening(false);
    recognition.onerror = () => this.setListening(false);
    this.setListening(true);
    recognition.start();
  }

  private applyTranscript(event: SpeechRecognitionEventLike): void {
    const transcript = event.results[event.resultIndex]?.[0]?.transcript.trim();
    if (!transcript) return;

    const field = this.host.nativeElement;
    const separator = field.value.trim() ? ' ' : '';
    field.value = `${field.value}${separator}${transcript}`;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.focus();
  }

  private setListening(listening: boolean): void {
    this.listening = listening;
    if (!this.button) return;
    this.renderer.setProperty(this.button, 'textContent', listening ? 'Diktálás…' : 'Diktálás');
    this.renderer.setAttribute(this.button, 'aria-pressed', String(listening));
  }

  private getRecognitionConstructor(): SpeechRecognitionConstructor | null {
    const browser = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return browser.SpeechRecognition ?? browser.webkitSpeechRecognition ?? null;
  }
}