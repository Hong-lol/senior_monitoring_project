from django.db import models

class Person(models.Model):
    NORMAL = 'normal'
    WARNING = 'warning'
    DANGER = 'danger'
    STATUS_CHOICES = [
        (NORMAL, '정상'),
        (WARNING, '주의'),
        (DANGER, '위험'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='이름')
    age = models.IntegerField(verbose_name='나이')
    location = models.CharField(max_length=100, verbose_name='현재 위치')
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default=NORMAL,
        verbose_name='상태'
    )
    heart_rate = models.IntegerField(verbose_name='심박수')
    activity_status = models.CharField(max_length=100, verbose_name='활동 상태')
    temperature = models.FloatField(verbose_name='체온')
    humidity = models.IntegerField(verbose_name='주변 습도')
    
    def __str__(self):
        return self.name

class Alert(models.Model):
    INFO = 'info'
    WARNING = 'warning'
    DANGER = 'danger'
    ALERT_TYPE_CHOICES = [
        (INFO, '정보'),
        (WARNING, '주의'),
        (DANGER, '위험'),
    ]
    
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='alerts')
    title = models.CharField(max_length=200, verbose_name='알림 제목')
    details = models.TextField(verbose_name='알림 세부 내용')
    alert_type = models.CharField(
        max_length=20, 
        choices=ALERT_TYPE_CHOICES, 
        default=INFO,
        verbose_name='알림 유형'
    )
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='알림 시간')
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.title} ({self.person.name})"
