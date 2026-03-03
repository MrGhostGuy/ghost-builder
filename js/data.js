// Ghost Builder - Game Data
// Block types use ASCII text identifiers (no emoji) to avoid encoding issues
const BLOCKS = {
  AIR: { id: 0, name: 'Air', symbol: ' ', color: null, solid: false, breakable: false },
    DIRT: { id: 1, name: 'Dirt', symbol: 'D', color: '#8B6914', solid: true, breakable: true, drops: 'DIRT' },
      GRASS: { id: 2, name: 'Grass', symbol: 'G', color: '#228B22', solid: true, breakable: true, drops: 'DIRT' },
        STONE: { id: 3, name: 'Stone', symbol: 'S', color: '#808080', solid: true, breakable: true, drops: 'COBBLESTONE' },
          COBBLESTONE: { id: 4, name: 'Cobblestone', symbol: 'C', color: '#696969', solid: true, breakable: true, drops: 'COBBLESTONE' },
            WOOD: { id: 5, name: 'Wood Log', symbol: 'W', color: '#8B4513', solid: true, breakable: true, drops: 'WOOD' },
              LEAVES: { id: 6, name: 'Leaves', symbol: 'L', color: '#006400', solid: true, breakable: true, drops: null },
                PLANKS: { id: 7, name: 'Wood Planks', symbol: 'P', color: '#DEB887', solid: true, breakable: true, drops: 'PLANKS' },
                  SAND: { id: 8, name: 'Sand', symbol: 'a', color: '#F4A460', solid: true, breakable: true, drops: 'SAND' },
                    WATER: { id: 9, name: 'Water', symbol: '~', color: '#4169E1', solid: false, breakable: false },
                      BEDROCK: { id: 10, name: 'Bedrock', symbol: 'B', color: '#2F2F2F', solid: true, breakable: false },
                        COAL_ORE: { id: 11, name: 'Coal Ore', symbol: 'c', color: '#333333', solid: true, breakable: true, drops: 'COAL' },
                          IRON_ORE: { id: 12, name: 'Iron Ore', symbol: 'i', color: '#CD853F', solid: true, breakable: true, drops: 'IRON_ORE' },
                            GOLD_ORE: { id: 13, name: 'Gold Ore', symbol: 'g', color: '#FFD700', solid: true, breakable: true, drops: 'GOLD_ORE' },
                              DIAMOND_ORE: { id: 14, name: 'Diamond Ore', symbol: 'd', color: '#00CED1', solid: true, breakable: true, drops: 'DIAMOND' },
                                CRAFTING_TABLE: { id: 15, name: 'Crafting Table', symbol: '#', color: '#CD853F', solid: true, breakable: true, drops: 'CRAFTING_TABLE', interactive: true },
                                  FURNACE: { id: 16, name: 'Furnace', symbol: 'F', color: '#A0A0A0', solid: true, breakable: true, drops: 'FURNACE', interactive: true },
                                    GLASS: { id: 17, name: 'Glass', symbol: 'O', color: '#E0FFFF', solid: true, breakable: true, drops: null },
                                      BRICK: { id: 18, name: 'Brick', symbol: 'K', color: '#B22222', solid: true, breakable: true, drops: 'BRICK' },
                                        OBSIDIAN: { id: 19, name: 'Obsidian', symbol: 'X', color: '#1A0A2E', solid: true, breakable: true, drops: 'OBSIDIAN' },
                                          GRAVEL: { id: 20, name: 'Gravel', symbol: 'v', color: '#A9A9A9', solid: true, breakable: true, drops: 'GRAVEL' }
                                          };
                                          
// Items that can be in inventory
const ITEMS = {
  DIRT: { name: 'Dirt', symbol: 'D', color: '#8B6914', stackable: true, maxStack: 64, placeable: true, blockType: 'DIRT' },
    COBBLESTONE: { name: 'Cobblestone', symbol: 'C', color: '#696969', stackable: true, maxStack: 64, placeable: true, blockType: 'COBBLESTONE' },
      WOOD: { name: 'Wood', symbol: 'W', color: '#8B4513', stackable: true, maxStack: 64, placeable: true, blockType: 'WOOD' },
        PLANKS: { name: 'Planks', symbol: 'P', color: '#DEB887', stackable: true, maxStack: 64, placeable: true, blockType: 'PLANKS' },
          SAND: { name: 'Sand', symbol: 'a', color: '#F4A460', stackable: true, maxStack: 64, placeable: true, blockType: 'SAND' },
            COAL: { name: 'Coal', symbol: 'c', color: '#333', stackable: true, maxStack: 64 },
              IRON_ORE: { name: 'Iron Ore', symbol: 'i', color: '#CD853F', stackable: true, maxStack: 64 },
                IRON_INGOT: { name: 'Iron Ingot', symbol: 'I', color: '#C0C0C0', stackable: true, maxStack: 64 },
                  GOLD_ORE: { name: 'Gold Ore', symbol: 'g', color: '#FFD700', stackable: true, maxStack: 64 },
                    GOLD_INGOT: { name: 'Gold Ingot', symbol: '$', color: '#FFD700', stackable: true, maxStack: 64 },
                      DIAMOND: { name: 'Diamond', symbol: '*', color: '#00CED1', stackable: true, maxStack: 64 },
                        STICK: { name: 'Stick', symbol: '/', color: '#DEB887', stackable: true, maxStack: 64 },
                          CRAFTING_TABLE: { name: 'Crafting Table', symbol: '#', color: '#CD853F', stackable: true, maxStack: 64, placeable: true, blockType: 'CRAFTING_TABLE' },
                            FURNACE: { name: 'Furnace', symbol: 'F', color: '#A0A0A0', stackable: true, maxStack: 64, placeable: true, blockType: 'FURNACE' },
                              WOOD_PICKAXE: { name: 'Wood Pickaxe', symbol: 'T', color: '#DEB887', stackable: false, tool: true, toolType: 'pickaxe', power: 1 },
                                STONE_PICKAXE: { name: 'Stone Pickaxe', symbol: 'T', color: '#808080', stackable: false, tool: true, toolType: 'pickaxe', power: 2 },
                                  IRON_PICKAXE: { name: 'Iron Pickaxe', symbol: 'T', color: '#C0C0C0', stackable: false, tool: true, toolType: 'pickaxe', power: 3 },
                                    GOLD_PICKAXE: { name: 'Gold Pickaxe', symbol: 'T', color: '#FFD700', stackable: false, tool: true, toolType: 'pickaxe', power: 2 },
                                      DIAMOND_PICKAXE: { name: 'Diamond Pickaxe', symbol: 'T', color: '#00CED1', stackable: false, tool: true, toolType: 'pickaxe', power: 4 },
                                        WOOD_SWORD: { name: 'Wood Sword', symbol: '!', color: '#DEB887', stackable: false, weapon: true, damage: 2 },
                                          STONE_SWORD: { name: 'Stone Sword', symbol: '!', color: '#808080', stackable: false, weapon: true, damage: 3 },
                                            IRON_SWORD: { name: 'Iron Sword', symbol: '!', color: '#C0C0C0', stackable: false, weapon: true, damage: 4 },
                                              GOLD_SWORD: { name: 'Gold Sword', symbol: '!', color: '#FFD700', stackable: false, weapon: true, damage: 3 },
                                                DIAMOND_SWORD: { name: 'Diamond Sword', symbol: '!', color: '#00CED1', stackable: false, weapon: true, damage: 5 },
                                                  WOOD_AXE: { name: 'Wood Axe', symbol: 'A', color: '#DEB887', stackable: false, tool: true, toolType: 'axe', power: 1 },
                                                    STONE_AXE: { name: 'Stone Axe', symbol: 'A', color: '#808080', stackable: false, tool: true, toolType: 'axe', power: 2 },
                                                      IRON_AXE: { name: 'Iron Axe', symbol: 'A', color: '#C0C0C0', stackable: false, tool: true, toolType: 'axe', power: 3 },
                                                        DIAMOND_AXE: { name: 'Diamond Axe', symbol: 'A', color: '#00CED1', stackable: false, tool: true, toolType: 'axe', power: 4 },
                                                          WOOD_SHOVEL: { name: 'Wood Shovel', symbol: 'V', color: '#DEB887', stackable: false, tool: true, toolType: 'shovel', power: 1 },
                                                            STONE_SHOVEL: { name: 'Stone Shovel', symbol: 'V', color: '#808080', stackable: false, tool: true, toolType: 'shovel', power: 2 },
                                                              IRON_SHOVEL: { name: 'Iron Shovel', symbol: 'V', color: '#C0C0C0', stackable: false, tool: true, toolType: 'shovel', power: 3 },
                                                                DIAMOND_SHOVEL: { name: 'Diamond Shovel', symbol: 'V', color: '#00CED1', stackable: false, tool: true, toolType: 'shovel', power: 4 },
                                                                  WOOD_HOE: { name: 'Wood Hoe', symbol: 'H', color: '#DEB887', stackable: false, tool: true, toolType: 'hoe', power: 1 },
                                                                    STONE_HOE: { name: 'Stone Hoe', symbol: 'H', color: '#808080', stackable: false, tool: true, toolType: 'hoe', power: 2 },
                                                                      IRON_HOE: { name: 'Iron Hoe', symbol: 'H', color: '#C0C0C0', stackable: false, tool: true, toolType: 'hoe', power: 3 },
                                                                        DIAMOND_HOE: { name: 'Diamond Hoe', symbol: 'H', color: '#00CED1', stackable: false, tool: true, toolType: 'hoe', power: 4 },
                                                                          GRAVEL: { name: 'Gravel', symbol: 'v', color: '#A9A9A9', stackable: true, maxStack: 64, placeable: true, blockType: 'GRAVEL' },
                                                                            BRICK: { name: 'Brick', symbol: 'K', color: '#B22222', stackable: true, maxStack: 64, placeable: true, blockType: 'BRICK' },
                                                                              GLASS: { name: 'Glass', symbol: 'O', color: '#E0FFFF', stackable: true, maxStack: 64, placeable: true, blockType: 'GLASS' },
                                                                                OBSIDIAN: { name: 'Obsidian', symbol: 'X', color: '#1A0A2E', stackable: true, maxStack: 64, placeable: true, blockType: 'OBSIDIAN' },
                                                                                  TORCH: { name: 'Torch', symbol: 'f', color: '#FFD700', stackable: true, maxStack: 64 }
                                                                                  };
                                                                                  
// Crafting Recipes - 3x3 grid (null = empty slot)
// Each recipe: { result: itemId, count: number, pattern: 3x3 array }
const CRAFTING_RECIPES = [
  { name: 'Planks', result: 'PLANKS', count: 4, pattern: [['WOOD',null,null],[null,null,null],[null,null,null]] },
    { name: 'Sticks', result: 'STICK', count: 4, pattern: [['PLANKS',null,null],['PLANKS',null,null],[null,null,null]] },
      { name: 'Crafting Table', result: 'CRAFTING_TABLE', count: 1, pattern: [['PLANKS','PLANKS',null],['PLANKS','PLANKS',null],[null,null,null]] },
        { name: 'Furnace', result: 'FURNACE', count: 1, pattern: [['COBBLESTONE','COBBLESTONE','COBBLESTONE'],['COBBLESTONE',null,'COBBLESTONE'],['COBBLESTONE','COBBLESTONE','COBBLESTONE']] },
          { name: 'Torch', result: 'TORCH', count: 4, pattern: [['COAL',null,null],['STICK',null,null],[null,null,null]] },
            { name: 'Wood Pickaxe', result: 'WOOD_PICKAXE', count: 1, pattern: [['PLANKS','PLANKS','PLANKS'],[null,'STICK',null],[null,'STICK',null]] },
              { name: 'Stone Pickaxe', result: 'STONE_PICKAXE', count: 1, pattern: [['COBBLESTONE','COBBLESTONE','COBBLESTONE'],[null,'STICK',null],[null,'STICK',null]] },
                { name: 'Iron Pickaxe', result: 'IRON_PICKAXE', count: 1, pattern: [['IRON_INGOT','IRON_INGOT','IRON_INGOT'],[null,'STICK',null],[null,'STICK',null]] },
                  { name: 'Gold Pickaxe', result: 'GOLD_PICKAXE', count: 1, pattern: [['GOLD_INGOT','GOLD_INGOT','GOLD_INGOT'],[null,'STICK',null],[null,'STICK',null]] },
                    { name: 'Diamond Pickaxe', result: 'DIAMOND_PICKAXE', count: 1, pattern: [['DIAMOND','DIAMOND','DIAMOND'],[null,'STICK',null],[null,'STICK',null]] },
                      { name: 'Wood Sword', result: 'WOOD_SWORD', count: 1, pattern: [[null,'PLANKS',null],[null,'PLANKS',null],[null,'STICK',null]] },
                        { name: 'Stone Sword', result: 'STONE_SWORD', count: 1, pattern: [[null,'COBBLESTONE',null],[null,'COBBLESTONE',null],[null,'STICK',null]] },
                          { name: 'Iron Sword', result: 'IRON_SWORD', count: 1, pattern: [[null,'IRON_INGOT',null],[null,'IRON_INGOT',null],[null,'STICK',null]] },
                            { name: 'Gold Sword', result: 'GOLD_SWORD', count: 1, pattern: [[null,'GOLD_INGOT',null],[null,'GOLD_INGOT',null],[null,'STICK',null]] },
                              { name: 'Diamond Sword', result: 'DIAMOND_SWORD', count: 1, pattern: [[null,'DIAMOND',null],[null,'DIAMOND',null],[null,'STICK',null]] },
                                { name: 'Wood Axe', result: 'WOOD_AXE', count: 1, pattern: [['PLANKS','PLANKS',null],['PLANKS','STICK',null],[null,'STICK',null]] },
                                  { name: 'Stone Axe', result: 'STONE_AXE', count: 1, pattern: [['COBBLESTONE','COBBLESTONE',null],['COBBLESTONE','STICK',null],[null,'STICK',null]] },
                                    { name: 'Iron Axe', result: 'IRON_AXE', count: 1, pattern: [['IRON_INGOT','IRON_INGOT',null],['IRON_INGOT','STICK',null],[null,'STICK',null]] },
                                      { name: 'Diamond Axe', result: 'DIAMOND_AXE', count: 1, pattern: [['DIAMOND','DIAMOND',null],['DIAMOND','STICK',null],[null,'STICK',null]] },
                                        { name: 'Wood Shovel', result: 'WOOD_SHOVEL', count: 1, pattern: [[null,'PLANKS',null],[null,'STICK',null],[null,'STICK',null]] },
                                          { name: 'Stone Shovel', result: 'STONE_SHOVEL', count: 1, pattern: [[null,'COBBLESTONE',null],[null,'STICK',null],[null,'STICK',null]] },
                                            { name: 'Iron Shovel', result: 'IRON_SHOVEL', count: 1, pattern: [[null,'IRON_INGOT',null],[null,'STICK',null],[null,'STICK',null]] },
                                              { name: 'Diamond Shovel', result: 'DIAMOND_SHOVEL', count: 1, pattern: [[null,'DIAMOND',null],[null,'STICK',null],[null,'STICK',null]] },
                                                { name: 'Wood Hoe', result: 'WOOD_HOE', count: 1, pattern: [['PLANKS','PLANKS',null],[null,'STICK',null],[null,'STICK',null]] },
                                                  { name: 'Stone Hoe', result: 'STONE_HOE', count: 1, pattern: [['COBBLESTONE','COBBLESTONE',null],[null,'STICK',null],[null,'STICK',null]] },
                                                    { name: 'Iron Hoe', result: 'IRON_HOE', count: 1, pattern: [['IRON_INGOT','IRON_INGOT',null],[null,'STICK',null],[null,'STICK',null]] },
                                                      { name: 'Diamond Hoe', result: 'DIAMOND_HOE', count: 1, pattern: [['DIAMOND','DIAMOND',null],[null,'STICK',null],[null,'STICK',null]] }
                                                      ];
                                                      
// Smelting recipes for furnace
const SMELTING_RECIPES = [
  { input: 'IRON_ORE', result: 'IRON_INGOT', fuel: 'COAL' },
    { input: 'GOLD_ORE', result: 'GOLD_INGOT', fuel: 'COAL' },
      { input: 'SAND', result: 'GLASS', fuel: 'COAL' },
        { input: 'COBBLESTONE', result: 'STONE', fuel: 'COAL' }
        ];
        
// World generation parameters
const WORLD_CONFIG = {
  width: 256,
    height: 64,
      seaLevel: 32,
        groundLevel: 40,
          treeChance: 0.08,
            caveChance: 0.04,
              oreChance: { coal: 0.03, iron: 0.02, gold: 0.008, diamond: 0.004 }
              };
              