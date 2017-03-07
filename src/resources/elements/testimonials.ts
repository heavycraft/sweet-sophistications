import { bindable } from 'aurelia-framework';

export class Testimonials {
  @bindable interval = 0;
  @bindable items: Array<any>;
  activeIndex: number = 0;
  cycleInterval: number;
  focusListener: EventListener;
  blurListener: EventListener;

  // @TODO:  Extend carousel ? or create a parent class for both carousel and testimonials
  constructor() {
    this.focusListener = this.cycle.bind(this);
    this.blurListener = this.pause.bind(this);
  }

  attached() {
    // Rendering doesn't happen when not focused...causes glitches
    this.activeIndex = 0;
    window.addEventListener('blur', this.blurListener);
    window.addEventListener('focus', this.focusListener);
  }

  detached() {
    this.items.forEach( item => item.active = false);
    window.removeEventListener('blur', this.blurListener);
    window.removeEventListener('focus', this.focusListener);
    this.pause();
  }

  get nextIndex (): number {
    return (this.activeIndex < this.items.length - 1 ? this.activeIndex + 1 : 0);
  }

  get previousIndex (): number {
    return (this.activeIndex - 1 < 0 ? this.items.length - 1 : this.activeIndex - 1);
  }

  itemsChanged(newValue, oldValue) {
    newValue[this.activeIndex].active = true;
    this.cycle();
  }

  cycle() {
    this.pause();
    if (this.interval) {
      this.cycleInterval = setInterval(this.next.bind(this), this.interval * 1000);
    }
  }

  pause() {
    if (this.cycleInterval) { clearInterval(this.cycleInterval); }
  }

  previous() {
    this.transition(this.previousIndex);
  }

  next() {
    this.transition(this.nextIndex);
  }

  private transition(newIndex: number): void {
    this.items[this.activeIndex].active = false;
    this.items[newIndex].active = true;
    this.activeIndex = newIndex;
  }
}
