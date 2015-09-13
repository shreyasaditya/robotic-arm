#include <Servo.h>

Servo baseServo;
Servo shoulderServo;
Servo elbowServo;
Servo clawServo;
Servo foreArmServo;

void setup() {
Serial1.begin(9600);
Serial.begin(9600);
pinMode(13, OUTPUT);

baseServo.attach(5);
shoulderServo.attach(6);
elbowServo.attach(9);
clawServo.attach(11);
foreArmServo.attach(10);
}

//global variables
int code = 0, i = 0, started = 0;

//f1 = base f2 = shoulder f3 = elbow f4 = claw
char f1[6], f2[6], f3[6], f4[6];


void loop() {

  int movebase;
  int moveshoulder;
  int moveelbow;
  int moveclaw;
  char c;
  while (Serial1.available() > 0){
    c = Serial1.read();
  
  
  //check if beginning, sub-section or end of message
    
    if( c == '*'){
      //Serial.println("Start of message");
      code = 1; 
      started = 1;
      i = 0;
    break;  
  }
  else if ( c == ' ')
  {
    if (code == 1)
      f1[i] = '\0';
    else if (code == 2)
      f2[i] = '\0';
    else if (code == 3)
       f3[i] ='\0';
       
    i = 0;
    if (code < 4)
      code++;
    break;
  }
  
  else if ( c == '$')
  {
    f4[i] = '\0';
    i = 0;
    //Serial.println("End of Message");
    code = 5;
    
    if (started == 1){
     
      started = 0;
      
      
      if(f1[0] == 'N' && f1[1] == 'a' && f1[2] == 'N')
        movebase = 999;
      else 
        movebase = atoi(f1);
       
      if(f2[0] == 'N' && f2[1] == 'a' && f2[2] == 'N')
        moveshoulder = 999; 
      else 
        moveshoulder= atoi(f2);
      if(f3[0] == 'N' && f3[1] == 'a' && f3[2] == 'N')
        moveelbow = 999;
      else
        moveelbow = atoi(f3);
        
      if(f4[0] == 'N' && f4[1] == 'a' && f4[2] == 'N')
        moveclaw = 999;
      else 
        moveclaw = atoi(f4);
        
      moveServos(movebase,moveshoulder,moveelbow,moveclaw);
      
      
    }
    break;
  }
  
   // Move the read character into character array
    if (code == 1)
    {
      f1[i] = c;    
      i++;
    }
    
      else if (code == 2)
    {
      f2[i] = c;     
      i++;
    }
    
      else if (code == 3)
    {
      f3[i] = c;   
      i++;
    }
    
      else if (code == 4)
    {
      f4[i] = c;    
      i++;
    }
  }//end of while loop
}


void moveServos(int base, int shoulder, int elbow, int claw)
{
foreArmServo.write(90);

if(base != 999)
  baseServo.write(base);
if(shoulder != 999)
  shoulderServo.write(shoulder);
if(elbow != 999)
  elbowServo.write(elbow);
if(claw != 999)
  clawServo.write(claw);


}
