// Include the AccelStepper Library
#include <AccelStepper.h>

// Define pin connections
const int dirPin = 22;
const int stepPin = 23;
const int linPin = 29;

// Define motor interface type
#define motorInterfaceType 1

// Creates an instance
AccelStepper myStepper(motorInterfaceType, stepPin, dirPin);

///DUMMY DATA
int containerConfig[3] = {1,4,7};
int recipeInfo[4][2] = { 
  {4,0},
  {7,0},
  {1,0},
  {4,0}
};
const int steps = -133.0*2;
int spiceLocArray[3]={0};

int prev = 0;


void setup() {
	// set the maximum speed, acceleration factor,
	// initial speed and the target position
	myStepper.setMaxSpeed(500);
	myStepper.setAcceleration(1000);
	myStepper.setSpeed(500);
 
  Serial.begin(9600);
  dispense(recipeInfo);
  // myStepper.moveTo(0);
  pinMode(linPin, OUTPUT);
}

void loop() {
	// Change direction once the motor reaches target position
  rotate(spiceLocArray);
  // Move the motor one step*/
  myStepper.run();
}

void dispense(int data[][2]){
//map id to correct position
  for (int i = 0; i < 3; i++) {//hardcoded length
    int spiceID = data[i][0];
    // Serial.print(spiceID);
    int spiceLoc = 0;
    for(int j = 0; j < 3; j++) { // find pos of spice
      if (spiceID == containerConfig[j]) {//assume that spice is in container config, or else pos = 0
        spiceLoc = j;
      }
    }
   spiceLocArray[i]= spiceLoc;
  }
}

 
void rotate(int positions[]){
  for (int i =0; i<3; i++){
    // Serial.print(positions[i]);
    if (myStepper.distanceToGo()==0 && myStepper.currentPosition() == prev) {
      //Serial.print(prev);
      myStepper.moveTo(positions[i]*steps);

      for (int j=0; j<recipeInfo[i][1]*4;j++) {
        Serial.print(recipeInfo[i][1]);
        digitalWrite(linPin, HIGH);
        delay(1000);
        digitalWrite(linPin, LOW);
        delay(1000);
      }
      // Serial.print(positions[i]);
    }
    prev = positions[i]*steps;
  }
}