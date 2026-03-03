// Hardware abstraction layer for Rabbit R1 device
const Hardware = {
  callbacks: { scrollUp: null, scrollDown: null, sideClick: null, longPressStart: null, longPressEnd: null, tiltLeft: null, tiltRight: null, tiltForward: null, tiltBack: null },
  isLongPress: false, longPressTimer: null, longPressDelay: 500,
  init() {
    document.addEventListener('keydown', (e) => this.handleKey(e));
    try {
      if (typeof scrollUp !== 'undefined') { scrollUp.addEventListener('click', () => this.trigger('scrollUp')); }
      if (typeof scrollDown !== 'undefined') { scrollDown.addEventListener('click', () => this.trigger('scrollDown')); }
      if (typeof sideClick !== 'undefined') {
        sideClick.addEventListener('mousedown', () => { this.longPressTimer = setTimeout(() => { this.isLongPress = true; this.trigger('longPressStart'); }, this.longPressDelay); });
        sideClick.addEventListener('mouseup', () => { clearTimeout(this.longPressTimer); if (this.isLongPress) { this.trigger('longPressEnd'); this.isLongPress = false; } else { this.trigger('sideClick'); } });
      }
    } catch(e) {}
    this.initAccelerometer();
  },
  initAccelerometer() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma < -15) this.trigger('tiltLeft');
        else if (e.gamma > 15) this.trigger('tiltRight');
        if (e.beta < -15) this.trigger('tiltForward');
        else if (e.beta > 30) this.trigger('tiltBack');
      });
    }
  },
  handleKey(e) {
    switch(e.key) {
      case 'ArrowUp': case 'w': this.trigger('scrollUp'); break;
      case 'ArrowDown': case 's': this.trigger('scrollDown'); break;
      case 'ArrowLeft': case 'a': this.trigger('tiltLeft'); break;
      case 'ArrowRight': case 'd': this.trigger('tiltRight'); break;
      case ' ': case 'Enter': this.trigger('sideClick'); break;
      case 'e': this.trigger('tiltForward'); break;
      case 'q': this.trigger('tiltBack'); break;
      case 'Escape': this.trigger('longPressStart'); break;
    }
    e.preventDefault();
  },
  on(event, callback) { this.callbacks[event] = callback; },
  trigger(event) { if (this.callbacks[event]) this.callbacks[event](); }
};
