class Renderer {
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
