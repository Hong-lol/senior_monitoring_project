from django.shortcuts import render
from django.http import JsonResponse
from .models import Person, Alert

def dashboard(request):
    """대시보드 메인 페이지 뷰"""
    people = Person.objects.all()
    return render(request, 'monitoring/dashboard.html', {'people': people})

def person_detail_api(request, person_id):
    """특정 사람의 정보를 JSON으로 반환하는 API 뷰"""
    try:
        person = Person.objects.get(id=person_id)
        alerts = person.alerts.all()[:5]  # 최근 알림 5개만
        
        # JSON 응답 데이터 구성
        alerts_data = [
            {
                'title': alert.title,
                'details': alert.details,
                'alert_type': alert.alert_type,
                'timestamp': alert.timestamp.strftime('%Y-%m-%d %H:%M')
            } for alert in alerts
        ]
        
        data = {
            'id': person.id,
            'name': person.name,
            'age': person.age,
            'location': person.location,
            'status': person.status,
            'heart_rate': person.heart_rate,
            'activity_status': person.activity_status,
            'temperature': person.temperature,
            'humidity': person.humidity,
            'alerts': alerts_data
        }
        
        return JsonResponse({'success': True, 'data': data})
    except Person.DoesNotExist:
        return JsonResponse({'success': False, 'error': '해당 인물을 찾을 수 없습니다.'}, status=404)

def dashboard_json(request):
    """JSON 파일 기반 대시보드 뷰"""
    return render(request, 'monitoring/dashboard_json.html')

