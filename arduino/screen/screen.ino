
#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include "TouchScreen.h"
#include <Fonts/FreeSans9pt7b.h>
#include <Fonts/FreeSans12pt7b.h>

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

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
// If using the breakout, change pins as desired
//Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST, TFT_MISO);

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

bool homeScreen_visible = true;
int recipe_index = 0;

String recipeNames[] = {"Chana Masala", "Cajun", "Chili", "Jerk", "BBQ"};

struct ingredient{
  String name;
  String amount;
};

 ingredient recipes[5]= {{"Salt", "2 tbsp"},
                          {"Paprika", "3 tbsp"},
                          {"Black Pepper", "1 tbsp"},
                          {"Garlic Powder", "2 tbsp"},
                          {"Onion Powder", "1 tbsp"}
                          };



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
  tft.begin();
  tft.setRotation(3);
  homeScreen();
  // Serial.print(tft.width());
  // Serial.print(tft.height());
 
}

void loop() {
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
   Serial.print("\n");
   /*Serial.print(p.x);
     Serial.print(" . ");
   Serial.print(p.y);*/

  if (homeScreen_visible){

    //click recipe block
    if (p.x>recipeBlock_ymin && p.x<recipeBlock_height +recipeBlock_ymin
       && p.y>recipeBlock_xmin && p.y<recipeBlock_width +recipeBlock_xmin)
        {
          recipeScreen();
          homeScreen_visible = false;
        }

      //next and prev buttons

      if(p.x>prev_dims[1]&& p.x<prev_dims[3]+prev_dims[1] && p.y>prev_dims[0] && p.y<prev_dims[2]+prev_dims[0])
      {
          if (recipe_index==0){
            recipe_index =4;// manually edit
            }else{
              recipe_index--;
            }
            Serial.print(recipe_index);
          drawRecipeBlock(recipeNames[recipe_index]);
      }
       if(p.x>next_dims[1]&& p.x<next_dims[3]+next_dims[1] && p.y>next_dims[0] && p.y<next_dims[2]+next_dims[0])
      {
        
          if(recipe_index>=4){// edit array length
            recipe_index =0;
          }else{
            recipe_index++;
          }
          Serial.print(recipe_index);
          drawRecipeBlock(recipeNames[recipe_index]);
      }
  }else{//recipe screen visible
      //back btn
    if(p.x>backBtn_dims[1]&& p.x<backBtn_dims[3] && p.y>backBtn_dims[0] && p.y<backBtn_dims[2])
        {
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

void recipeScreen(){
  tft.fillScreen(BACKGROUND);
  drawBanner();
  tft.setFont(&FreeSans12pt7b);
  tft.setCursor(10, 70);
  tft.setTextColor(DARKGRAY);
  tft.println("< Cajun"); // replace with real recipe 

  dispenseBtn();

  tft.setFont(&FreeSans9pt7b);
  tft.setCursor(30, 100);
  tft.setTextColor(BLACK);
  tft.println("Ingredients");

  tft.setCursor(tft.width()/2+50, 100);
  tft.println("Amount");
  tft.setTextColor(DARKGRAY);
  for (int i = 0; i<5; i++){
  ingredientBlock(recipes[i].name, recipes[i].amount,i);
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

void ingredientBlock(String name, String amount, int i){ //inputs: name and amount
  int height = tft.height()/2+2+i*20;
  tft.setCursor(30, height);
  tft.println(name);

  tft.setCursor(tft.width()/2+50, height);
  tft.println(amount);
}
