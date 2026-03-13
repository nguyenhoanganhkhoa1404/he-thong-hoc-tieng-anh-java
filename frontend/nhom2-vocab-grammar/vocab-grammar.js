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
                <div class="progress-container" style="margin-bottom: 20px; padding: 10px; background: #f0f7ff; border-radius: 8px;">
                    <div id="testProgress" style="font-weight: bold; color: var(--primary);">
                        Tiến độ: 0/${questions.length} câu đã chọn
                    </div>
                </div>
            ` + questions.map((q, index) => `
                <div class="question-block" style="border-left: 4px solid #eee; padding-left: 15px; margin-bottom: 20px;">
                    <p><strong>Câu ${index + 1}:</strong> ${q.questionText}</p>
                    ${q.options.map(opt => `
                        <label class="option-label" style="display: block; margin: 8px 0; cursor: pointer;">
                            <input type="radio" name="${q.id}" value="${opt}" required 
                                   onchange="updateTestProgress(${questions.length})"> ${opt}
                        </label>
                    `).join('')}
                </div>
            `).join('');
        })
        .catch(err => console.error('Lỗi tải câu hỏi:', err));
});

window.updateTestProgress = function(total) {
    const selectedCount = document.querySelectorAll('#questionsList input[type="radio"]:checked').length;
    const progressText = document.getElementById('testProgress');
    if (progressText) {
        progressText.textContent = `Tiến độ: ${selectedCount}/${total} câu đã chọn`;
        if (selectedCount === total) {
            progressText.style.color = "#28a745";
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
                vocabList.innerHTML = '<div class="text-center w-100">Hiện chưa có từ vựng cho mục này</div>';
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
                            <h3 style="color: var(--primary); margin-bottom: 10px;">${item.meaning}</h3>
                            <p style="font-style: italic; margin-bottom: 20px; color: #555;">"${item.example}"</p>
                            <div id="status-${item.id}">
                                ${item.learned ? 
                                    '<span style="color: green; font-weight: bold;">✅ Đã thuộc</span>' : 
                                    `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); markAsLearned('${item.id}', this)">Học xong</button>`
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
                td.innerHTML = '<span style="color: green; font-weight: bold;">✅ Đã thuộc</span>';
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
                grammarList.innerHTML = '<div class="text-center text-muted">Đang cập nhật nội dung...</div>';
                return;
            }
            grammarList.innerHTML = data.map(item => `
                <div class="grammar-card" style="margin-bottom: 20px; padding: 20px; border-radius: 12px; border: 1px solid var(--border); background: white; box-shadow: var(--shadow-sm);">
                    <h3 style="margin-top: 0; color: var(--primary); display: flex; align-items: center;">
                        <span style="background: var(--primary); color: white; border-radius: 50%; width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem; margin-right: 10px;">?</span>
                        ${item.title}
                    </h3>
                    <div style="background: #fdfdfd; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary); margin-bottom: 15px;">
                        <p><strong>💡 Cách dùng:</strong> ${item.usage}</p>
                        <p style="margin-bottom: 0;"><strong>📝 Ví dụ:</strong> <span style="color: #2c3e50; font-style: italic;">"${item.example}"</span></p>
                    </div>
                    
                    <button class="btn btn-outline btn-sm" onclick="loadExercises('${level}', this)">✍️ Làm bài tập thực hành</button>
                    <div class="exercise-area mt-1 d-none"></div>
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
                <div style="background: #fffbe6; padding: 15px; border-radius: 8px; border: 1px dashed #ffe58f; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px; color: #856404;">Điền vào chỗ trống:</h4>
                    ${exercises.map(ex => `
                        <div class="mb-1" style="border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <p>${ex.question}</p>
                            <input type="text" id="ex-${ex.id}" class="form-control" style="width: 180px; display: inline-block; margin-right: 10px;" placeholder="Đáp án...">
                            <button class="btn btn-primary btn-sm" onclick="checkExercise('${ex.id}', '${ex.correctAnswer}')">Check</button>
                            <div id="feedback-${ex.id}" class="mt-0-5" style="font-size: 0.9rem;"></div>
                        </div>
                    `).join('')}
                </div>
            `;
        });
};

// Hàm check đáp án bài tập
window.checkExercise = function(id, correct) {
    const input = document.getElementById(`ex-${id}`);
    const feedback = document.getElementById(`feedback-${id}`);
    const userVal = input.value.trim().toLowerCase();
    
    if (userVal === correct.toLowerCase()) {
        feedback.innerHTML = '<span style="color: #28a745; font-weight: bold;">✅ Quá chuẩn!</span>';
        input.style.borderColor = "#28a745";
    } else {
        feedback.innerHTML = `<span style="color: #dc3545;">❌ Sai rồi. Đáp án đúng là: <strong>${correct}</strong></span>`;
        input.style.borderColor = "#dc3545";
    }
};