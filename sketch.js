const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con, fruit_con_2, fruit_con_3;
var bg_img, food, rabbit;
var bunny;
var button, button2, button3;
var blink,eat,sad;
var bk_song, cut_sound, sad_sound, eating_sound, air;
var air;
var blower;
var mute_btn;


function preload(){
  bg_img = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);
  engine = Engine.create();
  world = engine.world;
  
  //btn 1
  button = createImg('cut_btn.png');
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //btn 2
  button2 = createImg('cut_btn.png');
  button2.position(330,35);
  button2.size(60,60);
  button2.mouseClicked(drop2);

  //btn3
  button3 = createImg('cut_btn.png');
  button3.position(360,200);
  button3.size(60,60);
  button3.mouseClicked(drop3);

  /*blower = createImg('balloon.png');
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airblow);*/

  mute_btn = createImg('mute.png');
  mute_btn.position(450,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

 

  bunny = createSprite(170,canH-80,100,100);
  bunny.addImage(rabbit);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  ground = new Ground(200,canH,600,20);
  rope = new Rope(8, {x:40, y:30});
  rope2 = new Rope(7,{x:370, y:40});
  rope3 = new Rope(4,{x:400, y:225});

  var fruit_options={
    density: 0.001
  }
  fruit = Bodies.circle(300,300,15,fruit_options);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con_2 = new Link(rope2, fruit);
  fruit_con_3 = new Link(rope3, fruit);

 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  
}

function draw() {
  background(51);

  image(bg_img,0,0,displayWidth+80,displayHeight);  
  imageMode(CENTER);
  rope.show();
  rope2.show();
  rope3.show();
 
  if(fruit !=null){ 
  image(food, fruit.position.x,fruit.position.y,70,70);
  }

  ground.show();

  Engine.update(engine);

  if(collide(fruit,bunny)==true){
    bunny.changeAnimation('eating');
    eating_sound.play();
  }
   
  /*if(collide(fruit,ground.body)==true ){
     bunny.changeAnimation('crying');
   }*/
   if(fruit!=null && fruit.position.y>=650){
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;     
   }


  drawSprites();
   
}
function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
}
function drop2(){
  cut_sound.play();
  rope2.break();
  fruit_con_2.detach();
  fruit_con_2 = null; 
}
function drop3(){
  cut_sound.play();
  rope3.break();
  fruit_con_3.detach();
  fruit_con_3 = null; 
}

function collide(body,sprite) {
  if(body !=null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
      if(d<=80){
        World.remove(engine.world,fruit);
        fruit = null;
        return true;
      }
      else{
        return false;
      }
    }
}

function airblow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  air.play();
}

function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop();
  }
  else{
    bk_song.play();
  }
}