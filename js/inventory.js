class Inventory {
  constructor(size) { this.slots = new Array(size || 9).fill(null); this.selected = 0; }
  addItem(id, count) {
    count = count || 1;
    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i] && this.slots[i].id === id && ITEMS[id] && ITEMS[id].stackable) {
        let max = ITEMS[id].maxStack || 64;
        let add = Math.min(count, max - this.slots[i].count);
        this.slots[i].count += add; count -= add;
        if (count <= 0) return true;
      }
    }
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i]) { this.slots[i] = {id: id, count: Math.min(count, 64)}; count -= this.slots[i].count; if (count <= 0) return true; }
    }
    return count <= 0;
  }
  removeItem(id, count) {
    count = count || 1;
    for (let i = this.slots.length - 1; i >= 0; i--) {
      if (this.slots[i] && this.slots[i].id === id) {
        let rem = Math.min(count, this.slots[i].count);
        this.slots[i].count -= rem; count -= rem;
        if (this.slots[i].count <= 0) this.slots[i] = null;
        if (count <= 0) return true;
      }
    }
    return count <= 0;
  }
  hasItem(id, count) {
    count = count || 1; let total = 0;
    for (let s of this.slots) { if (s && s.id === id) total += s.count; }
    return total >= count;
  }
  getSelected() { return this.slots[this.selected]; }
  scrollSelect(dir) { this.selected = (this.selected + dir + this.slots.length) % this.slots.length; }
  getCount(id) { let t = 0; for (let s of this.slots) if (s && s.id === id) t += s.count; return t; }
}
