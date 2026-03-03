// Player
class Player {
  constructor(x,y) { this.x=x||128; this.y=y||30; this.vx=0; this.vy=0; this.w=0.8; this.h=1.8; this.onGround=false; this.hp=20; this.maxHp=20; this.dir=1; this.mining=false; this.mineTimer=0; this.cursorX=0; this.cursorY=0; }
  update(world) { this.vy+=0.04; this.x+=this.vx; this.y+=this.vy; this.vx*=0.8; if(this.vy>0.5)this.vy=0.5; this.onGround=false; let bx=Math.floor(this.x),by=Math.floor(this.y); for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=2;dy++){if(world.isSolid(bx+dx,by+dy)){let ox=this.resolveX(bx+dx,by+dy); let oy=this.resolveY(bx+dx,by+dy);}} if(world.isSolid(Math.floor(this.x),Math.floor(this.y+1)))this.onGround=true; this.cursorX=Math.floor(this.x)+this.dir; this.cursorY=Math.floor(this.y); }
  resolveX(bx,by) { let pl=this.x-this.w/2,pr=this.x+this.w/2,pt=this.y-this.h,pb=this.y; if(pr>bx&&pl<bx+1&&pb>by&&pt<by+1){if(this.vx>0){this.x=bx-this.w/2;this.vx=0;}else if(this.vx<0){this.x=bx+1+this.w/2;this.vx=0;}} }
  resolveY(bx,by) { let pl=this.x-this.w/2,pr=this.x+this.w/2,pt=this.y-this.h,pb=this.y; if(pr>bx&&pl<bx+1&&pb>by&&pt<by+1){if(this.vy>0){this.y=by;this.vy=0;this.onGround=true;}else if(this.vy<0){this.y=by+1+this.h;this.vy=0;}} }
  jump() { if(this.onGround){this.vy=-0.35;this.onGround=false;} }
  moveLeft() { this.vx=-0.15; this.dir=-1; }
  moveRight() { this.vx=0.15; this.dir=1; }
  moveCursor(dir) { if(dir==="up")this.cursorY--; else if(dir==="down")this.cursorY++; else if(dir==="left"){this.cursorX--;this.dir=-1;} else if(dir==="right"){this.cursorX++;this.dir=1;} }
}
