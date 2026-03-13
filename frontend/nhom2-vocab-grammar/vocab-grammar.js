// Trỏ tới API Backend của Nhóm 2
const API_BASE = 'http://localhost:8080/api/vocab-grammar';

// Chuyển đổi giữa các tab (Placement, Vocab, Grammar)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    // Code xử lý hiển thị nội dung tab tương ứng sẽ viết sau
  });
});

// Các phần tử giao diện
const btnStartTest = document.getElementById('btnStartTest');
const formPlacementTest = document.getElementById('formPlacementTest');
const questionsList = document.getElementById('questionsList');
const resultContainer = document.getElementById('resultContainer');
const testContainer = document.getElementById('testContainer');
const placementAlert = document.getElementById('placementAlert');

function showAlert(msg, type = 'info') {
  placementAlert.textContent = msg;
  placementAlert.className = `alert alert-${type}`;
  placementAlert.classList.remove('d-none');
}

// BƯỚC 1: Lấy danh sách câu hỏi từ API khi bấm "Bắt đầu"
btnStartTest.addEventListener('click', () => {
  fetch(`${API_BASE}/placement-test`)
    .then(res => res.json())
    .then(questions => {
      // Ẩn màn hình chờ, hiện form làm bài
      testContainer.classList.add('d-none');
      formPlacementTest.classList.remove('d-none');
      resultContainer.classList.add('d-none');
      placementAlert.classList.add('d-none');

      // Đổ dữ liệu câu hỏi ra HTML
      questionsList.innerHTML = questions.map((q, index) => {
        // Tạo các nút radio (trắc nghiệm) cho từng đáp án
        const optionsHtml = q.options.map(opt => `
          <label class="option-label">
            <input type="radio" name="${q.id}" value="${opt}" required> ${opt}
          </label>
        `).join('');
        
        return `
          <div class="question-block">
            <p style="margin: 0; font-weight: 500;"><strong>Câu ${index + 1}:</strong> ${q.questionText}</p>
            ${optionsHtml}
          </div>
        `;
      }).join('');
    })
    .catch(err => showAlert('Lỗi kết nối đến Backend: ' + err.message, 'danger'));
});

// BƯỚC 2: Nộp bài và nhận kết quả
formPlacementTest.addEventListener('submit', (e) => {
  e.preventDefault(); // Ngăn trình duyệt reload lại trang
  
  // Gom tất cả đáp án user đã chọn thành object { q1: "am", q2: "does", ... }
  const formData = new FormData(formPlacementTest);
  const answers = {};
  for (let [key, value] of formData.entries()) {
    answers[key] = value;
  }

  // Gói dữ liệu gửi lên API
  const payload = {
    userId: "mock-user-123", // Tạm thời code cứng, sau này nhóm 1 làm xong Auth sẽ ghép vào
    answers: answers
  };

  // Gọi API chấm điểm
  fetch(`${API_BASE}/placement-test/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(result => {
    // Ẩn form, hiện kết quả
    formPlacementTest.classList.add('d-none');
    resultContainer.classList.remove('d-none');
    
    // In điểm và level ra màn hình
    document.getElementById('resScore').textContent = result.score;
    document.getElementById('resTotal').textContent = result.totalQuestions;
    document.getElementById('resLevel').textContent = result.assignedLevel;
  })
  .catch(err => showAlert('Lỗi nộp bài: ' + err.message, 'danger'));
});

// Nút làm lại bài
document.getElementById('btnRetake').addEventListener('click', () => {
  resultContainer.classList.add('d-none');
  testContainer.classList.remove('d-none');
});