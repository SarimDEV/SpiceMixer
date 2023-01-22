#include <SoftwareSerial.h>
#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"

// For the Adafruit shield, these are the default.
#define TFT_DC 9
#define TFT_CS 10

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);

SoftwareSerial HM10(2, 3); // RX = 0, TX = 1
char appData;
String inData = "";

void setup() {
  Serial.begin(9600);
  Serial.println("HM10 serial started at 9600");
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  pinMode(13, OUTPUT); // onboard LED
  digitalWrite(13, LOW); // switch OFF LED

    tft.begin();

  // read diagnostics (optional but can help debug problems)
  uint8_t x = tft.readcommand8(ILI9341_RDMODE);
  Serial.print("Display Power Mode: 0x"); Serial.println(x, HEX);
  x = tft.readcommand8(ILI9341_RDMADCTL);
  Serial.print("MADCTL Mode: 0x"); Serial.println(x, HEX);
  x = tft.readcommand8(ILI9341_RDPIXFMT);
  Serial.print("Pixel Format: 0x"); Serial.println(x, HEX);
  x = tft.readcommand8(ILI9341_RDIMGFMT);
  Serial.print("Image Format: 0x"); Serial.println(x, HEX);
  x = tft.readcommand8(ILI9341_RDSELFDIAG);
  Serial.print("Self Diagnostic: 0x"); Serial.println(x, HEX);

  testText("Device on!");
}


void loop() { 
  HM10.listen();  // listen the HM10 port
  while (HM10.available() > 0) {   // if HM10 sends something then read
    delay(300);
    appData = HM10.read();
    inData = String(appData);  // save the data in string format
    Serial.write(appData);

    if (inData == "F") {
      Serial.println("LED OFF");
      testText("Cajun");
    }
  
    if (inData == "N") {
      Serial.println("LED ON");
      testText("Cinnamon");
    }
  }

//  if (Serial.available()) {           // Read user input if available.
//    delay(10);
//    HM10.write(Serial.read());
//  }
}

void testText(String string) {
  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setTextColor(ILI9341_WHITE);
  tft.setTextSize(3);
  tft.println(string);
}
