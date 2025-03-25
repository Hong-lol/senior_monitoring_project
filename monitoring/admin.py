from django.contrib import admin
from .models import Person, Alert

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'location', 'status', 'heart_rate')
    list_filter = ('status', 'location')
    search_fields = ('name',)

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'person', 'alert_type', 'timestamp')
    list_filter = ('alert_type', 'person')
    date_hierarchy = 'timestamp'