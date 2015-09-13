//Pointables Code

var color = d3.scale.category10();

var pointParcoords = d3.parcoords()("#pointables")
  .margin({
    top: 60,
    left: 0,
    right: 0,
    bottom: 10
  })
  .data([{
    directionX: -1,
    directionY: -1,
    directionZ: -1,
    tipPositionX: -250,
    tipPositionY: 0,
    tipPositionZ: -250
  }, {
    directionX: 1,
    directionY: 1,
    directionZ: 1,
    tipPositionX: 250,
    tipPositionY: 400,
    tipPositionZ: 250
  }])
  .alpha(1)
  .color(function(d) { return color(d.handId);})
  .render()
  .reorderable();
pointParcoords.ctx.foreground.lineWidth = 3.5;

d3.selectAll("text.label")
  .attr("dy", function(d,i) { return i % 2 ? -32 : -8; });

//Three Viz Code

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 600/300, 0.10, 1000);

  var canvasObj= {canvas : document.getElementById("myCanvas")};
  var renderer = new THREE.WebGLRenderer(canvasObj);
  //renderer.setSize(600, 300);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 500;
  camera.position.y = 200;
  camera.lookAt(new THREE.Vector3(0,200,0));

  var fingers = {};
  var spheres = {};


//Robotic Arm Code

// Position variables for the Leap
var handPosition;
var fingerDistance;
var angles;

// Movement variables
var moveBase, moveShoulder, moveElbow, moveClaw;
var frames = [];

/*
 * Settings
 */
var normalize = 3;
var minimumClawDistance = 15;


// Restricted input values (in Leap space). 
// You can change these depending on how you build your robot arm.
var MAX_Y = 300;
var MIN_Y = 120;
var MAX_Z = 200;

/*
 * Need to set up 4 servos: shoulder, elbow, claw, and base
 * Use inverse kinematics equation on servoShoulder & servoElbow
 * Use fingerDistance to rotate servoClaw to desired position
 * Servos must be placed on the Arduino's PWM pins
 */


//Previous Values 
var Pbase = 0, Pshoulder = 0 ,Pelbow = 0 ,Pclaw = 0 ;

// Leap motion controller
var controller = new Leap.Controller();

// Main Leap frame loop
controller.on('frame', function(frame) {
  // Hand position controls the robot arm position
  if(frame.hands.length > 0) {
    handPosition = frame.hands[0].palmPosition;

    // Restrict certain inputs to prevent physical damage
    // These values can be changed depending on 
    if(handPosition[1] < 120) handPosition[1] = 120;
    if(handPosition[1] > 415) handPosition[1] = 415;
    if(handPosition[2] > 200) handPosition[2] = 200;

    // Calculate all of the movement angles
    angles = calculateInverseKinematics(0,-10+handPosition[1]/normalize,handPosition[2]/normalize);
    moveBase = 180-calculateBaseAngle(handPosition[0]/1.5);
    moveShoulder =180 - toDegrees(angles.theta1);
    moveElbow = 45+toDegrees(angles.theta2);
   }


// Finger distance (of two fingers only) controls the end effector
  if(frame.pointables.length > 1) {
    f1 = frame.pointables[0];
    f2 = frame.pointables[1];
    fingerDistance = distance(f1.tipPosition[0],f1.tipPosition[1],f1.tipPosition[2],f2.tipPosition[0],f2.tipPosition[1],f2.tipPosition[2]);
    moveClaw = (fingerDistance/1.2) - minimumClawDistance;
  }
  
  //Floor all the angles
  moveBase = Math.floor(moveBase) ;
  moveShoulder = Math.floor(moveShoulder) ;
  moveElbow = Math.floor(moveElbow) ;
  moveClaw =  Math.floor(moveClaw) ;


if( moveBase!= Pbase || moveShoulder != Pshoulder || moveElbow != Pelbow || moveClaw != Pclaw){
 // Display Frame object data
//var frameOutput = document.getElementById("frameData");
var frameString = "*" + moveBase + " " + moveShoulder + " " + moveElbow + " " + moveClaw + "$";

//frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";


try {
    doSend(frameString);

}
catch(err) {
   
}


}

Pbase = moveBase;
Pshoulder = moveShoulder;
Pelbow = moveElbow;
Pclaw = moveClaw;


//Pointables Code
var pointables = frame.pointables.map(function(d) {
    return {
      directionX: d.direction[0],
      directionY: d.direction[1],
      directionZ: d.direction[2],
      tipPositionX: d.tipPosition[0],
      tipPositionY: d.tipPosition[1],
      tipPositionZ: d.tipPosition[2]
    }
  });

  

  pointParcoords.data(pointables).render();

//Three Viz Code
var fingerIds = {};
    var handIds = {};

    for (var index = 0; index < frame.pointables.length; index++) {

      var pointable = frame.pointables[index];
      var finger = fingers[pointable.id];

      var pos = pointable.tipPosition;
      var dir = pointable.direction;

      var origin = new THREE.Vector3(pos[0], pos[1], pos[2]);
      var direction = new THREE.Vector3(dir[0], dir[1], dir[2]);

      if (!finger) {
        finger = new THREE.ArrowHelper(origin, direction, 40, Math.random() * 0xffffff);
        fingers[pointable.id] = finger;
        scene.add(finger);
      }

      finger.position = origin;
      finger.setDirection(direction);

      fingerIds[pointable.id] = true;
    }

    for (fingerId in fingers) {
      if (!fingerIds[fingerId]) {
        scene.remove(fingers[fingerId]);
        delete fingers[fingerId];
      }
    }
    renderer.render(scene, camera);

});

// Leap Motion connected
controller.on('connect', function(frame) {
  //console.log("Leap Connected.");
  setTimeout(function() { 
    var time = frames.length/2;
  }, 200);
});

controller.connect();

/*
 * Angle Calculation Functions
 */

function calculateBaseAngle(x) {
  // Massage the input values a bit; salt to taste.
  var n = 100*normalize;
  x = 1.5+2*x/n;

  // 90 Degrees is the center of the base servo, and we want the movement to be
  // nonlinear due to the circular nature of the base.
  var angle = 90+Math.cos(x)*90;
  return angle;
}

function calculateInverseKinematics(x,y,z) {
  // Adjust the input values
  y = y*1.5 + 40;
  z = -z*1.5;
  
  // Normalize the values to mesh with your desired input range
  var l1 = 40*normalize;
  var l2 = 40*normalize;

  // Inverse kinematics equations
  var t1 = Math.acos((square(z)+square(y)-square(l1)-square(l2))/(2*l1*l2));
  var t2 = Math.asin(((l1+l2*Math.cos(t1))*y-l2*Math.sin(t1)*z)/(square(l1)+square(l2)+2*l1*l2*Math.cos(t1)));
  return {
    theta1: t1,
    theta2: t2
  }
}


/*
 * Utility Functions
 */

function distance(x1,y1,z1,x2,y2,z2) {
  return Math.sqrt(square(x2-x1)+square(y2-y1)+square(z2-z1));
}

function square(x) {
  return x*x;
}

function toDegrees(r) {
  return r*57.2957795;
}