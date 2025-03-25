from django.shortcuts import render
from django.http import JsonResponse
from .models import Person, Alert
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
import json

def dashboard(request):
    """대시보드 메인 페이지 뷰"""
    people = Person.objects.all()
    return render(request, 'monitoring/dashboard.html', {'people': people})

def person_detail_api(request, person_id):
    try:
        person = Person.objects.get(id=person_id)
        alerts = person.alerts.all().order_by('-timestamp')[:5]

        alerts_data = [
            {
                "title": alert.title,
                "details": alert.details,
                "alert_type": alert.alert_type,
                "timestamp": alert.timestamp.strftime('%Y-%m-%d %H:%M')
            } for alert in alerts
        ]

        return JsonResponse({
            "success": True,
            "data": {
                "id": person.id,
                "name": person.name,
                "age": person.age,
                "location": person.location,
                "status": person.status,
                "heart_rate": person.heart_rate,
                "activity_status": person.activity_status,
                "temperature": person.temperature,
                "humidity": person.humidity,
                "alerts": alerts_data
            }
        })

    except Person.DoesNotExist:
        return JsonResponse({"success": False, "error": "Person not found"}, status=404)


def dashboard_json(request):
    """JSON 파일 기반 대시보드 뷰"""
    return render(request, 'monitoring/dashboard_json.html')

@csrf_exempt
def receive_pose_result(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            name = body.get("person_name")
            timestamp = parse_datetime(body.get("timestamp"))

            person, _ = Person.objects.get_or_create(name=name, defaults={
                "age": 0,
                "location": "미지정",
                "heart_rate": 0,
                "status": "normal",
                "activity_status": "",
                "temperature": 36.5,
                "humidity": 50
            })

            for item in body.get("detected", []):
                # class를 그대로 activity_status로 저장
                person.activity_status = item["class"]

                # 상태 분류
                if item["class"] == "fallen":
                    status = "danger"
                else:
                    status = "normal"

                person.status = status
                person.save()

                Alert.objects.create(
                    person=person,
                    title=f"{item['class']} 감지됨",
                    details=f"신뢰도: {item['confidence']:.2f}",
                    alert_type=status,
                    timestamp=timestamp
                )

            return JsonResponse({"message": "OK"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)
