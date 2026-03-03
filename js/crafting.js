// Crafting System
class CraftingSystem {
  constructor() { this.grid=[[null,null,null],[null,null,null],[null,null,null]]; this.result=null; this.sel={r:0,c:0}; this.isOpen=false; this.browseMode=false; this.browseIdx=0; }
  open() { this.isOpen=true; this.grid=[[null,null,null],[null,null,null],[null,null,null]]; this.result=null; this.sel={r:0,c:0}; this.browseMode=false; }
  close() { this.isOpen=false; for(let r=0;r<3;r++) for(let c=0;c<3;c++) { if(this.grid[r][c]) { inventory.addItem(this.grid[r][c].id,this.grid[r][c].count); this.grid[r][c]=null; } } }
  move(dir) { if(this.browseMode){if(dir=="up")this.browseIdx=Math.max(0,this.browseIdx-1);if(dir=="down")this.browseIdx++;return;} if(dir=="up")this.sel.r=Math.max(0,this.sel.r-1);if(dir=="down")this.sel.r=Math.min(2,this.sel.r+1);if(dir=="left")this.sel.c=Math.max(0,this.sel.c-1);if(dir=="right")this.sel.c=Math.min(2,this.sel.c+1); }
  placeItem(id) { let r=this.sel.r,c=this.sel.c; if(this.grid[r][c]){inventory.addItem(this.grid[r][c].id,this.grid[r][c].count);} if(inventory.hasItem(id)){inventory.removeItem(id,1);this.grid[r][c]={id:id,count:1};this.checkRecipe();} }
  removeItem() { let r=this.sel.r,c=this.sel.c; if(this.grid[r][c]){inventory.addItem(this.grid[r][c].id,this.grid[r][c].count);this.grid[r][c]=null;this.checkRecipe();} }
  checkRecipe() { this.result=null; for(let r of CRAFTING_RECIPES){if(this.matchPattern(r.pattern)){this.result={id:r.result,count:r.count,name:r.name};return;}} }
  matchPattern(p) { let oR=-1,oC=-1,pH=0,pW=0; for(let r=0;r<3;r++)for(let c=0;c<3;c++){if(p[r][c]!==null){if(oR===-1){oR=r;oC=c;}pH=Math.max(pH,r-oR+1);pW=Math.max(pW,c-oC+1);}} if(oR===-1)return false; let gR=-1,gC=-1,gH=0,gW=0; for(let r=0;r<3;r++)for(let c=0;c<3;c++){if(this.grid[r][c]!==null){if(gR===-1){gR=r;gC=c;}gH=Math.max(gH,r-gR+1);gW=Math.max(gW,c-gC+1);}} if(gR===-1||pH!==gH||pW!==gW)return false; for(let r=0;r<pH;r++)for(let c=0;c<pW;c++){let pi=p[oR+r]?p[oR+r][oC+c]:null;let gi=this.grid[gR+r]?this.grid[gR+r][gC+c]:null;if(pi!==(gi?gi.id:null))return false;} return true; }
  craft() { if(!this.result)return false; for(let r=0;r<3;r++)for(let c=0;c<3;c++){if(this.grid[r][c]){this.grid[r][c].count--;if(this.grid[r][c].count<=0)this.grid[r][c]=null;}} inventory.addItem(this.result.id,this.result.count); this.checkRecipe(); return true; }
  quickCraft(idx) { let av=this.getAvailable(); let r=av[idx]; if(!r)return false; let need={}; for(let i=0;i<3;i++)for(let j=0;j<3;j++){if(r.pattern[i][j]){let id=r.pattern[i][j];need[id]=(need[id]||0)+1;}} for(let id in need){if(!inventory.hasItem(id,need[id]))return false;} for(let id in need)inventory.removeItem(id,need[id]); inventory.addItem(r.result,r.count); return true; }
  getAvailable() { return CRAFTING_RECIPES.filter(r=>{let n={};for(let i=0;i<3;i++)for(let j=0;j<3;j++){if(r.pattern[i][j]){let id=r.pattern[i][j];n[id]=(n[id]||0)+1;}} for(let id in n){if(!inventory.hasItem(id,n[id]))return false;} return true;}); }
}
CraftingSystem.prototype.render = function(ctx,w,h) {
  ctx.fillStyle="#2a1a0a";ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#fff";ctx.font="10px monospace";ctx.fillText("CRAFTING TABLE",5,12);
  let sz=22,pad=2,sx=10,sy=22;
  for(let r=0;r<3;r++){for(let c=0;c<3;c++){let x=sx+c*(sz+pad),y=sy+r*(sz+pad);let s=(r===this.sel.r&&c===this.sel.c&&!this.browseMode);ctx.fillStyle=s?"#ffcc00":"#555";ctx.fillRect(x,y,sz,sz);ctx.fillStyle="#333";ctx.fillRect(x+1,y+1,sz-2,sz-2);if(this.grid[r][c]){let it=ITEMS[this.grid[r][c].id];if(it){ctx.fillStyle=it.color||"#fff";ctx.font="14px monospace";ctx.fillText(it.symbol,x+6,y+16);}}}}
  ctx.fillStyle="#fff";ctx.font="16px monospace";ctx.fillText("=>",sx+3*(sz+pad)+4,sy+sz+8);
  let rx=sx+3*(sz+pad)+28,ry=sy+sz-4;ctx.fillStyle=this.result?"#4a4":"#555";ctx.fillRect(rx,ry,sz+4,sz+4);ctx.fillStyle="#333";ctx.fillRect(rx+1,ry+1,sz+2,sz+2);
  if(this.result){let it=ITEMS[this.result.id];if(it){ctx.fillStyle=it.color;ctx.font="14px monospace";ctx.fillText(it.symbol,rx+8,ry+18);ctx.font="8px monospace";ctx.fillText("x"+this.result.count,rx+sz-4,ry+sz+2);}}
  let av=this.getAvailable();let yy=sy+3*(sz+pad)+8;
  ctx.fillStyle="#8f8";ctx.font="9px monospace";ctx.fillText("Available ("+av.length+"):",5,yy);
  for(let i=0;i<Math.min(av.length,6);i++){let hl=(this.browseMode&&this.browseIdx===i);ctx.fillStyle=hl?"#ffcc00":"#8f8";ctx.fillText((hl?"> ":" ")+av[i].name,5,yy+12+i*11);}
  ctx.fillStyle="#aaa";ctx.font="8px monospace";ctx.fillText("Scroll=Navigate Side=Select",5,h-18);ctx.fillText("E=Browse Esc=Close",5,h-8);
};
