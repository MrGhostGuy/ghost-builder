class Game {
  constructor() { this.state = "title"; this.running = false; }
  newGame() {
    this.world = new World();
    var sx = Math.floor(this.world.w / 2);
    var sy = this.world.getSurface(sx) - 2;
    this.player = new Player(sx, sy);
    this.inventory = new Inventory();
    this.inventory.add("WOOD", 5); this.inventory.add("DIRT", 10);
    this.crafting = new CraftingSystem();
    this.renderer = new Renderer();
    this.enemyMgr = new EnemyManager();
    this.dayNight = new DayNight();
    this.mode = "move"; this.state = "play"; this.running = true;
    this.loop();
  }
  update() {
    if (this.state !== "play") return;
    this.player.update(this.world);
    this.dayNight.update();
    this.enemyMgr.update(this.world, this.player, this.dayNight);
    this.renderer.updateCam(this.player.x, this.player.y);
    if (this.player.hp <= 0) this.state = "gameover";
  }
  render() {
    var r = this.renderer;
    if (this.state === "title") { r.drawTitle(); return; }
    if (this.state === "gameover") {
      r.clear("#200000");
      r.ctx.fillStyle="#f00"; r.ctx.font="bold 18px monospace";
      r.ctx.fillText("GAME OVER", 55, 120);
      r.ctx.fillStyle="#fff"; r.ctx.font="10px monospace";
      r.ctx.fillText("Press to restart", 60, 160);
      return;
    }
    r.clear(this.dayNight.getSkyColor());
    r.drawWorld(this.world);
    r.drawEnemies(this.enemyMgr.enemies);
    r.drawPlayer(this.player);
    if (this.mode === "build") r.drawCursor(this.player);
    r.drawNightOverlay(this.dayNight.getOverlayAlpha());
    r.drawHUD(this.player, this.inventory, this.dayNight);
    if (this.crafting.isOpen) this.crafting.render(r.ctx, r.W, r.H);
  }
  loop() {
    if (!this.running) return;
    this.update(); this.render();
    requestAnimationFrame(() => this.loop());
  }
  onScroll(dir) {
    if (this.state === "title") { this.newGame(); return; }
    if (this.state === "gameover") { this.newGame(); return; }
    if (this.crafting.isOpen) { this.crafting.navigate(dir); return; }
    if (this.mode === "move") {
      if (dir === "up") this.player.jump();
      else if (dir === "down") {}
    } else if (this.mode === "build") {
      this.player.moveCursor(dir === "up" ? "up" : "down");
    }
  }
  onSide() {
    if (this.state === "title") { this.newGame(); return; }
    if (this.state === "gameover") { this.newGame(); return; }
    if (this.crafting.isOpen) { this.crafting.craft(this.inventory); return; }
    if (this.mode === "move") {
      this.player.moveRight();
    } else if (this.mode === "build") {
      var bx = Math.floor(this.player.x) + this.player.cursorX;
      var by = Math.floor(this.player.y) + this.player.cursorY;
      var b = this.world.getBlock(bx, by);
      if (b !== "AIR") {
        this.inventory.add(b, 1); this.world.breakBlock(bx, by);
      } else {
        var sel = this.inventory.getSelected();
        if (sel && sel.type && BLOCKS[sel.type]) {
          this.world.setBlock(bx, by, sel.type);
          this.inventory.remove(sel.type, 1);
        }
      }
    }
  }
  onLongPress() {
    if (this.state !== "play") return;
    if (this.crafting.isOpen) return;
    this.mode = this.mode === "move" ? "build" : "move";
  }
  onBack() {
    if (this.crafting.isOpen) { this.crafting.isOpen = false; return; }
    if (this.mode === "build") { this.mode = "move"; return; }
    this.crafting.isOpen = true;
  }
  handleKey(key) {
    if (key === "ArrowUp") this.onScroll("up");
    if (key === "ArrowDown") this.onScroll("down");
    if (key === "ArrowLeft") this.player.moveLeft();
    if (key === "ArrowRight") this.player.moveRight();
    if (key === " ") this.onSide();
    if (key === "e") this.onBack();
    if (key === "b") this.onLongPress();
  }
}
