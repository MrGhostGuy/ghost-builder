class Enemy {
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
