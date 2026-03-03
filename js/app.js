// Ghost Builder - Main App
let inventory = null;
let game = null;
document.addEventListener("DOMContentLoaded", function() {
  let canvas = document.getElementById("gameCanvas");
  if(!canvas){canvas=document.createElement("canvas");canvas.id="gameCanvas";canvas.width=240;canvas.height=282;document.getElementById("app").appendChild(canvas);}
  game = new Game();
  game.init(canvas);
  game.start();
  // R1 Hardware events
  if(typeof hardwareAPI !== "undefined") {
    hardwareAPI.on("scrollUp", function(){game.onScroll("up");});
    hardwareAPI.on("scrollDown", function(){game.onScroll("down");});
    hardwareAPI.on("sideClick", function(){game.onSide();});
    hardwareAPI.on("longPressStart", function(){game.onLongPress();});
  }
  // Keyboard fallback for testing
  document.addEventListener("keydown", function(e){game.handleKey(e.key);});
});
