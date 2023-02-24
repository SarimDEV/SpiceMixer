#include <SoftwareSerial.h>

SoftwareSerial HM10(2, 3); // RX = 0, TX = 1
char appData;
String inData = "";

String rawData = "";
String dataType = "";
String data = "";

int configArr[12];
int numContainers = 0;

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

void setup() {
  Serial.begin(9600);
  Serial.println("HM10 serial started at 9600");
  HM10.begin(9600); // set HM10 serial at 9600 baud rate
  pinMode(13, OUTPUT); // onboard LED
  digitalWrite(13, LOW); // switch OFF LED
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
    digitalWrite(13, HIGH); // switch ON LED

    numContainers = configurationParser(data, configArr);
    Serial.println(numContainers);

    dataType = "";
    data = "";

    // for (int i = 0; i < numContainers; i++) {
    //   Serial.println(configArr[i]);
    // }

    Serial.println("successfully configured machine!");

  }

  if (dataType == "N") {
    Serial.println("parsing recipe data...");
    digitalWrite(13, HIGH); // switch ON LED

    int arr[12][2];
    int amount = recipeParser(data, arr);
    Serial.println(amount);

    dataType = "";
    data = "";

    // for (int i = 0; i < amount; i++) {
    //   for (int j = 0; j < 2; j++) {
    //     Serial.println(arr[i][j]);
    //   }
    // }

    Serial.println("successfully saved recipe!");
  }
}