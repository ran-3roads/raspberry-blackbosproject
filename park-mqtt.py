# publisher

import time
import paho.mqtt.client as mqtt
import circuit # 초음파 센서 입력 모듈 임포트
import picamera
import datetime


camera = picamera.PiCamera()
filename=""
broker_ip = "localhost" # 현재 이 컴퓨터를 브로커로 설정

client = mqtt.Client()
client.connect(broker_ip, 1883)
client.loop_start()

def compare(a,b):
        res=int(a-b)
        if res>7:
                return True
        else:
                return False

cnt=0
a=0
b=0

while(True):
        distance = circuit.measureDistance()
        time.sleep(1)
        cnt=cnt+1
        if cnt%2!=0:
            a=distance
        else:
            b=distance
            if compare(a,b)==True:
                client.publish("ultrasonic", distance, qos=0)
                filename=datetime.datetime.now().strftime("%Y-%-m-%-d %H-%M-%S")
                camera.resolution = (800, 600)
                camera.start_preview()
                camera.start_recording('./CCTV-record/'+filename+'.h264')
                camera.wait_recording(10)
                camera.capture('./CCTV-image/'+filename+'.jpg', use_video_port=True)
                camera.wait_recording(3)
                camera.stop_recording()

client.loop_stop()
client.disconnect()