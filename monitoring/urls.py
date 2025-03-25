from django.contrib import admin
from django.urls import path
from . import views

app_name = 'monitoring'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.dashboard, name='dashboard'),
    path('json/', views.dashboard_json, name='dashboard_json'),
    path('api/pose-result/', views.receive_pose_result, name='pose_result'),
    path('person_detail_api/<int:person_id>/', views.person_detail_api, name='person_detail_api'), # ✅ 추가
]
