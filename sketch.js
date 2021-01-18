var trex,trexRun,trexJump,trexCollide;
var edges;
var ground,groundImage;
var invisible;
var obstacle;
var score=0;
var PLAY=0;
var END=1;
var gameState=PLAY;
var obstacle,oimage;
var obstaclegroup;
var gameOver,goimage;
var restart,rimage;
var jump,die,check;
var currentFrame=0;
var obstacleframe=0;
var bg,bgimg;

function preload(){
    trexRun=loadAnimation("t6.png","t1.png","t2.png","t3.png","t4.png","t5.png")
    trexJump=loadImage("jump.png")
    trexCollide=loadImage("t2.png")
    groundImage=loadImage("grass.png")
    oimage=loadImage("obstacle.png")
    goimage=loadImage("gameOver.png")
    rimage=loadImage("restart.png")
    bgimg=loadImage("bg2.jpg")
    jump=loadSound("jump.mp3")
    die=loadSound("die.mp3")
    check=loadSound("checkPoint.mp3")
}

function setup(){
  
    // console.time();
     
     createCanvas(windowWidth,windowHeight);
     
     //trex
     trex=createSprite(150,500,20,40);
     trex.addAnimation("trexRun",trexRun);
    trex.addImage("trexJump", trexJump);
     trex.addImage("trexCollide",trexCollide);
     trex.scale=2;
    trex.debug=true;
   trex.setCollider("circle",0,0,35);
     
     edges= createEdgeSprites();
     
     //ground
     ground=createSprite(displayWidth/2,650,displayWidth,10)
     ground.addImage("ground", groundImage);
     
     //invisible ground
     invisible= createSprite(ground.x,ground.y+50,ground.width,5);
     invisible.visible=false;
     
     //gameover and restart
     gameOver=createSprite(displayWidth/2+50,displayHeight/2-100);
     gameOver.addImage("goimage",goimage);
     gameOver.scale=1;
     gameOver.visible=false;
     
     restart=createSprite(displayWidth/2+50,displayHeight/2);
     restart.addImage("rimage",rimage);
     restart.scale=1
     restart.visible=false;

     obstaclegroup=new Group();

     }
     function draw(){
        
        background(bgimg);
      
        trex.changeAnimation("trexRun");

        if(gameState===PLAY){
          //make trex jump
        if(keyDown("space") && trex.y>=500){
           trex.velocityY=-15;
          jump.play();
        }
      console.log(trex.y)
        //camera
        camera.position.y=trex.y/2;

        //to give gravity to trex
       trex.velocityY+=0.8;
        
           //velocity of ground
        ground.velocityX=-(5+score/50);
        
        //reset the ground
        if(ground.x<100){
          ground.x=ground.width/2+100;
        }
        
       if (trex.y<500){
          trex.changeAnimation("trexJump");
        }
          
           score=score+Math.round(getFrameRate()/60);
          
          if(score % 100===0 && score>0 ){
            check.play();       
          }
          
         if(trex.isTouching(obstaclegroup)){
           die.play();
           gameState=END;
          }
           
        }
        
        else if(gameState===END){
          ground.velocityX=0;
          obstaclegroup.setVelocityXEach(0);
          obstaclegroup.setLifetimeEach(-1);
          trex.changeAnimation("trexCollide");
          gameOver.visible=true;
          restart.visible=true;
          trex.velocityY=0;
          
         // to restart the game
          if(mousePressedOver(restart) || keyDown("Space")){
            reset()
          }
        }
      
        spawnObstacles()

        //trex collides
       trex.collide(invisible);
        
       //score
        textSize(40)
        fill(255)
        textFont("Times New Roman")
        text("Score: "+ score,displayWidth/2+750,displayHeight-650);
        
        drawSprites()
        
      }

      function spawnObstacles(){
        var r=Math.round(random(80,100))
        if(frameCount% 100===0 ){
          obstacle=createSprite(displayWidth,620);
          obstacle.velocityX=-(6+score/100)
          obstacle.addImage("obstacle",oimage)
         // obstacle.debug=true;
          obstacle.setCollider("rectangle",0,0,50,150)
          obstacleframe=frameCount;
          obstacle.scale=0.7;
          obstacle.lifetime=1100;
          obstaclegroup.add(obstacle);
        }
      }

      function reset(){
        gameState=PLAY;
        score=0;
        obstaclegroup.destroyEach();
        trex.changeAnimation("trexRun");
        gameOver.visible=false;
        restart.visible=false;

      }