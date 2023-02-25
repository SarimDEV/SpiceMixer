
#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include "TouchScreen.h"
#include <Fonts/FreeSans9pt7b.h>
#include <Fonts/FreeSans12pt7b.h>
#include <SoftwareSerial.h>
#include <avr/pgmspace.h>

// For the Adafruit shield, these are the default.
#define TFT_DC 9
#define TFT_CS 10

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

SoftwareSerial HM10(2, 3); // RX = 0, TX = 1
char appData;
String inData = "";

String rawData = "";
String dataType = "";
String data = "";

int configArr[12];
int numContainers = 0;

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
// If using the breakout, change pins as desired
//Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST, TFT_MISO);

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

bool homeScreen_visible = false;
int recipe_index = 0;

const int AMOUNT_RECIPES = 5;
int num_recipes = 0;

String recipeNames[AMOUNT_RECIPES] = { "" };

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

struct ingredient{
  String name;
  String amount;
};

//  ingredient recipes[5]= {{"Salt", "2 tbsp"},
//                           {"Paprika", "3 tbsp"},
//                           {"Black Pepper", "1 tbsp"},
//                           {"Garlic Powder", "2 tbsp"},
//                           {"Onion Powder", "1 tbsp"}
//                           };

//switch width and height bc the screen gets rotated
int recipeBlock_xmin = 40;
int recipeBlock_ymin = 70;
int recipeBlock_width = tft.height()-80;
int recipeBlock_height = tft.width()-100;

int backBtn_dims[] ={0, 40, tft.height()/2+30, 80};
int dispenseBtn_dims[] = {tft.height()/2+20, 45, 130, 40};
int prev_dims[] = {0, 70, 30, tft.height()-100};
int next_dims[] = {tft.height()-30, 70, 30, tft.width()-100};

void setup() {
  Serial.begin(9600);
  // Serial.begin(9600);
  Serial.println("HM10 serial started at 9600");
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  tft.begin();
  tft.setRotation(3);
  welcomeScreen();
  // homeScreen();
  // Serial.print(tft.width());
  // Serial.print(tft.height());
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
    // digitalWrite(13, HIGH); // switch ON LED

    numContainers = configurationParser(data, configArr);
    Serial.println(numContainers);

    dataType = "";
    data = "";

    Serial.println("successfully configured machine!");

  }

  if (dataType == "N") {
    Serial.println("parsing recipe data...");
    // digitalWrite(13, HIGH); // switch ON LED

    String ingredients = getValue(data, ';', 0);
    String spiceName = getValue(data, ';', 1);
    Serial.println(spiceName);

    int arr[12][2];
    int amount = recipeParser(ingredients, arr);
    Serial.println(amount);

    dataType = "";
    data = "";

    Serial.println("successfully saved recipe!");
    successBleScreen();
    
    int index = 0;
    while (index < AMOUNT_RECIPES) {
      if (recipeNames[index] == "") {
        recipeNames[index] = spiceName;
        index = 5;
      }
      index += 1; 
    }
    Serial.println("OUT OF THE WHILE LOOP");

    if (index == 4) {
      recipeNames[0] = spiceName;
    }

    num_recipes += 1;

    recipeScreen(arr, spiceName, amount);
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

  Serial.println(p.x);
  Serial.println(p.y);

  //  Serial.print("\n");
   /*Serial.print(p.x);
     Serial.print(" . ");
   Serial.print(p.y);*/

  if (homeScreen_visible){

    //click recipe block
    // if (p.x>recipeBlock_ymin && p.x<recipeBlock_height +recipeBlock_ymin
    //    && p.y>recipeBlock_xmin && p.y<recipeBlock_width +recipeBlock_xmin)
    //     {
    //       recipeScreen();
    //       homeScreen_visible = false;
    //     }

      //next and prev buttons
      Serial.println("WRONG IF STATEMENT BLOCK");

      if(p.x>prev_dims[1]&& p.x<prev_dims[3]+prev_dims[1] && p.y>prev_dims[0] && p.y<prev_dims[2]+prev_dims[0])
      {
          if (recipe_index <= 0){
            recipe_index = num_recipes - 1;// manually edit
            }else{
              recipe_index--;
            }
            // Serial.print(recipe_index);
          drawRecipeBlock(recipeNames[recipe_index]);
      }
       if(p.x>next_dims[1]&& p.x<next_dims[3]+next_dims[1] && p.y>next_dims[0] && p.y<next_dims[2]+next_dims[0])
      {
        
          if(recipe_index >= num_recipes - 1){// edit array length
            recipe_index =0;
          }else{
            recipe_index++;
          }
          // Serial.print(recipe_index);
          drawRecipeBlock(recipeNames[recipe_index]);
      }
  }else{//recipe screen visible
      //back btn
      Serial.println("GOING INSIDE ELSE STATEMENT");

    if(p.x>backBtn_dims[1]&& p.x<backBtn_dims[3] && p.y>backBtn_dims[0] && p.y<backBtn_dims[2])
        {
          Serial.println("GOING BACK TO HOME SCREEN");
          homeScreen();
          homeScreen_visible = true;
        }
    //dispense btn
    if (p.x>dispenseBtn_dims[1]&& p.x<dispenseBtn_dims[3]+dispenseBtn_dims[1] && p.y>dispenseBtn_dims[0] && p.y<dispenseBtn_dims[2]+dispenseBtn_dims[0])
    {
      dispensingBtn();
    }

  }

  
}

void drawBanner(){
  tft.fillRect(0, 0, tft.width(), 40, GRAY);
  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(10, 25);
  tft.setTextColor(BLACK);
  tft.println("SpiceMixer");
                                                                                                             
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

void recipeScreen(int recipes[][2], String name, int numSpices){
  homeScreen_visible = false;
  String recipeTitle = "< " + name;
  tft.fillScreen(BACKGROUND);
  drawBanner();
  tft.setFont(&FreeSans12pt7b);
  tft.setCursor(10, 70);
  tft.setTextColor(DARKGRAY);
  tft.println(recipeTitle); // replace with real recipe 

  dispenseBtn();

  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(30, 100);
  tft.setTextColor(BLACK);
  tft.println("Ingredients");

  tft.setCursor(tft.width()/2+50, 100);
  tft.println("Amount");
  tft.setTextColor(DARKGRAY);

  for (int i = 0; i < numSpices; i++){
    int index = recipes[i][0] - 1;
    strcpy_P(buffer, (char *)pgm_read_word(&(ingredientTable[index])));
    ingredientBlock(buffer, String(recipes[i][1]), i);
  }

}

void dispenseBtn(){
  tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],CYAN);
   tft.setFont(&FreeSans9pt7b);
  tft.setCursor(tft.width()/2+50, 70);
  tft.setTextColor(WHITE);
  tft.println("Dispense");

}
void dispensingBtn(){
  //tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],GRAY);
   tft.fillScreen(BACKGROUND);
  tft.setCursor(tft.width()/2-45, tft.height()/2);
  tft.setTextColor(DARKGRAY);
  tft.println("Dispensing");
  tft.fillRoundRect(30, tft.height()*.7, tft.width()-100, 10, 2,GRAY);// update progress bar
  tft.fillRoundRect(30, tft.height()*.7, 30, 10, 2,DARKGRAY);
  tft.setCursor(tft.width()-60, tft.height()*.7+10);
  tft.println("5%");// update progress
}

void successBleScreen(){
  //tft.fillRect(dispenseBtn_dims[0],dispenseBtn_dims[1],dispenseBtn_dims[2],dispenseBtn_dims[3],GRAY);
  tft.fillScreen(BACKGROUND);
  tft.setCursor(35, tft.height()/2);
  tft.setTextColor(DARKGRAY);
  tft.println("Saved recipe information!");
  delay(3000);
  homeScreen();
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
      homeScreen_visible = true;
  }
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

  return index;
}