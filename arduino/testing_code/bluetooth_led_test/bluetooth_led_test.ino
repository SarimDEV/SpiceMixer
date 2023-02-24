#include <SoftwareSerial.h>

SoftwareSerial HM10(2, 3); // RX = 0, TX = 1
char appData;
String inData = "";

void setup() {
  Serial.begin(9600);
  Serial.println("HM10 serial started at 9600");
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  pinMode(12, OUTPUT); // onboard LED
  digitalWrite(12, LOW); // switch OFF LED
}


void loop() {
  HM10.listen();  // listen the HM10 port
  Serial.println("Listening")
  while (HM10.available() > 0) {   // if HM10 sends something then read
    appData = HM10.read();
    inData = String(appData);  // save the data in string format
    Serial.write("APP DATA: ", appData);
  }

  if (Serial.available()) {           // Read user input if available.
    HM10.write(Serial.read());
  }

  if ( inData == "F") {
    Serial.println("LED OFF");
    digitalWrite(12, LOW); // switch OFF LED
    delay(500);
  }

  if ( inData == "N") {
    Serial.println("LED ON");
    digitalWrite(12, HIGH); // switch OFF LED
    delay(500);
    digitalWrite(12, LOW); // switch OFF LED
    delay(500);
  }
}
