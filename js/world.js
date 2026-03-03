// World Generation
class World {
  constructor(w,h) { this.w=w||256; this.h=h||64; this.blocks=[]; this.generate(); }
  generate() { let cfg=WORLD_CONFIG; this.blocks=[]; for(let x=0;x<this.w;x++){this.blocks[x]=[]; let surf=cfg.groundLevel+Math.floor(Math.sin(x*0.1)*3+Math.sin(x*0.05)*2); for(let y=0;y<this.h;y++){if(y===0)this.blocks[x][y]="BEDROCK"; else if(y<surf-5){let r=Math.random(); if(y<10&&r<cfg.oreChance.diamond)this.blocks[x][y]="DIAMOND_ORE"; else if(y<20&&r<cfg.oreChance.gold)this.blocks[x][y]="GOLD_ORE"; else if(y<30&&r<cfg.oreChance.iron)this.blocks[x][y]="IRON_ORE"; else if(r<cfg.oreChance.coal)this.blocks[x][y]="COAL_ORE"; else if(r<cfg.caveChance)this.blocks[x][y]="AIR"; else this.blocks[x][y]="STONE";} else if(y<surf-1)this.blocks[x][y]="DIRT"; else if(y===surf-1)this.blocks[x][y]="GRASS"; else this.blocks[x][y]="AIR";}} this.addTrees(); }
  addTrees() { for(let x=3;x<this.w-3;x++){if(Math.random()<WORLD_CONFIG.treeChance){let g=this.getSurface(x); if(g>0&&this.blocks[x][g-1]==="GRASS"){for(let ty=1;ty<=4;ty++){if(g-1-ty>=0)this.blocks[x][g-1-ty]="WOOD";} for(let dx=-2;dx<=2;dx++)for(let dy=4;dy<=6;dy++){let tx=x+dx;if(tx>=0&&tx<this.w&&g-1-dy>=0)this.blocks[tx][g-1-dy]="LEAVES";}}}} }
  getSurface(x) { for(let y=this.h-1;y>=0;y--){if(this.blocks[x][y]!=="AIR")return y+1;} return this.h-1; }
  getBlock(x,y) { if(x<0||x>=this.w||y<0||y>=this.h)return "AIR"; return this.blocks[x][y]; }
  setBlock(x,y,type) { if(x>=0&&x<this.w&&y>=0&&y<this.h)this.blocks[x][y]=type; }
  breakBlock(x,y) { let b=this.getBlock(x,y); if(b==="AIR"||b==="BEDROCK")return null; let block=BLOCKS[b]; if(!block||!block.breakable)return null; let drop=block.drops; this.blocks[x][y]="AIR"; return drop; }
  isSolid(x,y) { let b=this.getBlock(x,y); return BLOCKS[b]&&BLOCKS[b].solid; }
}
