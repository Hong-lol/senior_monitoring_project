import torch
import cv2
import requests
import json
from datetime import datetime

# 1. YOLOv5 모델 로드
model = torch.hub.load('ultralytics/yolov5', 'custom', path='/Users/hyungjunehong/Documents/캡스톤디자인/senior_monitoring_project/best.pt')

# 2. 웹캠 열기
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 3. 추론
    results = model(frame)
    detections = results.pandas().xyxy[0]  # 판다스로 결과 받기

    # 4. JSON 데이터로 변환
    data = {
        "person_name" : "홍길동",
        "timestamp": datetime.now().isoformat(),
        "detected": []
    }
    for _, row in detections.iterrows():
        data["detected"].append({
            "class": row["name"],
            "confidence": float(row["confidence"]),
            "bbox": [int(row["xmin"]), int(row["ymin"]), int(row["xmax"]), int(row["ymax"])]
        })
    df = results.pandas().xyxy[0]

    print("==== YOLO 추론 결과 ====")
    print(df)
    results.print()     # 터미널에 감지된 객체 수 출력
    # 5. Django API 서버로 전송
    try:
        res = requests.post("http://127.0.0.1:8000/api/pose-result/", json=data)
        print(res.status_code, res.text)
    except Exception as e:
        print("전송 실패:", e)

    # 6. 화면 출력 (디버그용)
    cv2.imshow("Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
