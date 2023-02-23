#include <SoftwareSerial.h>
#define MAX_SIZE 12

SoftwareSerial HM10(2, 3); // RX = 0, TX = 1
char appData;
String inData = "";


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

void setup() {
  Serial.begin(9600);
  Serial.println("HM10 serial started at 9600");
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  pinMode(13, OUTPUT); // onboard LED
  digitalWrite(13, LOW); // switch OFF LED
  String dummy = "new_recipe:[[1,2],[2,4]]";
  String dataType = getValue(dummy, ':', 0);
  String data = getValue(dummy, ':', 1);

  int arr[12][2];
  int amount = recipeParser(data, arr);
  Serial.println(amount);
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      Serial.println(arr[i][j]);
    }
  }
}


void loop() {
  HM10.listen();  // listen the HM10 port
  while (HM10.available() > 0) {   // if HM10 sends something then read
    appData = HM10.read();
    inData = String(appData);  // save the data in string format
    Serial.write(appData);
  }

  if (Serial.available()) {           // Read user input if available.
    HM10.write(Serial.read());
  }

  if ( inData == "F") {
    digitalWrite(13, LOW); // switch OFF LED
    delay(500);
  }

  if ( inData == "N") {
    digitalWrite(13, HIGH); // switch OFF LED
  }
}