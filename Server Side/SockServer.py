import serial
import sys

from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer

class SockServer(WebSocket):

    def handleMessage(self):
        global ss
        if self.data is None:
            self.data = ''

        print self.data
        ss.write(str(self.data))


    def handleConnected(self):
        print self.address, 'connected'


    def handleClose(self):
        print self.address, 'closed'


ss = serial.Serial('/dev/ttyATH0',9600,timeout = 1)


server = SimpleWebSocketServer('', 8082, SockServer)
server.serveforever()

