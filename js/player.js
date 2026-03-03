class Player {
  constructor(x, y) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
    this.w = 0.8; this.h = 1.8; this.onGround = false;
    this.hp = 20; this.maxHp = 20; this.dir = 1;
    this.mining = false; this.mineTimer = 0;
    this.cursorX = 0; this.cursorY = 0;
    this.invTimer = 0;
  }
  update(world) {
    if (this.invTimer > 0) this.invTimer--;
    this.vy += 0.04; this.x += this.vx; this.y += this.vy;
    this.vx *= 0.8; this.onGround = false;
    if (this.vy > 0.5) this.vy = 0.5;
    var bx = Math.floor(this.x), by = Math.floor(this.y);
    for (var dx = -1; dx <= 1; dx++)
      for (var dy = -1; dy <= 2; dy++)
        this.resolveY(bx+dx, by+dy, world);
    for (var dx = -1; dx <= 1; dx++)
      for (var dy = -1; dy <= 2; dy++)
        this.resolveX(bx+dx, by+dy, world);
  }
  resolveX(bx, by, world) {
    if (!world.isSolid(bx, by)) return;
    var pl=this.x-this.w/2, pr=this.x+this.w/2, pt=this.y-this.h, pb=this.y;
    if (pr>bx && pl<bx+1 && pb>by && pt<by+1) {
      if (this.x < bx+0.5) this.x = bx - this.w/2;
      else this.x = bx + 1 + this.w/2;
      this.vx = 0;
    }
  }
  resolveY(bx, by, world) {
    if (!world.isSolid(bx, by)) return;
    var pl=this.x-this.w/2, pr=this.x+this.w/2, pt=this.y-this.h, pb=this.y;
    if (pr>bx && pl<bx+1 && pb>by && pt<by+1) {
      if (this.y - this.h/2 < by+0.5) { this.y = by; this.vy = 0; this.onGround = true; }
      else { this.y = by + 1 + this.h; this.vy = 0; }
    }
  }
  jump() { if (this.onGround) this.vy = -0.35; }
  moveLeft() { this.vx = -0.12; this.dir = -1; }
  moveRight() { this.vx = 0.12; this.dir = 1; }
  moveCursor(d) {
    if (d==="up") this.cursorY--;
    if (d==="down") this.cursorY++;
    if (d==="left") this.cursorX--;
    if (d==="right") this.cursorX++;
  }
  takeDamage(n) {
    if (this.invTimer > 0) return;
    this.hp -= n;
    if (this.hp < 0) this.hp = 0;
    this.invTimer = 30;
  }
}
