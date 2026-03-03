import os
def w(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {path}: {os.path.getsize(path)} bytes")

print("Generating enemy system files...")

# 1. js/enemies.js - Enemy class + EnemyManager
w('js/enemies.js', '''class Enemy {
  constructor(x, y, type) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
    this.type = type; this.dir = Math.random() < 0.5 ? -1 : 1;
    this.dead = false; this.flashTimer = 0;
    if (type === "skeleton") {
      this.w = 0.6; this.h = 1.7; this.hp = 10; this.maxHp = 10;
      this.speed = 0.04; this.damage = 3;
      this.color = "#c8c8c8"; this.eyeColor = "#ff0000";
      this.detectRange = 10;
    } else if (type === "creeper") {
      this.w = 0.5; this.h = 1.4; this.hp = 12; this.maxHp = 12;
      this.speed = 0.03; this.damage = 8;
      this.color = "#2d8a2d"; this.eyeColor = "#000000";
      this.detectRange = 8; this.fuseTime = 0;
      this.fuseMax = 90; this.fusing = false; this.explodeRange = 2.0;
    }
  }
  update(world, px, py) {
    if (this.dead) return;
    if (this.flashTimer > 0) this.flashTimer--;
    var dx = px - this.x, dy = py - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    this.vy += 0.04;
    if (dist < this.detectRange) {
      this.dir = dx > 0 ? 1 : -1;
      if (this.type === "creeper" && dist < this.explodeRange) {
        this.fusing = true; this.vx = 0;
      } else {
        if (this.type === "creeper") { this.fusing = false; this.fuseTime = 0; }
        this.vx = this.dir * this.speed;
        var fx = Math.floor(this.x + this.dir), fy = Math.floor(this.y);
        if (world.isSolid(fx, fy) && !world.isSolid(fx, fy - 1)) this.vy = -0.3;
      }
      if (this.type === "creeper" && this.fusing) {
        this.fuseTime++;
        if (this.fuseTime >= this.fuseMax) return "explode";
      }
    } else {
      if (Math.random() < 0.01) this.dir *= -1;
      this.vx = this.dir * this.speed * 0.5;
      if (this.type === "creeper") { this.fusing = false; this.fuseTime = 0; }
    }
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.8; if (this.vy > 0.5) this.vy = 0.5;
    this.resolveCol(world);
  }
  resolveCol(world) {
    var bx = Math.floor(this.x), by = Math.floor(this.y);
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 2; dy++) {
        var wx = bx + dx, wy = by + dy;
        if (!world.isSolid(wx, wy)) continue;
        var pl = this.x - this.w/2, pr = this.x + this.w/2;
        var pt = this.y - this.h, pb = this.y;
        if (pr > wx && pl < wx+1 && pb > wy && pt < wy+1) {
          var ob = pb - wy, ot = (wy+1) - pt;
          if (ob < ot && ob < 0.5) { this.y = wy; this.vy = 0; }
          else if (ot < 0.5) { this.y = wy+1+this.h; this.vy = 0; }
        }
      }
    }
  }
  takeDamage(n) { this.hp -= n; this.flashTimer = 10; if (this.hp <= 0) this.dead = true; }
  hits(p) {
    if (this.dead) return false;
    var el=this.x-this.w/2, er=this.x+this.w/2, et=this.y-this.h, eb=this.y;
    var pl=p.x-p.w/2, pr=p.x+p.w/2, pt=p.y-p.h, pb=p.y;
    return er>pl && el<pr && eb>pt && et<pb;
  }
}
class EnemyManager {
  constructor() { this.enemies = []; this.maxEnemies = 8; this.spawnTimer = 0; }
  update(world, player, dayNight) {
    this.spawnTimer++;
    var nf = dayNight ? dayNight.getNightFactor() : 0.3;
    var cd = nf > 0.5 ? Math.floor(80 + (1-nf)*160) : Math.floor(400 + (1-nf)*500);
    if (this.spawnTimer >= cd && this.enemies.length < this.maxEnemies) {
      this.spawnTimer = 0; this.spawnEnemy(world, player);
    }
    for (var i = this.enemies.length - 1; i >= 0; i--) {
      var e = this.enemies[i];
      var r = e.update(world, player.x, player.y);
      if (r === "explode") { this.creeperBoom(e, world, player); this.enemies.splice(i,1); continue; }
      if (e.hits(player) && player.invTimer <= 0) {
        player.takeDamage(e.damage);
        player.vx = player.x > e.x ? 0.2 : -0.2; player.vy = -0.15;
      }
      if (e.dead || e.y > world.h+10 || Math.abs(e.x - player.x) > 60) this.enemies.splice(i,1);
    }
  }
  spawnEnemy(world, player) {
    var side = Math.random() < 0.5 ? -1 : 1;
    var sx = player.x + side * (10 + Math.random()*15);
    if (sx < 2 || sx > world.w - 2) return;
    var sy = world.getSurface(Math.floor(sx)) - 1;
    if (sy < 1) return;
    var type = Math.random() < 0.5 ? "skeleton" : "creeper";
    this.enemies.push(new Enemy(sx, sy, type));
  }
  creeperBoom(c, world, player) {
    var cx = Math.floor(c.x), cy = Math.floor(c.y), r = 2;
    for (var bx = cx-r; bx <= cx+r; bx++)
      for (var by = cy-r; by <= cy+r; by++) {
        var d = Math.sqrt((bx-cx)*(bx-cx)+(by-cy)*(by-cy));
        if (d <= r) { var b = world.getBlock(bx,by); if (b!=="AIR"&&b!=="BEDROCK") world.setBlock(bx,by,"AIR"); }
      }
    var pd = Math.sqrt((player.x-c.x)**2+(player.y-c.y)**2);
    if (pd < 3.5) { var dmg = Math.floor(c.damage*(1-pd/4)); if (dmg>0) player.takeDamage(dmg); }
  }
}
''')

# 2. js/daynight.js - Day/Night cycle system
w('js/daynight.js', '''class DayNight {
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
''')

# 3. Modified js/player.js - add takeDamage + invincibility
w('js/player.js', '''class Player {
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
''')

# 4. Modified js/renderer.js - add enemy rendering + night overlay
w('js/renderer.js', '''class Renderer {
  constructor() {
    this.canvas = document.getElementById("c");
    this.ctx = this.canvas.getContext("2d");
    this.W = 240; this.H = 282; this.tileSize = 12;
    this.camX = 0; this.camY = 0;
  }
  clear(skyColor) { this.ctx.fillStyle = skyColor || "#87CEEB"; this.ctx.fillRect(0,0,this.W,this.H); }
  updateCam(px, py) {
    this.camX = px * this.tileSize - this.W/2;
    this.camY = py * this.tileSize - this.H/2;
  }
  drawWorld(world) {
    var t = this.tileSize, sx = Math.floor(this.camX/t), sy = Math.floor(this.camY/t);
    var ex = sx + Math.ceil(this.W/t)+1, ey = sy + Math.ceil(this.H/t)+1;
    for (var x = sx; x <= ex; x++) {
      for (var y = sy; y <= ey; y++) {
        var b = world.getBlock(x, y);
        if (b !== "AIR") {
          var bd = BLOCKS[b];
          if (bd) { this.ctx.fillStyle = bd.color; this.ctx.fillRect(x*t-this.camX, y*t-this.camY, t, t); }
        }
      }
    }
  }
  drawPlayer(player) {
    var t = this.tileSize, px = player.x*t - this.camX, py = player.y*t - this.camY;
    var blink = player.invTimer > 0 && Math.floor(player.invTimer/3) % 2 === 0;
    if (blink) return;
    this.ctx.fillStyle = "#4488ff";
    this.ctx.fillRect(px - player.w*t/2, py - player.h*t, player.w*t, player.h*t);
    this.ctx.fillStyle = "#ffcc88";
    this.ctx.fillRect(px - 3, py - player.h*t, 6, 6);
  }
  drawCursor(player) {
    var t = this.tileSize;
    var cx = (Math.floor(player.x) + player.cursorX) * t - this.camX;
    var cy = (Math.floor(player.y) + player.cursorY) * t - this.camY;
    this.ctx.strokeStyle = "#fff"; this.ctx.lineWidth = 1;
    this.ctx.strokeRect(cx, cy, t, t);
  }
  drawEnemies(enemies) {
    var t = this.tileSize;
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      var ex = e.x * t - this.camX, ey = e.y * t - this.camY;
      var flash = e.flashTimer > 0 && Math.floor(e.flashTimer/2) % 2 === 0;
      if (e.type === "skeleton") {
        this.ctx.fillStyle = flash ? "#fff" : e.color;
        this.ctx.fillRect(ex - e.w*t/2, ey - e.h*t, e.w*t, e.h*t);
        this.ctx.fillStyle = "#444";
        this.ctx.fillRect(ex - e.w*t/2+1, ey - e.h*t, e.w*t-2, 2);
        this.ctx.fillStyle = e.eyeColor;
        var faceX = e.dir > 0 ? ex + 1 : ex - 3;
        this.ctx.fillRect(faceX, ey - e.h*t + 2, 2, 2);
        this.ctx.fillRect(faceX - 3, ey - e.h*t + 2, 2, 2);
      } else if (e.type === "creeper") {
        var col = e.fusing && Math.floor(e.fuseTime/4) % 2 ? "#fff" : e.color;
        this.ctx.fillStyle = flash ? "#fff" : col;
        this.ctx.fillRect(ex - e.w*t/2, ey - e.h*t, e.w*t, e.h*t);
        this.ctx.fillStyle = e.eyeColor;
        this.ctx.fillRect(ex - 2, ey - e.h*t + 3, 2, 3);
        this.ctx.fillRect(ex + 1, ey - e.h*t + 3, 2, 3);
        this.ctx.fillRect(ex - 1, ey - e.h*t + 7, 3, 2);
      }
    }
  }
  drawNightOverlay(alpha) {
    if (alpha > 0.01) {
      this.ctx.fillStyle = "rgba(0,0,20," + alpha.toFixed(2) + ")";
      this.ctx.fillRect(0, 0, this.W, this.H);
    }
  }
  drawHUD(player, inv, dayNight) {
    this.ctx.fillStyle = "#c00"; this.ctx.font = "10px monospace";
    this.ctx.fillText("HP:" + player.hp + "/" + player.maxHp, 2, 10);
    if (dayNight) {
      this.ctx.fillStyle = "#ff0"; this.ctx.fillText(dayNight.getTimeString() + " " + dayNight.phase, 80, 10);
    }
    if (inv && inv.slots) {
      var y = this.H - 16;
      for (var i = 0; i < Math.min(inv.slots.length, 8); i++) {
        var s = inv.slots[i], bx = i * 30 + 2;
        this.ctx.fillStyle = i === inv.selected ? "#fa0" : "#555";
        this.ctx.fillRect(bx, y, 28, 14);
        if (s.type) {
          var bd = BLOCKS[s.type] || ITEMS[s.type];
          if (bd) {
            this.ctx.fillStyle = bd.color || "#fff";
            this.ctx.fillRect(bx+1, y+1, 12, 12);
          }
          this.ctx.fillStyle = "#fff"; this.ctx.font = "8px monospace";
          this.ctx.fillText(s.count, bx+14, y+11);
        }
      }
    }
  }
  drawTitle() {
    this.ctx.fillStyle = "#000"; this.ctx.fillRect(0,0,this.W,this.H);
    this.ctx.fillStyle = "#4488ff"; this.ctx.font = "bold 20px monospace";
    this.ctx.fillText("Ghost", 70, 100); this.ctx.fillText("Builder", 55, 125);
    this.ctx.fillStyle = "#aaa"; this.ctx.font = "10px monospace";
    this.ctx.fillText("Created by", 75, 170);
    this.ctx.fillText("Jeff Hollaway", 60, 185);
    this.ctx.fillText("[GhostLegacyX]", 55, 200);
    this.ctx.fillStyle = "#fff"; this.ctx.font = "10px monospace";
    this.ctx.fillText("Press to Start", 65, 250);
  }
}
''')

# 5. Modified js/game.js - integrate enemies + day/night
w('js/game.js', '''class Game {
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
''')

# 6. Updated index.html - add new script tags
w('index.html', '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=240">
<title>Ghost Builder</title>
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<canvas id="c" width="240" height="282"></canvas>
<script src="js/hardware.js"></script>
<script src="js/data.js"></script>
<script src="js/inventory.js"></script>
<script src="js/crafting.js"></script>
<script src="js/world.js"></script>
<script src="js/player.js"></script>
<script src="js/enemies.js"></script>
<script src="js/daynight.js"></script>
<script src="js/renderer.js"></script>
<script src="js/game.js"></script>
<script src="js/app.js"></script>
</body>
</html>
''')

print("\\nAll files generated!")
for f in ['js/enemies.js','js/daynight.js','js/player.js','js/renderer.js','js/game.js','index.html']:
    print(f"  {f}: {os.path.getsize(f)} bytes")
