// 1. Cấu hình API Backend
const API_BASE = 'http://localhost:8080/api/vocab-grammar';

// ==========================================
// 2. LOGIC CHUYỂN ĐỔI TAB
// ==========================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        const targetSection = document.getElementById('section-' + tabId);
        if (targetSection) targetSection.classList.add('active');
    });
});

// ==========================================
// 3. CHỨC NĂNG 4: PLACEMENT TEST
// ==========================================
const btnStartTest = document.getElementById('btnStartTest');
const formPlacementTest = document.getElementById('formPlacementTest');
const questionsList = document.getElementById('questionsList');
const resultContainer = document.getElementById('resultContainer');
const testContainer = document.getElementById('testContainer');

btnStartTest?.addEventListener('click', () => {
    fetch(`${API_BASE}/placement-test`)
        .then(res => res.json())
        .then(questions => {
            testContainer.classList.add('d-none');
            formPlacementTest.classList.remove('d-none');
            resultContainer.classList.add('d-none');
            
            questionsList.innerHTML = questions.map((q, index) => `
                <div class="question-block">
                    <p><strong>Câu ${index + 1}:</strong> ${q.questionText}</p>
                    ${q.options.map(opt => `
                        <label class="option-label">
                            <input type="radio" name="${q.id}" value="${opt}" required> ${opt}
                        </label>
                    `).join('')}
                </div>
            `).join('');
        })
        .catch(err => console.error('Lỗi tải câu hỏi:', err));
});

formPlacementTest?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formPlacementTest);
    const answers = {};
    formData.forEach((value, key) => answers[key] = value);

    fetch(`${API_BASE}/placement-test/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "user-123", answers: answers })
    })
    .then(res => res.json())
    .then(result => {
        formPlacementTest.classList.add('d-none');
        resultContainer.classList.remove('d-none');
        document.getElementById('resScore').textContent = result.score;
        document.getElementById('resTotal').textContent = result.totalQuestions;
        document.getElementById('resLevel').textContent = result.assignedLevel;
    });
});

document.getElementById('btnRetake')?.addEventListener('click', () => {
    resultContainer.classList.add('d-none');
    testContainer.classList.remove('d-none');
});

// ==========================================
// 4. CHỨC NĂNG 5: HỌC TỪ VỰNG (Có nút Học xong)
// ==========================================
const btnLoadVocab = document.getElementById('btnLoadVocab');
const vocabList = document.getElementById('vocabList');

btnLoadVocab?.addEventListener('click', () => {
    const topic = document.getElementById('vocabTopic').value;
    const level = document.getElementById('vocabLevel').value;

    fetch(`${API_BASE}/vocabulary?topic=${topic}&level=${level}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                vocabList.innerHTML = '<tr><td colspan="5" class="text-center">Trống</td></tr>';
                return;
            }
            vocabList.innerHTML = data.map(item => {
                const statusIcon = item.learned ? '✅' : '❌';
                const actionBtn = item.learned 
                    ? '' 
                    : `<button class="btn btn-outline btn-sm" onclick="markAsLearned('${item.id}', this)" style="padding: 2px 8px; font-size: 0.8rem; margin-left: 10px;">Học xong</button>`;
                
                return `
                    <tr>
                        <td><strong>${item.word}</strong></td>
                        <td>${item.pronunciation}</td>
                        <td>${item.meaning}</td>
                        <td><em>${item.example}</em></td>
                        <td id="status-${item.id}">
                            ${statusIcon} ${actionBtn}
                        </td>
                    </tr>
                `;
            }).join('');
        });
});

// Hàm toàn cục để gọi từ thuộc tính onclick
window.markAsLearned = function(id, btnElement) {
    fetch(`${API_BASE}/vocabulary/mark-learned/${id}`, { method: 'POST' })
        .then(res => {
            if (res.ok) {
                const td = document.getElementById(`status-${id}`);
                td.innerHTML = '✅'; 
                console.log(`Đã học xong từ: ${id}`);
            }
        })
        .catch(err => alert('Lỗi: ' + err.message));
};

// ==========================================
// 5. CHỨC NĂNG 6: HỌC NGỮ PHÁP
// ==========================================
const btnLoadGrammar = document.getElementById('btnLoadGrammar');
const grammarList = document.getElementById('grammarList');

btnLoadGrammar?.addEventListener('click', () => {
    const level = document.getElementById('grammarLevel').value;

    fetch(`${API_BASE}/grammar?level=${level}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grammarList.innerHTML = '<div class="text-center">Trống</div>';
                return;
            }
            grammarList.innerHTML = data.map(item => `
                <div class="grammar-lesson" style="margin-bottom:1rem; padding:1rem; border-left:4px solid var(--primary); background:#f9f9f9;">
                    <h3>${item.title}</h3>
                    <p><strong>Cách dùng:</strong> ${item.usage}</p>
                    <p><strong>Ví dụ:</strong> <em>${item.example}</em></p>
                </div>
            `).join('');
        });
});