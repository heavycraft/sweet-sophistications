import { bindable, inject } from 'aurelia-framework';
import { CssAnimator } from 'aurelia-animator-css';

@inject(CssAnimator, Element)
export class Carousel {
  @bindable interval = 0;
  @bindable items: Array<any>;
  @bindable controls: boolean;
  activeIndex: number = 0;
  cycleInterval: any;
  focusListener: EventListener;
  blurListener: EventListener;

  constructor(private animator: CssAnimator, private element: any) {
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
    return (this.activeIndex + 1 > this.items.length - 1 ? 0 : this.activeIndex + 1);
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
      this.cycleInterval = setInterval(() => {
        this.transition(this.nextIndex, 'carousel-item-next');
      }, this.interval * 1000);
    }
  }

  pause() {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
    }
  }

  previous() {
    this.transition(this.previousIndex, 'carousel-item-prev', true);
  }

  next() {
    this.transition(this.nextIndex, 'carousel-item-next', true);
  }

  goTo(index: number) {
    let order = index > this.activeIndex ? 'carousel-item-next' : 'carousel-item-prev';
    this.transition(index, order, true);
  }

  private transition(newIndex: number, order = 'carousel-item-next', recycle = false, transitions = {prev: 'carousel-item-left', next: 'carousel-item-right'}, time = 600): void {
    if (recycle) { this.cycle(); } // start cycle again so it doesn't jump
    let transition = order === 'carousel-item-next' ? transitions.prev : transitions.next;
    let nextDirection = newIndex > this.activeIndex ? transitions.next : transitions.prev;
    let next = this.element.querySelector(`.carousel-item:nth-child(${newIndex + 1})`);
    let active = this.element.querySelector(`.carousel-item:nth-child(${this.activeIndex + 1})`);
    if (this.animator) {
      this.animator.addClass(next, order).then( () => setTimeout(() => { if (this.animator) this.animator.removeClass(next, order); }, time));
      this.animator.addClass(next, transition).then( () => setTimeout(() => { if (this.animator) this.animator.removeClass(next, transition); }, time));
      this.animator.addClass(active, transition).then( () => {
        setTimeout(() => { if (this.animator) this.animator.removeClass(active, transition).then( () => {
          this.items[this.activeIndex].active = false;
          this.items[newIndex].active = true;
          this.activeIndex = newIndex;
        }); }, time);
      });
    }
  }

}

