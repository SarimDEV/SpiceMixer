#include <Stepper.h>
#include <stdio.h>
#include <ezButton.h>

int spicePositions[12] = {0};

// NOTE: I've hardcoded the max # of recipes we're storing as 10,
// cause fuck dynamically allocating a 2D array in C
int recipes[10][13] = {0};
// NOTE: the 0th element of each recipe slot will be set to -1 when it is used
// so new recipes will only enter empty slots where recipes[i][0] != -1

// change this to fit the number of steps per revolution
// for your motor
const int stepsPerRevolution = 200;
const float stepAngle = 200.0 / 360.0;
const float stepsPerSpice = 30.0 / stepAngle;

// TODO: change pins according to reality (currently placeholder numbers)
Stepper pickerStepper(stepsPerRevolution, 1, 2, 3, 4);
Stepper dispenserStepper(stepsPerRevolution, 5, 6, 7, 8);
ezButton limitSwitch(9);

// spiceId is the spice identifier (integer constants associated with a spice name)
// (e.g. int PAPRIKA = 5)
// containerPosition is the position the spice is located (0-11)
void store(int containerPosition, int spiceId) {
  spicePositions[containerPosition] = spiceId;
}

int * read_spice_locations() {
  return spicePositions;
}

// Make index = spiceID, and value at index be # numTeaspoons
void save_recipe(int teaspoons[12]) {
  int i = 0;
  
  while (i < 12) {
    // recipe slot is empty, can store recipe here
    if (recipes[i][0]) != -1) {
      memcpy(recipes[i], teaspoons, sizeof(teaspoons));
      recipes[0] = -1;
      break;
    }

    i++;
  }
}

void move_to_container(int container) {
  // go back to home
  move_home();

  // go to target spice
  int i = 0;
  while (i < container) {
    pickerStepper.step(stepsPerSpice)
    delay(1000);
    
    i++;
  }
}

void move_home() {
  bool detected = false;
  int iterations = 0;
  int maxIterations = 250;
  
  while(!detected && iterations < maxIterations){
    pickerStepper.step(1);
    delay(50);

    iterations++;
    detected = limitSwitch.isPressed();
  }
}

void dispense(int amt) {
  // fully spin dispenser servo 360 degrees three times
  dispenserStepper.step(200);
  delay(500);
  dispenserStepper.step(200);
  delay(500);
  dispenserStepper.step(200);
  delay(500);
}

void setup() {
  // set the speed at 60 rpm:
  pickerStepper.setSpeed(60);
  dispenserStepper.setSpeed(60);

  // set debounce time to 50 milliseconds
  limitSwitch.setDebounceTime(25);
  
  // initialize the serial port:
  Serial.begin(9600);
}

void loop() {
  limitSwitch.loop();

  // TODO: figure out what to put here when we maybe make a state machine???
}
