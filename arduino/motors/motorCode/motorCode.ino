// Include the AccelStepper Library
#include <AccelStepper.h>

// Define pin connections
const int dirPin = 2;
const int stepPin = 3;
const int linPin = 4;
// Define motor interface type
#define motorInterfaceType 1

// Creates an instance
AccelStepper myStepper(motorInterfaceType, stepPin, dirPin);

///DUMMY DATA
int containerConfig[3] = {1,4,7};
int recipeInfo[3][2] = { {7,4},
                          {1,2},
                          {4,3}
                        };
const int steps = -133.0;
int spiceLocArray[3]={0};
void setup() {
	// set the maximum speed, acceleration factor,
	// initial speed and the target position
	myStepper.setMaxSpeed(150);
	myStepper.setAcceleration(150);
	myStepper.setSpeed(150);
 
  Serial.begin(9600);
  dispense(recipeInfo);
   myStepper.moveTo(0);
}

void dispense(int data[][2]){
//map id to correct position
  for (int i =0; i<3; i++){//hardcoded length
    int spiceID = data[i][0];
   // Serial.print(spiceID);
    int spiceLoc = 0;
    for(int j=0; j<3; j++){ // find pos of spice
      if(spiceID == containerConfig[j]  ){//assume that spice is in container config, or else pos = 0
        spiceLoc = j;
      }
     
    }
   spiceLocArray[i]= spiceLoc;
  }
}
 int prev = 0;
void rotate(int positions[]){
  for (int i =0; i<3; i++){
    // Serial.print(positions[i]);
       if (myStepper.distanceToGo()==0 && myStepper.currentPosition() == prev) 
         {
           //Serial.print(prev);
            myStepper.moveTo(positions[i]*steps);

            for (int j=0; j<recipeInfo[i][1];j++)
            {

              Serial.print(recipeInfo[i][1]);
            digitalWrite(linPin, HIGH);
            delay (1000);
            digitalWrite(linPin, LOW);
            
            }
            // Serial.print(positions[i]);
          
         }
          prev = positions[i]*steps;
  }
}

void loop() {
	// Change direction once the motor reaches target position
/*
if (myStepper.distanceToGo() == 0) 
  myStepper.moveTo(-myStepper.currentPosition());

// Move the motor one step
myStepper.run();
*/
  rotate( spiceLocArray);
   //myStepper.moveTo(steps);
/* if (myStepper.distanceToGo() == 0 && myStepper.currentPosition()== 0) 
  { //delay(1000);
    myStepper.moveTo(steps*2);}
  if (myStepper.distanceToGo()==0 && myStepper.currentPosition()==steps*2) 
    {  //delay(1000);
    myStepper.moveTo(steps);}
    if (myStepper.distanceToGo()==0  && myStepper.currentPosition()==steps) 
    {  //delay(1000);
    myStepper.moveTo(0);}*/

  /*if (myStepper.currentPosition() == 800) 
    myStepper.moveTo(0);
  // Move the motor one step*/
  myStepper.run();



}