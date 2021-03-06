//Aliases
let Application = PIXI.Application;
let Container = PIXI.Container;
let loader = PIXI.Loader.shared;
let resources = loader.resources;
let TextureCache = PIXI.utils.TextureCache;
let Sprite = PIXI.Sprite;
let Rectangle = PIXI.Rectangle;

let app = new PIXI.Application({ 
    width: 792,         // default: 800
    height: 752+85,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,       // default: 1
    backgroundColor: 0xffffff,//0x939a92,
  }
);

let move_buttons = new PIXI.Container();
move_buttons.x = 50;
move_buttons.y = 752;
app.stage.addChild(move_buttons);

let allow_move = false;

// load background
loader
  .add("{{ gameboard }}")
  {% for itm in mobs %}
    .add("{{ itm[1] }}")
  {% endfor %}
  .add("media/mv_btn.png")
  .load(setup);

class Gameboard {
  constructor() {
    this.mobs = new Map();
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);
  }

  set_mob_pos(mobName, mobPos) {
    let pos = this.get_pixel_by_pos(mobPos);
    this.mobs.get(mobName).position.set(pos[0], pos[1]);
  }

  add_mob(mobName, mob) {
    this.mobs.set(mobName, mob);
  }

  get_pixel_by_pos(pos) {
    let x = 43 + Math.round((pos[1] - 1) * 29.5);
    let y = 27 + Math.round((pos[0] - 1) * 28);
    return [x, y];
  }
}

let gameboard = new Gameboard();

function setup() {
  let sz = 85;
  let sz_char = 27;
  gameboard.mainboard = new Sprite(resources["{{ gameboard }}"].texture);
  gameboard.container.addChild(gameboard.mainboard);
  let new_sprite;
  {% for itm in mobs %}
    new_sprite = new Sprite(resources["{{ itm[1] }}"].texture);
    gameboard.add_mob("{{ itm[0] }}", new_sprite);
    new_sprite.height = sz_char;
    new_sprite.width = sz_char;
    gameboard.container.addChild(new_sprite);
  {% endfor %}

  let button_up = new Sprite(resources["media/mv_btn.png"].texture);
  button_up.interactive = true;
  button_up.buttonMode = true;
  button_up.height = sz;
  button_up.width = sz;
  button_up.x = 2*sz;
  button_up.y = 0;
  move_buttons.addChild(button_up);
  let button_down = new Sprite(resources["media/mv_btn.png"].texture);
  button_down.interactive = true;
  button_down.buttonMode = true;
  button_down.height = sz;
  button_down.width = sz;
  button_down.x = 5*sz;
  button_down.y = sz;
  button_down.angle = 180;
  move_buttons.addChild(button_down);
  let button_right = new Sprite(resources["media/mv_btn.png"].texture);
  button_right.interactive = true;
  button_right.buttonMode = true;
  button_right.height = sz;
  button_right.width = sz;
  button_right.x = 7*sz;
  button_right.y = 0;
  button_right.angle = 90;
  move_buttons.addChild(button_right);
  let button_left = new Sprite(resources["media/mv_btn.png"].texture);
  button_left.interactive = true;
  button_left.buttonMode = true;
  button_left.height = sz;
  button_left.width = sz;
  button_left.x = 0;
  button_left.y = sz;
  button_left.angle = 270;
  move_buttons.addChild(button_left);

  button_up.on("click", move_up);
  button_up.on("tap", move_up);
  button_down.on("click", move_down);
  button_down.on("tap", move_down);
  button_left.on("click", move_left);
  button_left.on("tap", move_left);
  button_right.on("click", move_right);
  button_right.on("tap", move_right);
}

//document.onKeyDown = onKeyDown;
document.addEventListener('keydown', onKeyDown);
//
function onKeyDown(e) {
  switch (e.keyCode) {
    case 38:
      move_up();
      break;
    case 40:
      move_down();
      break;
    case 37:
      move_left();
      break;
    case 39:
      move_right();
      break;
  }
}

function move_left(){
  move("left");
}

function move_right(){
  move("right");
}

function move_up(){
  move("up");
}

function move_down(){
  move("down");
}

function move(direction){
  if (allow_move) {
    console.log("Movement " + direction);
    send_movement(direction);
  }
}

function resize_area() {
  var height = window.innerHeight;
  var width = document.documentElement.clientWidth;
  var scale_width = width / 792;
  var scale_height = height / 900;
  var scale = window.devicePixelRatio;
  if (scale_width < scale) {
    scale = scale_width;
  }
  if (scale_height < scale) {
    scale = scale_height;
  }
  var new_height = Math.floor(scale * 900);
  var new_width = Math.floor(scale * 792);

  app.stage.scale.set(scale, scale);
  app.renderer.resize(new_width, new_height);
  var status_width = width - new_width - 20;
  if (status_width < 350) {
    status_width = width;
  }

  $("div.statuspanel").css("max-width", status_width);
}

function initialize_gameboard() {
  $("div.gamepanel").append(app.view);
  window.addEventListener("resize", resize_area);
  resize_area();
}

function enable_move() {
  allow_move = true;
}

function disable_move() {
  allow_move = false;
}

function place_mobs(items) {
  for (var [mobName, mobPos] of Object.entries(items)) {
    gameboard.set_mob_pos(mobName, mobPos);
  }
}
