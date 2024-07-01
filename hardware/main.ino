#include <ArduinoJSON.h>
#include <WiFi.h>
#include <Wire.h>
// didn't add SPI library, there might be an issue!

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

#define OLED_RESET -1       // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3D ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/*
LCD pin definitions here
*/

// Button definitions
int prev = 2;
int next = 3;
int index = 0;

String api_url = "https://hcattendance.com/api";

WiFiClient client;

void displayData(String message)
{
    display.clearDisplay();
    display.display();
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.setTextSize(1);
    display.println(message);
    display.display();
}

void parseJsonData(int index)
{
    HTTPClient http;
    WiFiClient client;

    // Send request
    http.useHTTP10(true);
    http.begin(client, api_url);
    http.GET();

    // Parse response
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, http.getStream());
    http.end();

    String messagefrag = doc[index]; // fix this to deserialize the json properly!!!

    displayData(messagefrag); // displays message
}

void interface() // button controls, refreshes data on change; might want to add async periodic updates thought
{
    if (prev)
    {
        index = 0 ? index = 6 : index--;
        delay(300);
    }
    else if (next)
    {
        index == 6 ? index = 0 : index++;
        delay(300)
    }
    else
    {
        return;
    }

    parseJsonData(index);
}

void setup()
{
    pinMode(prev, INPUT_PULLUP);
    pinMode(next, INPUT_PULLIP);
    parseJsonData(index);
}

void loop()
{
    interface();
}