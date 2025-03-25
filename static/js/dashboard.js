// 전역 변수로 사람 데이터 저장
let peopleData = [];

// 로그 헬퍼 함수
function logDebug(message, data) {
    console.log(`🔍 ${message}`, data || '');
    const logElement = document.getElementById('debug-log');
    if (logElement) {
        const logItem = document.createElement('div');
        logItem.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logElement.appendChild(logItem);
    }
}

// 대시보드 전환 함수
function showPerson(personId) {
    logDebug(`showPerson 함수 호출됨 - ID: ${personId}`);
    personId = String(personId);

    document.querySelectorAll('.dashboard').forEach(d => d.classList.remove('active'));
    const targetDashboard = document.getElementById(`person${personId}`);
    if (targetDashboard) targetDashboard.classList.add('active');

    document.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
    const activeButton = document.querySelector(`.person-btn[data-person-id="${personId}"]`);
    if (activeButton) activeButton.classList.add('active');
}

// 실시간 상태 업데이트 함수
function updateLiveStatus(personId) {
    fetch(`/person_detail_api/${personId}/`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const person = data.data;
                const btn = document.querySelector(`.person-btn[data-person-id="${personId}"]`);
                const indicator = btn?.nextElementSibling;
                btn.classList.remove('normal', 'warning', 'danger');
                btn.classList.add(person.status);
                if (indicator) indicator.className = `status-indicator status-${person.status}`;

                const dashboard = document.getElementById(`person${personId}`);
                if (dashboard) {
                    // 상태가 danger일 경우 버튼 추가 또는 표시
                    const emergencyButton = dashboard.querySelector('.emergency-btn');
                    if (person.status === 'danger') {
                        if (!emergencyButton) {
                            const button = document.createElement('button');
                            button.className = 'emergency-btn';
                            button.innerText = '긴급 지원 호출';
                            dashboard.querySelector('.person-header').appendChild(button);
                        }
                    } else {
                        if (emergencyButton) emergencyButton.remove();
                    }
                    const activityCard = dashboard.querySelector(`.activity-status-card[data-person-id="${personId}"]`);
                    if (activityCard) {
                        const statStatus = activityCard.querySelector('.stat-status.activity-status-text');
                        if (statStatus) {
                            statStatus.innerText = person.status === 'danger' ? '즉시 확인 필요' : person.status === 'warning' ? '주의 필요' : '정상 활동 중';
                            statStatus.className = `stat-status activity-status-text status-${person.status}`;
                        }

                        const statValue = activityCard.querySelector('.stat-value');
                        if (statValue) {
                            statValue.innerText = person.activity_status || '';
                        }
                    }

                    // 🔔 실시간 알림 리스트 업데이트
                    const alerts = person.alerts || [];
                    const alertList = dashboard.querySelector('.alert-list');
                    if (alertList) {
                        alertList.innerHTML = alerts.map(alert => `
                            <div class="alert-item ${alert.alert_type}">
                                <div class="alert-item-title">${alert.title}</div>
                                <div class="alert-item-details">${alert.details}</div>
                                <div class="alert-time">${alert.timestamp}</div>
                            </div>
                        `).join('');
                    }
                }
            }
        })
        .catch(err => console.error('상태 업데이트 오류:', err));
}

function startLiveStatusUpdate() {
    setInterval(() => {
        peopleData.forEach(p => updateLiveStatus(p.id));
    }, 5000);
}

function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    logDebug('페이지 로드됨');

    const logContainer = document.createElement('div');
    logContainer.id = 'debug-log';
    logContainer.style.cssText = 'position: fixed; bottom: 10px; right: 10px; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; z-index: 9999;';
    document.body.appendChild(logContainer);

    peopleData = window.peopleData || [];

    updateTime();
    setInterval(updateTime, 1000);
    startLiveStatusUpdate();

    // 영상 스트리밍 제거
});
