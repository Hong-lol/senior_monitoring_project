let peopleData = [];
let alertsData = [];

// 페이지 로드 시 데이터 가져오기
document.addEventListener('DOMContentLoaded', function() {
    // 사람 데이터 가져오기
    fetch('/static/data/people.json')
        .then(response => response.json())
        .then(data => {
            peopleData = data;
            renderPeopleList();
            
            // 첫 번째 사람 정보 표시
            if (peopleData.length > 0) {
                showPerson(peopleData[0].id);
            }
        })
        .catch(error => {
            console.error('사람 데이터 로딩 에러:', error);
            document.querySelector('.main-content').innerHTML = `
                
                    데이터를 불러올 수 없습니다
                    JSON 파일 경로를 확인해주세요: ${error.message}
                
            `;
        });
    
    // 알림 데이터 가져오기
    fetch('/static/data/alerts.json')
        .then(response => response.json())
        .then(data => {
            alertsData = data;
        })
        .catch(error => {
            console.error('알림 데이터 로딩 에러:', error);
        });
    
    // 시간 업데이트 시작
    updateTime();
    setInterval(updateTime, 1000);
});

// 시간 업데이트 함수
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('current-time').innerText = `${hours}:${minutes}:${seconds}`;
}

// 사람 목록 렌더링
function renderPeopleList() {
    const personList = document.querySelector('.person-list');
    let html = '';
    
    peopleData.forEach(person => {
        html += `
            
                
                    ${person.name}
                    ${person.age}세 | 위치: ${person.location}
                
                
            
        `;
    });
    
    personList.innerHTML = html;
}

// 대시보드 전환 함수
function showPerson(personId) {
    console.log("사람 ID:", personId);
    
    // ID로 사람 데이터 찾기
    const person = peopleData.find(p => p.id == personId);
    if (!person) {
        console.error(`ID가 ${personId}인 사람을 찾을 수 없습니다.`);
        return;
    }
    
    // 해당 사람의 알림 찾기
    const personAlerts = alertsData.filter(alert => alert.person_id == personId);
    
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
    
    // 대시보드 콘텐츠 생성
    renderDashboard(person, personAlerts);
}

// 대시보드 콘텐츠 렌더링
function renderDashboard(person, alerts) {
    const dashboardContainer = document.getElementById('dashboard-container');
    
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
    
    // 알림 HTML 생성
    let alertsHtml = '';
    alerts.forEach(alert => {
        const alertDate = new Date(alert.timestamp);
        const today = new Date();
        
        let dateText = '';
        if (alertDate.toDateString() === today.toDateString()) {
            dateText = '오늘 ' + alertDate.getHours().toString().padStart(2, '0') + ':' + 
                     alertDate.getMinutes().toString().padStart(2, '0');
        } else if (alertDate > today) {
            dateText = (alertDate.getMonth() + 1).toString().padStart(2, '0') + '월 ' +
                     alertDate.getDate().toString().padStart(2, '0') + '일 ' +
                     alertDate.getHours().toString().padStart(2, '0') + ':' +
                     alertDate.getMinutes().toString().padStart(2, '0');
        } else {
            dateText = (alertDate.getMonth() + 1).toString().padStart(2, '0') + '월 ' +
                     alertDate.getDate().toString().padStart(2, '0') + '일';
        }
        
        alertsHtml += `
            
                ${alert.title}
                ${alert.details}
                ${dateText}
            
        `;
    });
    
    // 대시보드 HTML 생성
    dashboardContainer.innerHTML = `
        
            
                
                    ${person.name.charAt(0)}
                
                
                    ${person.name}
                    ${person.age}세 | 현재 위치: ${person.location}
                
            
            ${person.status === 'danger' ? `
            
                
                    
                    
                    
                
                긴급 지원 호출
            
            ` : ''}
        
        
        
            
                
                    
                        
                    
                
                심박수
                ${person.heart_rate} BPM
                ${heartRateText}
            
            
            
                
                    
                        
                    
                
                활동 상태
                ${person.activity_status}
                
                    ${person.status === 'normal' ? '정상 활동 중' : 
                     person.status === 'warning' ? '주의 필요' : '즉시 확인 필요'}
                
            
            
            
                
                    
                        
                    
                
                체온
                ${person.temperature} °C
                
                    ${person.temperature > 37.5 ? '체온 높음' : '정상 범위'}
                
            
            
            
                
                    
                        
                    
                
                실내 습도
                ${person.humidity} %
                적정 습도
            
        
        
        
            
                24시간 생체 지표 변화
            
            
                
            
            
                
                    
                    심박수 (BPM)
                
                
                    
                    체온 (°C)
                
            
        
        
        
            
                최근 알림
            
            
                ${alertsHtml || '최근 알림이 없습니다.'}
            
        
    `;
}