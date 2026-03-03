// App entry point
var game = new Game();
game.state = "title";
game.renderer = new Renderer();
game.render();
// R1 Hardware events
if (typeof hardwareAPI !== "undefined") {
  hardwareAPI.addEventListener("scrollUp", function() { game.onScroll("up"); });
  hardwareAPI.addEventListener("scrollDown", function() { game.onScroll("down"); });
  hardwareAPI.addEventListener("sideClick", function() { game.onSide(); });
  hardwareAPI.addEventListener("longPressStart", function() { game.onLongPress(); });
}
// Keyboard fallback
document.addEventListener("keydown", function(e) { game.handleKey(e.key); });
