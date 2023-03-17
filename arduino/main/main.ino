
#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include "TouchScreen.h"
#include <Fonts/FreeSans9pt7b.h>
#include <Fonts/FreeSans12pt7b.h>
#include <SoftwareSerial.h>
#include <avr/pgmspace.h>
#include <EEPROM.h>
#include "EEPROMAnything.h"
#include <AccelStepper.h>

// For the Adafruit shield, these are the default.
#define TFT_DC 9
#define TFT_CS 53

#define YP A2  // must be an analog pin, use "An" notation!
#define XM A3  // must be an analog pin, use "An" notation!
#define YM 8   // can be any digital pin
#define XP 9   // can be any digital pin

// This is calibration data for the raw touch data to the screen coordinates
#define TS_MINX 150
#define TS_MINY 120
#define TS_MAXX 940
#define TS_MAXY 920

#define MINPRESSURE 10
#define MAXPRESSURE 1000

#define BACKGROUND 0xF7BE
#define GRAY 0xCE79
#define DARKGRAY 0x8430

#define BLACK 0x0000
#define CYAN 0x5D14
#define WHITE 0xFFFF

#define motorInterfaceType 1

const int dirPin = 22;
const int stepPin = 23;
const int linPin = 29;

// Creates an instance
AccelStepper myStepper(motorInterfaceType, stepPin, dirPin);

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
// If using the breakout, change pins as desired
//Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST, TFT_MISO);

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

SoftwareSerial HM10(10, 11); // RX(green) = 0, TX(yellow) = 1 
//WHITE IS 3, ORANGE IS 2

char appData;
String inData = "";

String rawData = "";
String dataType = "";
String data = "";

const int NUM_CONTAINERS = 3;
int configArr[NUM_CONTAINERS] = { 0 };
int numContainers = 0;

int screenState = 0;
bool homeScreen_visible = false;
int recipe_index = 0;

const int AMOUNT_RECIPES = 5;
const int AMOUNT_SPICES_PER_RECIPE = 6;
const int STRING_LENGTH_TO_STORE = 15;
int num_recipes = 0;
int deleteIndex = 0;

String recipeNames[AMOUNT_RECIPES] = { "" };
int recipeInformation[AMOUNT_RECIPES][AMOUNT_SPICES_PER_RECIPE][2]; 

const int steps = -133.0*2;
int spiceLocArray[NUM_CONTAINERS]={-1, -1, -1};

int prev = 0;

const char string_0[] PROGMEM = "Garlic powder";
const char string_1[] PROGMEM = "Cinnamon";
const char string_2[] PROGMEM = "Onion powder";
const char string_3[] PROGMEM = "Paprika";
const char string_4[] PROGMEM = "Cumin";
const char string_5[] PROGMEM = "Turmeric";
const char string_6[] PROGMEM = "Black pepper";
const char string_7[] PROGMEM = "Coriander powder";
const char string_8[] PROGMEM = "Salt";
const char string_9[] PROGMEM = "Chilli powder";
const char string_10[] PROGMEM = "Nutmeg";
const char string_11[] PROGMEM = "All spice";
const char string_12[] PROGMEM = "Ginger powder";
const char string_13[] PROGMEM = "Cayenne powder";
const char string_14[] PROGMEM = "Gharam masala";
const char string_15[] PROGMEM = "Curry powder";
const char string_16[] PROGMEM = "Nutmeg";
const char string_17[] PROGMEM = "Cajun";

const char *const ingredientTable[] PROGMEM = {
  string_0,
  string_1,
  string_2,
  string_3,
  string_4,
  string_5,
  string_6,
  string_7,
  string_8,
  string_9,
  string_10,
  string_11,
  string_12,
  string_13,
  string_14,
  string_15,
  string_16,
  string_17,
};

char buffer[30];

//switch width and height bc the screen gets rotated
int recipeBlock_xmin = 40;
int recipeBlock_ymin = 70;
int recipeBlock_width = tft.height()-80;
int recipeBlock_height = tft.width()-100;

int backBtn_dims[] ={0, 40, tft.height()/2+30, 80};
int dispenseBtn_dims[] = {tft.height()/2+20, 45, 130, 40};
int prev_dims[] = {0, 70, 30, tft.height()-100};
int next_dims[] = {tft.height()-30, 70, 30, tft.width()-100};
int settings_dims[] = {240, 0, 330-240, 40};

const int CONFIG_ARR_ADDRESS = 0; 
const int RECIPE_INFO_ADDRESS = 100;
const int RECIPE_NAMES_ADDRESS = 800;
const int DELETE_RECIPE_ADDRESS = 25;

void setup() {
  Serial.begin(9600);
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  Serial.println("HM10 serial started at 9600");
  
  tft.begin();
  tft.setRotation(3);

  myStepper.setMaxSpeed(500);
	myStepper.setAcceleration(1000);
	myStepper.setSpeed(500);
  myStepper.moveTo(0);
  pinMode(linPin, OUTPUT);

  // initialize our 3d array as 0s
  for (int i = 0; i < AMOUNT_RECIPES; i++){
    for (int j = 0; j < AMOUNT_SPICES_PER_RECIPE; j++) {
      recipeInformation[i][j][0] = 0;
      recipeInformation[i][j][1] = 0;
    }
  }

  successBleScreen("Hello! :)", 1000);
  // clearEEPROM();
  
  loadConfigArrFromEEPROM(); // int arr takes up 24 bytes, starting at CONFIG_ARR_ADDRESS
  loadRecipeNamesFromEEPROM(); // string array, starting at RECIPE_NAMES_ADDRESS, takes up 50 bytes
  loadRecipeInformationFromEEPROM(); // 3d int array takes up 100 bytes, starting at RECIPE_INFO_ADDRESS

  deleteIndex = EEPROM[DELETE_RECIPE_ADDRESS];
  if (deleteIndex == 255 || deleteIndex == -1) {
    deleteIndex = 0;
  }

  if (num_recipes <= 0 ) {
    screenState = 3;
    welcomeScreen();
  } else {
    homeScreen();
  }
}

void loop() {
  HM10.listen();  // listen the HM10 port
  while (HM10.available() > 0) {   // if HM10 sends something then read
    appData = HM10.read();
    inData = String(appData);  // save the data in string format
    Serial.write(appData);

    if (appData == '!') {
      rawData = "";
    }

    if (appData != '!' && appData != '?') {
      rawData += inData;
    }

    if (appData == '?') {
      Serial.println();
      dataType = getValue(rawData, ':', 0);
      data = getValue(rawData, ':', 1);
    }
  }

  if (dataType == "C") {
    Serial.println("configuring machine...");

    numContainers = configurationParser(data, configArr);
    Serial.println(numContainers);

    dataType = "";
    data = "";

    EEPROM_writeAnything(CONFIG_ARR_ADDRESS , configArr);

    Serial.println("successfully configured machine!");
    successBleScreen("Saved device information!", 3000);

    configurationScreen();
    screenState = 2;
  }

  if (dataType == "N") {
    Serial.println("parsing recipe data...");

    String ingredients = getValue(data, ';', 0);
    String spiceName = getValue(data, ';', 1);
    Serial.println(spiceName);

    int index = 0;
    if (num_recipes == AMOUNT_RECIPES) {
      recipeParser(ingredients, recipeInformation[deleteIndex]);
      recipeNames[deleteIndex] = spiceName;
      index = deleteIndex;
      deleteIndex++;
      if (deleteIndex >= AMOUNT_RECIPES) {
        deleteIndex = 0;
      }
      EEPROM[DELETE_RECIPE_ADDRESS] = deleteIndex;
    } else {
      // bool boolean = true;
      while (index < AMOUNT_RECIPES) {
        if (recipeNames[index] == "") {
          recipeParser(ingredients, recipeInformation[index]);
          recipeNames[index] = spiceName;
          num_recipes++;
          break; 
        }
        else {
          index++;
        }
      }
    }
    
    EEPROM_writeAnything(RECIPE_INFO_ADDRESS, recipeInformation);
    writeRecipeNameToEEPROM(index, spiceName);

    dataType = "";
    data = "";

    Serial.println("successfully saved recipe!");
    successBleScreen("Saved recipe information!", 3000);
    
    recipe_index = index;
    recipeScreen(recipeInformation[index], recipeNames[index]);
    screenState = 1;
  }

  // Retrieve a point  
  TSPoint p = ts.getPoint();
  // we have some minimum pressure we consider 'valid'
  // pressure of 0 means no pressing!
  if (p.z < MINPRESSURE || p.z > MAXPRESSURE) {
     return;
  }
  // Scale from ~0->1000 to tft.width using the calibration #'s
  p.x = map(p.x, TS_MINX, TS_MAXX, 0, tft.height());
  p.y = map(p.y, TS_MINY, TS_MAXY,  tft.width(),0);

  // poll stepper
  myStepper.run();

  // Serial.println("X AND Y");
  // Serial.println(p.x);
  // Serial.println(p.y);

  navigation(p.x, p.y);
}

void navigation(int px, int py) {

  if (screenState == 0){ // homescreen visible
    if (px>recipeBlock_ymin && px<recipeBlock_height +recipeBlock_ymin && py>recipeBlock_xmin && py<recipeBlock_width +recipeBlock_xmin) {
          recipeScreen(recipeInformation[recipe_index], recipeNames[recipe_index]);
          screenState  = 1;
    }
    else if(px>prev_dims[1]&& px<prev_dims[3]+prev_dims[1] && py>prev_dims[0] && py<prev_dims[2]+prev_dims[0]) {
      if (recipe_index <= 0) {
        recipe_index = num_recipes - 1;
      } else {
        recipe_index--;
      }
      drawRecipeBlock(recipeNames[recipe_index]);
    }
    else if(px>next_dims[1]&& px<next_dims[3]+next_dims[1] && py>next_dims[0] && py<next_dims[2]+next_dims[0]) { 
      if(recipe_index >= num_recipes - 1) {
        recipe_index =0;
      } else {
        recipe_index++;
      }
      drawRecipeBlock(recipeNames[recipe_index]);
    }
    else if (px>settings_dims[1]&& px<settings_dims[3]+settings_dims[1] && py>settings_dims[0] && py<settings_dims[2]+settings_dims[0]) {
      configurationScreen();
      screenState  = 2;
    }
  }
  else if (screenState == 1){ // recipe screen visible
    if(px>backBtn_dims[1]&& px<backBtn_dims[3] && py>backBtn_dims[0] && py<backBtn_dims[2]) {
      homeScreen();
      screenState  = 0;
    }
    //dispense btn
    else if (px>dispenseBtn_dims[1]&& px<dispenseBtn_dims[3]+dispenseBtn_dims[1] && py>dispenseBtn_dims[0] && py<dispenseBtn_dims[2]+dispenseBtn_dims[0]) {
      screenState = 7;

      // Serial.println("CLICKED DISPENSE BUTTON");
      // Serial.print("RECIPE INDEX: ");
      // Serial.println(recipe_index);
      // Serial.println("RECIPE INFO");

      // for (int i = 0; i < AMOUNT_SPICES_PER_RECIPE; i++) {
      //   Serial.println(recipeInformation[recipe_index][i][0]);
      // }

      // Serial.println("SPICE LOC ARRAY 1");
      // for (int i = 0; i < NUM_CONTAINERS; i++) {
      //   Serial.println(spiceLocArray[i]);
      // }
      findSpiceLocations(recipe_index);

      // Serial.println("SPICE LOC ARRAY 2");
      // for (int i = 0; i < NUM_CONTAINERS; i++) {
      //   Serial.println(spiceLocArray[i]);
      // }

      // Change direction once the motor reaches target position
      rotateAndDispense(recipe_index);
    }
    else if (px>settings_dims[1]&& px<settings_dims[3]+settings_dims[1] && py>settings_dims[0] && py<settings_dims[2]+settings_dims[0]) {
      configurationScreen();
      screenState  = 2;
    }
  }
  else if (screenState == 2) { // configuration screen visible
    if(px>backBtn_dims[1]&& px<backBtn_dims[3] && py>backBtn_dims[0] && py<backBtn_dims[2]) {
      if (num_recipes <= 0 ) {
        screenState = 3;
        welcomeScreen();
      } else {
        homeScreen();
        screenState  = 0;
      }
    }
    else if (px>dispenseBtn_dims[1]&& px<dispenseBtn_dims[3]+dispenseBtn_dims[1] && py>dispenseBtn_dims[0] && py<dispenseBtn_dims[2]+dispenseBtn_dims[0]) {
      clearEEPROM();
      welcomeScreen();
      screenState  = 3;
    }
  }
  else if (screenState == 3) { // welcome screen visible
    if (px>settings_dims[1]&& px<settings_dims[3]+settings_dims[1] && py>settings_dims[0] && py<settings_dims[2]+settings_dims[0]) {
      configurationScreen();
      screenState  = 2;
    }
  }
  else if (screenState == 7) { // dispense loading screen

  }
}

void drawBanner(){
  tft.fillRect(0, 0, tft.width(), 40, GRAY);
  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(10, 25);
  tft.setTextColor(BLACK);
  tft.println("SpiceMixer");
  settingsButton();
                                                                                                             
}

void settingsButton() {
  tft.fillRect(240, 0, tft.width()-240, 40, GRAY);
  tft.setCursor(240, 25);
  tft.println("Settings");
}

void homeScreen(){
   tft.fillScreen(BACKGROUND);
    drawBanner();
   tft.setFont(&FreeSans12pt7b);
   drawRecipeBlock(recipeNames[recipe_index]);
}

void drawRecipeBlock( String name ){
  tft.fillRect(recipeBlock_xmin,recipeBlock_ymin,
  recipeBlock_width, recipeBlock_height,GRAY);

  tft.setCursor(60, tft.height()/2+20);
  tft.setTextColor(BLACK);
  tft.setTextSize(1);
  tft.println(name);

  nextBtn();
  prevBtn();
}

void nextBtn(){
  tft.fillRect(tft.width()-30, 70, 30, tft.height()-100,GRAY);
  tft.setCursor(tft.width()-20, tft.height()/2+20);
  tft.setTextColor(BLACK);
  tft.setTextSize(1);
  tft.println(">");

}
void prevBtn(){
  tft.fillRect(0, 70, 30, tft.height()-100,GRAY);
  tft.setCursor(10, tft.height()/2+20);
  tft.setTextColor(BLACK);
  tft.setTextSize(1);
  tft.println("<");

}
// int numSpices
void recipeScreen(int recipes[][2], String name){
  // homeScreen_visible = false;
  String recipeTitle = "< " + name;
  tft.fillScreen(BACKGROUND);
  drawBanner();
  tft.setFont(&FreeSans12pt7b);
  tft.setCursor(10, 70);
  tft.setTextColor(DARKGRAY);
  tft.println(recipeTitle);

  dispenseBtn();

  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(30, 100);
  tft.setTextColor(BLACK);
  tft.println("Ingredients");

  tft.setCursor(tft.width()/2+50, 100);
  tft.println("Amount");
  tft.setTextColor(DARKGRAY);

  for (int i = 0; i < AMOUNT_SPICES_PER_RECIPE; i++){
    if (recipes[i][1] != 0) {
      int index = recipes[i][0] - 1;
      strcpy_P(buffer, (char *)pgm_read_word(&(ingredientTable[index])));
      ingredientBlock(buffer, String(recipes[i][1]), i);
    }
  }
}

void dispenseBtn(){
  tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],CYAN);
   tft.setFont(&FreeSans9pt7b);
  tft.setCursor(tft.width()/2+50, 70);
  tft.setTextColor(WHITE);
  tft.println("Dispense");
}

void eraseBtn(){
  tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],DARKGRAY);
   tft.setFont(&FreeSans9pt7b);
  tft.setCursor(tft.width()/2+50, 70);
  tft.setTextColor(WHITE);
  tft.println("Reset");
}

void dispensingBtn(double progress){
  //tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],GRAY);
  
  double percentage = progress/NUM_CONTAINERS;
  int amount = (tft.width()-100) * (percentage);

  int percentageToShow = 100*percentage;
  String progressAmount = String(percentageToShow) + "%";

  tft.fillScreen(BACKGROUND);
  tft.setCursor(tft.width()/2-45, tft.height()/2);
  tft.setTextColor(DARKGRAY);
  tft.println("Dispensing");
  tft.fillRoundRect(30, tft.height()*.7, tft.width()-100, 10, 2,GRAY);
  tft.fillRoundRect(30, tft.height()*.7, amount, 10, 2, DARKGRAY); // update progress bar
  tft.setCursor(tft.width()-60, tft.height()*.7+10);
  tft.println(progressAmount); // update progress
}

void successBleScreen(String input, int ms){
  //tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],GRAY);
  tft.fillScreen(BACKGROUND);
  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(35, tft.height()/2);
  tft.setTextColor(DARKGRAY);
  tft.println(input);
  delay(ms);
  // homeScreen();
}

void welcomeScreen(){
  //tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],GRAY);
  tft.fillScreen(BACKGROUND);
  drawBanner();
  // tft.setFont(&FreeSans12pt7b);
  tft.setCursor(35, tft.height()/2);
  tft.setTextColor(DARKGRAY);
  tft.println("Download recipes using Bluetooth!");
  if (num_recipes >= 0) {
      delay(3000);
  }
}

void configurationScreen() {
  tft.fillScreen(BACKGROUND);
  drawBanner();
  tft.setFont(&FreeSans12pt7b);
  tft.setCursor(10, 70);
  tft.setTextColor(DARKGRAY);
  tft.println("< Configuration");
  tft.setFont(&FreeSans9pt7b);

  eraseBtn();

  if (numContainers > 0) {
    tft.setCursor(30, 100);
    tft.setTextColor(BLACK);
    tft.println("Container #");

    tft.setCursor(tft.width()/2, 100);
    tft.println("Spice");
    tft.setTextColor(DARKGRAY);

    for (int i = 0; i < NUM_CONTAINERS; i++){
      if (configArr[i] != 0 && configArr[i] != -1 && configArr[i] != 255) {
        int index = configArr[i] - 1;
        strcpy_P(buffer, (char *)pgm_read_word(&(ingredientTable[index])));
        containerBlock(buffer, i);
      }
    }
  } else {
    tft.setCursor(35, tft.height()/2);
    tft.setTextColor(DARKGRAY);
    tft.println("Configure the device via bluetooth!");
  }
}

void containerBlock(String spiceName, int i){ //inputs: name and amount
  String containerNum = String(i + 1);
  int height = tft.height()/2+2+i*20;
  tft.setCursor(30, height);
  tft.println("Container " + containerNum);

  tft.setCursor(tft.width()/2, height);
  tft.println(spiceName);
}

void ingredientBlock(String name, String amount, int i){ //inputs: name and amount
  int height = tft.height()/2+2+i*20;
  tft.setCursor(30, height);
  tft.println(name);

  tft.setCursor(tft.width()/2+50, height);
  tft.println(amount + " tsp");
}

String getValue(String data, char separator, int index) {
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

int recipeParser(String data, int arr[][2]) {
  String currentNum = "";
  int index = 0;
  int subIndex = 0;

  for (int i = 1; i < data.length() - 1; i++) {
    if (isDigit(data[i]) == true) {
      currentNum += data[i];
    }
    else if (data[i] == ',' && currentNum.length() > 0) {
      int num = currentNum.toInt();
      currentNum = "";
      arr[index][subIndex] = num;
      subIndex += 1;
    }
    else if (data[i] == ']') {
      int num = currentNum.toInt();
      currentNum = "";
      arr[index][subIndex] = num;
      subIndex = 0;
      index += 1;
    }
  }

  // reset the rest of the array as 0s
  for (int i = index; i < AMOUNT_SPICES_PER_RECIPE; i++) {
    arr[i][0] = 0;
    arr[i][1] = 0;
  }

  return index;
}

int configurationParser(String data, int arr[]) {
  String currentNum = "";
  int index = 0;

  for (int i = 0; i < data.length(); i++) {
    if (isDigit(data[i]) == true) {
      currentNum += data[i];
    }
    else {
      arr[index] = currentNum.toInt();
      currentNum = "";
      index += 1;
    }
  }

  if (currentNum != "") {
    arr[index] = currentNum.toInt();
    index += 1;
  }

  // reset the rest of the array as 0s
  for (int i = index; i < NUM_CONTAINERS; i++) {
    arr[i] = 0;
  }

  return index;
}

void writeStringToEEPROM(int addrOffset, String &strToWrite) {
  byte len = 0;
  if (strToWrite.length() > STRING_LENGTH_TO_STORE) {
    len = STRING_LENGTH_TO_STORE;
  } else {
    len = strToWrite.length();
  }
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++) {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
  }
}

String readStringFromEEPROM(int addrOffset) {
  int newStrLen = EEPROM.read(addrOffset);
  char data[newStrLen + 1];
  for (int i = 0; i < newStrLen; i++) {
    data[i] = EEPROM.read(addrOffset + 1 + i);
  }
  data[newStrLen] = '\0'; // !!! NOTE !!! Remove the space between the slash "/" and "0" (I've added a space because otherwise there is a display bug)
  String buffer = String(data);
  return buffer;
}

void writeRecipeNameToEEPROM(int index, String &recipeName) {
  int address = RECIPE_NAMES_ADDRESS+index*(STRING_LENGTH_TO_STORE+1);
  writeStringToEEPROM(address, recipeName);
  // for (int i = address; i < address+10; i++) {
  //   Serial.println(EEPROM[i]);
  // }
}

void clearEEPROM() {
  for (int i = 0; i < 1024; i++) { // use this for loop to reset EEPROM memory
    EEPROM[i] = 255;
  }
  for (int i = 0; i < AMOUNT_RECIPES; i++){
    recipeNames[i] = "";
    for (int j = 0; j < AMOUNT_SPICES_PER_RECIPE; j++) {
      recipeInformation[i][j][0] = 0;
      recipeInformation[i][j][1] = 0;
    }
  }
  for (int i = 0; i < NUM_CONTAINERS; i++) {
    configArr[i] = 0;
  }
  deleteIndex = 0;
  num_recipes = 0;
  recipe_index = 0;
  numContainers = 0;
  prev = 0;
}

void loadRecipeNamesFromEEPROM() {
  for (int i = 0; i < AMOUNT_RECIPES; i++) {
    int address = RECIPE_NAMES_ADDRESS+i*(STRING_LENGTH_TO_STORE+1);
    if (EEPROM[address] != 0 && EEPROM[address] != 255) {
      String currRecipe = readStringFromEEPROM(address); 
      recipeNames[i] = currRecipe;
    }
  }
}

void loadRecipeInformationFromEEPROM() {
  EEPROM_readAnything(RECIPE_INFO_ADDRESS, recipeInformation); 
  for (int i = 0; i < AMOUNT_RECIPES; i++){
    if (recipeInformation[i][0][1] != 0 && recipeInformation[i][0][1] != -1) {
      // Serial.println(recipeInformation[i][0][1]);
      num_recipes++;
    }
  }
}

void loadConfigArrFromEEPROM() {
  EEPROM_readAnything(CONFIG_ARR_ADDRESS, configArr); 
  for (int i = 0; i < NUM_CONTAINERS; i++) {
    if (configArr[i] != 0 && configArr[i] != -1 && configArr[i] != 255){
      numContainers++;
    } 
  }
}

void findSpiceLocations(int idx){ //map id to correct position
  int index = 0;
  for (int i = 0; i < AMOUNT_SPICES_PER_RECIPE; i++) { //hardcoded length
    for(int j = 0; j < NUM_CONTAINERS; j++) { // find pos of spice
      if (recipeInformation[idx][i][0] == configArr[j] && recipeInformation[idx][i][0] != 0) { //assume that spice is in container config, or else pos = 0
        spiceLocArray[index] = j;
        index++;
      }
    }
  }
}

void rotateAndDispense(int idx){
  dispensingBtn(0);
  for (int i = 0; i < NUM_CONTAINERS; i++){
    if (spiceLocArray[i] != -1 && myStepper.distanceToGo() == 0 && myStepper.currentPosition() == prev) {
      myStepper.moveTo(spiceLocArray[i]*steps);
      while (myStepper.distanceToGo() != 0) {
        myStepper.run();
      }
      delay(1000);
      for (int j = 0; j < recipeInformation[idx][i][1]*4; j++) { // dispense with linear actuator
        digitalWrite(linPin, HIGH);
        delay(1000);
        digitalWrite(linPin, LOW);
        delay(1000);
      }
      prev = spiceLocArray[i]*steps;
    }
    spiceLocArray[i] = -1;
    dispensingBtn(i+1);
    delay(1000);
  }
  myStepper.moveTo(0); // move to home
  while (myStepper.distanceToGo() != 0) {
    myStepper.run();
  }
  prev = 0;
  homeScreen();
  screenState = 0;
}