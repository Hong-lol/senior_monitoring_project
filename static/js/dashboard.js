// 전역 변수로 사람 데이터 저장
let peopleData = [];

// 로그 헬퍼 함수
function logDebug(message, data) {
    console.log(`🔍 ${message}`, data || '');
    // 화면에도 로그 표시
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
    
    // ID가 문자열인지 확인
    personId = String(personId);
    
    // 모든 대시보드 숨기기
    const dashboards = document.querySelectorAll('.dashboard');
    dashboards.forEach(dashboard => {
        dashboard.classList.remove('active');
    });
    
    // 선택한 대시보드 표시
    const targetDashboard = document.getElementById(`person${personId}`);
    
    if (targetDashboard) {
        targetDashboard.classList.add('active');
        logDebug(`대시보드 활성화: person${personId}`);
    } else {
        logDebug(`대시보드를 찾을 수 없음: person${personId}`);
    }
    
    // 모든 버튼에서 active 클래스 제거
    const buttons = document.querySelectorAll('.person-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 선택한 버튼에 active 클래스 추가
    const activeButton = document.querySelector(`.person-btn[data-person-id="${personId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 사람 목록 렌더링 함수
function renderPeopleList() {
    logDebug('사람 목록 렌더링 시작');
    
    const personList = document.querySelector('.person-list');
    if (!personList) {
        logDebug('사람 목록 컨테이너를 찾을 수 없음');
        return;
    }
    
    let html = '';
    
    peopleData.forEach(person => {
        html += `
            <li class="person-item">
                <button class="person-btn ${person.status}" data-person-id="${person.id}" onclick="showPerson(${person.id})">
                    <span class="person-name">${person.name}</span>
                    <span class="person-info">${person.age}세 | 위치: ${person.location}</span>
                </button>
                <div class="status-indicator status-${person.status}"></div>
            </li>
        `;
    });
    
    personList.innerHTML = html;
    logDebug(`${peopleData.length}명의 사람 목록 렌더링 완료`);
}

// 대시보드 요소 렌더링 함수
function renderDashboards() {
    logDebug('대시보드 요소 렌더링 시작');
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        logDebug('메인 콘텐츠 영역을 찾을 수 없음');
        return;
    }
    
    // 기존 헤더를 보존
    const header = mainContent.querySelector('.main-header');
    const headerHtml = header ? header.outerHTML : `
        <div class="main-header">
            <h1 class="page-title">노인 안전 모니터링 시스템</h1>
            <div class="current-time" id="current-time">00:00:00</div>
        </div>
    `;
    
    // 대시보드 HTML 생성
    let dashboardsHtml = '';
    
    peopleData.forEach((person, index) => {
        // 심박수 상태 결정
        let heartRateStatus = "normal";
        let heartRateText = "정상 범위";
        
        if (person.heart_rate > 90) {
            heartRateStatus = "danger";
            heartRateText = "심박수 높음";
        } else if (person.heart_rate < 70) {
            heartRateStatus = "warning";
            heartRateText = "심박수 낮음";
        }
        
        dashboardsHtml += `
            <div id="person${person.id}" class="dashboard ${index === 0 ? 'active' : ''}">
                <div class="person-header">
                    <div class="person-title">
                        <div class="person-avatar">
                            <span class="avatar-text">${person.name.charAt(0)}</span>
                        </div>
                        <div class="person-details">
                            <h2>${person.name}</h2>
                            <p>${person.age}세 | 현재 위치: ${person.location}</p>
                        </div>
                    </div>
                    ${person.status === 'danger' ? `
                    <button class="emergency-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        긴급 지원 호출
                    </button>
                    ` : ''}
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon icon-heart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <div class="stat-title">심박수</div>
                        <div class="stat-value">${person.heart_rate} <span>BPM</span></div>
                        <div class="stat-status status-${heartRateStatus}">${heartRateText}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon icon-activity">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <div class="stat-title">활동 상태</div>
                        <div class="stat-value">${person.activity_status}</div>
                        <div class="stat-status status-${person.status}">
                            ${person.status === 'normal' ? '정상 활동 중' : 
                             person.status === 'warning' ? '주의 필요' : '즉시 확인 필요'}
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon icon-temp">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                            </svg>
                        </div>
                        <div class="stat-title">체온</div>
                        <div class="stat-value">${person.temperature} <span>°C</span></div>
                        <div class="stat-status status-${person.temperature > 37.5 ? 'warning' : 'normal'}">
                            ${person.temperature > 37.5 ? '체온 높음' : '정상 범위'}
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon icon-humidity">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                            </svg>
                        </div>
                        <div class="stat-title">실내 습도</div>
                        <div class="stat-value">${person.humidity} <span>%</span></div>
                        <div class="stat-status status-normal">적정 습도</div>
                    </div>
                </div>
                
                <div class="history-card">
                    <div class="history-header">
                        <div class="history-title">24시간 생체 지표 변화</div>
                    </div>
                    <div class="chart-container">
                        <div class="mock-chart"></div>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color color-heart"></div>
                            <span>심박수 (BPM)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color color-temp"></div>
                            <span>체온 (°C)</span>
                        </div>
                    </div>
                </div>
                
                <div class="alert-card">
                    <div class="alert-header">
                        <div class="alert-title">최근 알림</div>
                    </div>
                    <div class="alert-list">
                        <div class="alert-item info">
                            <div class="alert-item-title info">약 복용 시간</div>
                            <div class="alert-item-details">식사 후 혈압약</div>
                            <div class="alert-time">오늘 08:00</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // 메인 콘텐츠에 HTML 설정
    mainContent.innerHTML = headerHtml + dashboardsHtml;
    
    logDebug(`${peopleData.length}개의 대시보드 요소 렌더링 완료`);
}

// 시간 업데이트 함수
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerText = `${hours}:${minutes}:${seconds}`;
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    logDebug('페이지 로드됨');
    
    // 디버그 로그 표시 영역 추가
    const logContainer = document.createElement('div');
    logContainer.id = 'debug-log';
    logContainer.style.cssText = 'position: fixed; bottom: 10px; right: 10px; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; z-index: 9999;';
    document.body.appendChild(logContainer);
    
    // 시간 업데이트 시작
    updateTime();
    setInterval(updateTime, 1000);
    
    // 정적 JSON 파일에서 데이터 가져오기
    logDebug('JSON 데이터 로딩 시도...');
    
    fetch('/static/data/people.json')
        .then(response => {
            logDebug(`응답 상태: ${response.status}, OK: ${response.ok}`);
            return response.json();
        })
        .then(data => {
            logDebug(`JSON 데이터 로드 성공, ${data.length}명의 사람 데이터`);
            peopleData = data;
            
            // 사람 목록 렌더링
            renderPeopleList();
            
            // 대시보드 요소 렌더링
            renderDashboards();
            
            // 첫 번째 사람 선택
            if (peopleData.length > 0) {
                showPerson(peopleData[0].id);
            }
        })
        .catch(error => {
            logDebug(`데이터 로딩 오류: ${error.message}`);
        });
});