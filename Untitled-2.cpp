#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "MMA7660.h"

#include "secrets.h"

BearSSL::X509List client_crt(certificatePemCrt);
BearSSL::PrivateKey client_key(privatePemKey);
BearSSL::X509List rootCert(caPemCrt);

WiFiClientSecure wiFiClient;
void msgReceived(char* topic, byte* payload, unsigned int len);
PubSubClient pubSubClient(awsEndpoint, 8883, msgReceived, wiFiClient);

MMA7660 acc;

int reqs = 0;
void setup() {
  Serial.begin(115200); Serial.println();
  Serial.println("ESP8266 AWS IoT");

  Serial.print("Connecting to "); Serial.print(ssid);
  WiFi.begin(ssid, password);
  WiFi.waitForConnectResult();
  Serial.print(", WiFi connected, IP address: ");
  Serial.println(WiFi.localIP());

  setCurrentTime();

  wiFiClient.setClientRSACert(&client_crt, &client_key);
  wiFiClient.setTrustAnchors(&rootCert);

  acc.init();
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
}

unsigned long lastPublish;
int msgCount;
bool fall=false;

void loop() {
  static long cnt = 0;
  static long cntout = 0;
  float ax,ay,az;
  
  pubSubCheckConnect();
  
  acc.getAcceleration(&ax,&ay,&az);
  if((ay>1.4 || ay <-1.4) && fall == false){
    fall=true;
    reqs=0;
    Serial.print("Caduta Avvertita ");
  }
  
  if (millis() - lastPublish > 5000) {
    if(fall && reqs <= 10){
      String msg = String("{\"Warning: detected fall\"}");// + ++msgCount;
      bool response = pubSubClient.publish("ruat/esp1/pub", msg.c_str());
      reqs++;
      while(!response){
        response = pubSubClient.publish("ruat/esp1/pub", msg.c_str());
      }
      if(reqs==10){
        reqs=0;
        fall=false;
      }
      Serial.print("Published: "); Serial.println(msg);
      lastPublish = millis();
    }
  }
  delay(50);
}
void al(){
    tone(12, 293.66, 300); 
    tone(12, 466.16, 250);
    delay(500);
    tone(12, 293.66, 300); 
    tone(12, 466.16, 250);
    delay(500);
    tone(12,293.66, 300);
    tone(12, 466.16, 250);
}
void msgReceived(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on "); Serial.print(topic); Serial.print(": ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    fall=false;
  }
  al();
  al();
  Serial.println();
}

void pubSubCheckConnect() {
  if ( ! pubSubClient.connected()) {
    Serial.print("PubSubClient connecting to: "); Serial.print(awsEndpoint);
    while ( ! pubSubClient.connected()) {
      Serial.print(".");
      pubSubClient.connect("ESPthing");
    }
    Serial.println(" connected");
    pubSubClient.subscribe("ruat/esp1/dash");
  }
  pubSubClient.loop();
}

void setCurrentTime() {
  configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("");
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("Current time: "); Serial.print(asctime(&timeinfo));
}