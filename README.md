# senior_monitoring_project
# 🧓 CNN 기반 노인 자세 분석을 통한 실시간 모니터링 시스템

고령 인구의 낙상 사고를 예방하기 위해, YOLOv5 기반의 자세 감지 모델을 활용하여 **실시간으로 낙상 여부를 판단**하고, **웹 대시보드에 경고 상태를 반영**하는 시스템입니다.

## 📌 주요 기능

- 📹 YOLOv5로 실시간 자세 인식 (standing, falling, fallen)
- ⚠️ 위험 자세 감지 시 Django 서버로 경고 전송
- 🌐 웹 대시보드에서 대상자 상태 실시간 반영
- 🔔 긴급 상황 발생 시 관리자 UI에 경고 출력
- 🧠 모델 경량화 (Quantization, Pruning)로 엣지 디바이스 최적화

## 🛠 기술 스택

| 분야       | 사용 기술                  |
|------------|----------------------------|
| AI 모델     | YOLOv5 (custom dataset)     |
| 서버       | Django, Django REST API     |
| 프론트엔드 | HTML/CSS, JavaScript        |
| DB        | MySQL                       |
| 배포       | Raspberry Pi, ngrok         |


## 📡 시스템 흐름도

1. 실시간 또는 영상 기반 추론
2. `POST /api/pose-result/`로 결과 전송
3. Django 서버가 DB 갱신 및 Alert 생성
4. 웹 대시보드에 실시간 반영

## ⚙️ 설치 및 실행 방법

```bash
# 1. 가상환경 설정 및 의존성 설치
pip install -r requirements.txt

# 2. MySQL 실행 및 Django 마이그레이션
python manage.py migrate

# 3. 서버 실행
python manage.py runserver

# 4. YOLO 추론 및 전송
python detect_and_send_video.py
