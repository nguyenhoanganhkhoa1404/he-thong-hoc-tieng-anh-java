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
            
            questionsList.innerHTML = `
                <div class="progress-container">
                    <div id="testProgress" style="font-size: 1.1rem; font-weight: bold;">
                        🎯 Tiến độ: 0/${questions.length} câu đã chọn
                    </div>
                </div>
            ` + questions.map((q, index) => `
                <div class="question-block">
                    <div class="question-text">Câu ${index + 1}: ${q.questionText}</div>
                    <div class="options-grid">
                        ${q.options.map(opt => `
                            <label class="option-label">
                                <input type="radio" name="${q.id}" value="${opt}" required 
                                       onchange="updateTestProgress(${questions.length})">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Lỗi tải câu hỏi:', err));
});

window.updateTestProgress = function(total) {
    const selectedCount = document.querySelectorAll('#questionsList input[type="radio"]:checked').length;
    const progressText = document.getElementById('testProgress');
    if (progressText) {
        progressText.textContent = `🎯 Tiến độ: ${selectedCount}/${total} câu đã chọn`;
        if (selectedCount === total) {
            progressText.style.color = "#a3bffa";
            progressText.textContent += " - Đã sẵn sàng nộp bài! ✨";
        }
    }
};

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
// 4. CHỨC NĂNG 5: HỌC TỪ VỰNG (Flashcards & Audio)
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
                vocabList.innerHTML = '<div class="text-center w-100" style="padding: 40px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">Hiện chưa có từ vựng cho mục này</div>';
                return;
            }

            vocabList.innerHTML = data.map(item => `
                <div class="flashcard-container" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
                    <div class="flashcard">
                        <div class="flashcard-front">
                            <span class="badge-level">${item.level}</span>
                            <h2>${item.word}</h2>
                            <p class="pronunciation">${item.pronunciation}</p>
                            <button class="btn-speak" title="Phát âm" onclick="event.stopPropagation(); speakWord('${item.word}')">🔊</button>
                            <small style="margin-top: 15px; color: #999;">Bấm để xem nghĩa</small>
                        </div>
                        <div class="flashcard-back">
                            <h3 style="color: var(--primary-color); margin-bottom: 10px;">${item.meaning}</h3>
                            <p style="font-style: italic; margin-bottom: 20px; color: #555;">"${item.example}"</p>
                            <div id="status-${item.id}">
                                ${item.learned ? 
                                    '<span style="color: #2a9d8f; font-weight: bold;">✅ Đã thuộc</span>' : 
                                    `<button class="btn btn-primary btn-sm" style="border-radius: 6px;" onclick="event.stopPropagation(); markAsLearned('${item.id}', this)">Học xong</button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        });
});

window.speakWord = function(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
};

window.markAsLearned = function(id, btnElement) {
    fetch(`${API_BASE}/vocabulary/mark-learned/${id}`, { method: 'POST' })
        .then(res => {
            if (res.ok) {
                const td = document.getElementById(`status-${id}`);
                td.innerHTML = '<span style="color: #2a9d8f; font-weight: bold;">✅ Đã thuộc</span>';
            }
        });
};

// ==========================================
// 5. CHỨC NĂNG 6: HỌC NGỮ PHÁP (Kèm Bài tập Quiz)
// ==========================================
const btnLoadGrammar = document.getElementById('btnLoadGrammar');
const grammarList = document.getElementById('grammarList');

btnLoadGrammar?.addEventListener('click', () => {
    const level = document.getElementById('grammarLevel').value;

    fetch(`${API_BASE}/grammar?level=${level}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grammarList.innerHTML = '<div class="text-center text-muted" style="padding: 40px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">Đang cập nhật nội dung...</div>';
                return;
            }
            grammarList.innerHTML = data.map(item => `
                <div class="grammar-card">
                    <div class="grammar-header">
                        <div class="grammar-icon">?</div>
                        <h3 style="margin: 0;">${item.title}</h3>
                    </div>
                    <div class="grammar-content">
                        <p><strong>💡 Cách dùng:</strong> ${item.description}</p>
                        <p style="margin-bottom: 0;"><strong>📝 Ví dụ:</strong> <span style="color: #475569; font-style: italic;">"${item.example}"</span></p>
                    </div>
                    
                    <button class="btn btn-primary" style="border-radius: 8px; font-weight: 500;" onclick="loadExercises('${level}', this)">
                        ✍️ Làm bài tập thực hành
                    </button>
                    <div class="exercise-area d-none"></div>
                </div>
            `).join('');
        });
});

// Hàm lấy và render bài tập
window.loadExercises = function(level, btn) {
    const area = btn.nextElementSibling;
    if (!area.classList.contains('d-none')) {
        area.classList.add('d-none');
        return;
    }

    fetch(`${API_BASE}/grammar/exercises?level=${level}`)
        .then(res => res.json())
        .then(exercises => {
            area.classList.remove('d-none');
            area.innerHTML = `
                <h4 style="color: var(--text-main); margin-bottom: 15px; font-size: 1.1rem;">Điền vào chỗ trống:</h4>
                ${exercises.map(ex => `
                    <div class="exercise-item">
                        <span style="font-size: 1.05rem; flex-grow: 1;">${ex.question}</span>
                        <input type="text" id="ex-${ex.id}" class="exercise-input" placeholder="Nhập đáp án...">
                        <button class="btn-check-ex" onclick="checkExercise('${ex.id}', '${ex.answer}')">Check</button>
                        <div id="feedback-${ex.id}" style="width: 100%; font-size: 0.95rem; margin-top: 5px;"></div>
                    </div>
                `).join('')}
            `;
        });
};

// Hàm check đáp án bài tập
window.checkExercise = function(id, correct) {
    const input = document.getElementById(`ex-${id}`);
    const feedback = document.getElementById(`feedback-${id}`);
    const userVal = input.value.trim().toLowerCase();
    
    if (userVal === correct.toLowerCase()) {
        feedback.innerHTML = '<span style="color: var(--success-color); font-weight: bold;">✅ Quá chuẩn!</span>';
        input.style.borderColor = "var(--success-color)";
    } else {
        feedback.innerHTML = `<span style="color: var(--danger-color);">❌ Sai rồi. Đáp án đúng là: <strong>${correct}</strong></span>`;
        input.style.borderColor = "var(--danger-color)";
    }
};