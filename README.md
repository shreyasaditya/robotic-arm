GESTURE CONTROLLED ROBOTIC MANIPULATOR ARM
------------------------------------------
------------------------------------------


I. SALIENT FEATURES
-------------------

1.This project focuses on the need to humanize machine control by providing a simple web application interface to wireless control 
remote machinery using gestures as an input method.

2.JavaScript is used as the core scripting language to detect the gestures.

3.The input gestures, once recognized and transmitted over WiFi networks using WebSockets are then translated into fluid
machine movements in the robotic arm, which uses a microcontroller as it’s main control center.

4.The robotic arm used in this project is a multiple joint manipulator arm with a grabber end effector and the client-side is 
required to possess the required infra-red based sensors.

5.Presently available control devices are unable to economically provide a human oriented approach such as this.


II. TECHNICAL SPECIFICATIONS
----------------------------

A.Hardware Requirements
-----------------------

1.Computer Requirements
	
	Operating System : Mac OS X 10.7 Lion |
			   Windows 7 or Windows 8 |
			   Ubuntu 12 

	Processor 	 : AMD Phenom II or Intel Core i3

	RAM 		 : 2GB

	Hard Disk 	 : 5GB

2.Arduino Yun 

3.Leap Motion

4.5-DOF Robotic Arm

5.USB 2.0 Webcam (UVC Compliant)


B.Software Requirements
-----------------------

1.Web Browser - Tested on Google Chrome Browser and Mozilla Firefox

2.Leap Motion Driver

3.Arduino IDE

4.PuTTY

5.WinSCP


III. INSTRUCTIONS
-----------------

Please follow the instructions given below to setup and run the project. The instructions have been divided into three different sections:

A. Arduino Sketch 
-----------------

1.Connect the arduino yun to the computer using the micro USB cable.

2.Open the file contained in the Arduino Sketch, using the Arduino IDE.

3.Click the compile and upload button to complie the sketch and upload it onto the arduino.

4.Now you can disonnect the micro USB cable from the computer and power the Yun using a power bank or power adapter
with an output voltage of 5V.

5.Alternatively you can leave the cable connected to the computer abd continue powering the Yun with the computer
itself

B. Hosting the Client & Server Side files on the Arduino Yun
------------------------------------------------------------

1.Make sure the Arduino yun is powered up.
 
2.The Arduino Yun will be running in Access Point mode. You need to connect your computer to the WiFi network created by Arduino.
The SSID of the network will be "Arduino Yun - XXXXXXXXXXXX", where the 'X' denotes the MAC Address of the Yun.

3.Once your computer is on the Arduino's network open your browser and goto the following address :
192.168.240.1

4.The password for the configuration will be asked. The default password is "arduino".

5.Click configure.

6.Now we can configure the arduino to connect to your own router's WiFi network. Add your router's SSID 
Type of encrytion and the WiFi password.

7.The Yun will restart and connect to your router's network. 

8.Now connect your computer to your WiFi network. The arduino and your computer are on the same network.

9.Insert the SD card into the Yun.

10.Since the Yun doesnt have an HDMI or VGA out, to access the file system we need to remotely log in to the Yun using
SSH.

11.If you are on Windows open PuTTY and type in the Yun's IP address assigned by your router.

12.The address of the Yun can be found using the Arduino IDE. Click Tools and then Ports. One of the options will contain
the IP address of the Yun.

13.Login as root

14.Password is "arduino"

15.The sd card's location is "/mnt/sda1/"

16.The Client and Server files found in the "ClientSide" and "ServerSide" folders of the CD are moved onto the yun using WinSCP
any other SCP program. The Folders are placed on the SD card.


C. Starting the Server
----------------------

1.Using the ongoing SSH connection th=o the Yun open the Server directory using this command :

"cd /mnt/sda1/ServerSide"

2.Start the server using this command :

"python SockServer.py"

3.Open a new paralled SSH connection as mentioned before .

4.To start the webcam run the following command:

mjpg_streamer -i "input_uvc.so -d /dev/video0 -r 640x480 -f 15" -o "output_http.so -p 8085 -w /mnt/sda1/webcam"


D. Accessing the Web Application
--------------------------------

1.Using any computer which has the Leap Motion device and which is connected to the same WiFi network as the Arduino Yun
Open the web browser.

2. Goto the following address to access the Web Application :

http://[IP ADDRESS OF YUN]/sd/ClientSide/RoboticArm.html

ex : http://192.168.1.15/sd/ClientSide/RoboticArm.html

--------------
End of Read Me
--------------