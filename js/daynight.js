class DayNight {
  constructor() {
    this.time = 0; this.dayLength = 7200;
    this.phase = "day";
  }
  update() {
    this.time = (this.time + 1) % this.dayLength;
    var t = this.time / this.dayLength;
    if (t < 0.25) this.phase = "day";
    else if (t < 0.35) this.phase = "dusk";
    else if (t < 0.65) this.phase = "night";
    else if (t < 0.75) this.phase = "dawn";
    else this.phase = "day";
  }
  getNightFactor() {
    var t = this.time / this.dayLength;
    if (t < 0.25) return 0;
    if (t < 0.35) return (t - 0.25) / 0.1;
    if (t < 0.65) return 1;
    if (t < 0.75) return 1 - (t - 0.65) / 0.1;
    return 0;
  }
  getSkyColor() {
    var nf = this.getNightFactor();
    var r = Math.floor(135 * (1-nf) + 10 * nf);
    var g = Math.floor(206 * (1-nf) + 10 * nf);
    var b = Math.floor(235 * (1-nf) + 40 * nf);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  getOverlayAlpha() { return this.getNightFactor() * 0.45; }
  getTimeString() {
    var h = Math.floor((this.time / this.dayLength) * 24);
    var m = Math.floor(((this.time / this.dayLength) * 24 - h) * 60);
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }
}
