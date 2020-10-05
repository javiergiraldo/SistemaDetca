//SISTEMA DETCA
void setup() { 
    
    Serial.begin(9600);
    }

void loop() {
  
    int adc_MQ = analogRead(A0);                  //Leemos la salida analógica  del MQ
    float voltaje = adc_MQ * (5.0 / 1023.0);      //Convertimos la lectura en un valor de voltaje
    float Rs=1000*((5-voltaje)/voltaje);          //Calculamos Rs con un RL de 1k
    double alcohol=0.4091*pow(Rs/5463, -1.497);   // calculamos la concentración  de alcohol con la ecuación obtenida.
                        
        //-------Enviamos los valores por el puerto serial------------
        
        //Serial.print("    Voltaje: ");
        //Serial.print(voltaje);
        Serial.print("    Alcohol: ");
        Serial.print(alcohol);
        Serial.print(" mg/L");
        Serial.println("   ");
        delay(500);
        
        //--------------Sistema de Alertas--------------------------------
        
           if(alcohol==0) // En caso que el sensor se desconecte o se queme
                {
                  Serial.print("    ");
                  Serial.print("  ¡SENSOR INACTIVO!  ");
                  Serial.println("    ");
                }
            
           if (alcohol>8.3) // Cuando los niveles de alcohol pasen de 23.5 mg/L(miligramos por Litro) Activará el led
                {
                 digitalWrite(12, HIGH);   // turn the LED on (HIGH is the voltage level)
                 delay(30);                       // wait for a second
                 digitalWrite(12, LOW);    // turn the LED off by making the voltage LOW
                 delay(30);                       // wait for a second
                 Serial.print("    ");
                 Serial.print("  ¡ALERTA!  ");
                 Serial.print("  ¡ALTA CONCENTRACIÓN DE GAS!  ");
                 Serial.println("    ");
                }
              else
                {
                 digitalWrite(12, LOW);
                }
      
        delay(1200);//Esperamos 1 segundo
       
}
