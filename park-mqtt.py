
import time
import paho.mqtt.client as mqtt
import circuit # 초음파 센서 입력 모듈 임포트
import picamera
import datetime
import os
import io
import cv2
import numpy as np

camera = picamera.PiCamera()
fileName = ""
stream = io.BytesIO()

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
        client.publish("ultrasonic", distance, qos=0)
        time.sleep(1)
        cnt=cnt+1
        if cnt%2!=0:
            a=distance
        else:
            b=distance
            if compare(a,b)==True:
                if len(fileName) != 0:
                    os.unlink(fileName)
                stream.seek(0) # 파일 포인터를 스트림 맨 앞으로 위치시킴. 이곳에
서부터 이미지 데이터 저장
                stream.truncate()
                time.sleep(1)
                camera.capture(stream, format='jpeg', use_video_port=True)
                data = np.frombuffer(stream.getvalue(), dtype=np.uint8)
                image = cv2.imdecode(data, 1)
                takeTime = time.time()
                fileName = "./static/%d.jpg" % (takeTime * 10)
                cv2.imwrite(fileName, image)

client.loop_stop()
client.disconnect()