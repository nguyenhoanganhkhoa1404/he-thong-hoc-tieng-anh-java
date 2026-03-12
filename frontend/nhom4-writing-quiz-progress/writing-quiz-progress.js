/**
 * Nhóm 4 – Writing, Quiz & Progress
 * Chức năng 10: Writing | 11: Quiz | 12: Progress
 */
(function () {
  var API_BASE = window.API_BASE || 'http://localhost:8080/api/writing-quiz-progress';

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabId = this.getAttribute('data-tab');
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.section-content').forEach(function (s) { s.classList.remove('active'); });
      this.classList.add('active');
      var section = document.getElementById('section-' + tabId);
      if (section) section.classList.add('active');
      if (tabId === 'progress') document.getElementById('btnLoadProgress').click();
    });
  });

  // -------- Writing (10) --------
  var writingAlertEl = document.getElementById('writingAlert');
  var writingFeedbackEl = document.getElementById('writingFeedback');
  var writingListEl = document.getElementById('writingList');
  var writingEmptyEl = document.getElementById('writingEmpty');

  document.getElementById('btnSubmitWriting').addEventListener('click', function () {
    var lessonId = document.getElementById('writingLessonId').value.trim() || 'lesson-1';
    var prompt = document.getElementById('writingPrompt').value.trim();
    var content = document.getElementById('writingContent').value.trim();
    if (!content) {
      writingAlertEl.textContent = 'Vui lòng nhập bài viết.';
      writingAlertEl.className = 'alert alert-danger mt-2';
      writingAlertEl.classList.remove('d-none');
      return;
    }
    var payload = { userId: 'user-demo', lessonId: lessonId, prompt: prompt, content: content };
    fetch(API_BASE + '/writing/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        writingAlertEl.classList.add('d-none');
        writingFeedbackEl.classList.remove('d-none');
        writingFeedbackEl.className = 'writing-feedback mt-2';
        writingFeedbackEl.innerHTML = '<strong>Gợi ý:</strong><br>' + (data.feedback || '') + (data.score != null ? '<br><strong>Điểm:</strong> ' + data.score + '/10' : '');
        loadWritings(data.userId || 'user-demo');
      })
      .catch(function (err) {
        writingAlertEl.textContent = 'Lỗi: ' + (err.message || err);
        writingAlertEl.className = 'alert alert-danger mt-2';
        writingAlertEl.classList.remove('d-none');
      });
  });

  function loadWritings(userId) {
    if (!userId) { writingListEl.innerHTML = ''; writingEmptyEl.classList.remove('d-none'); return; }
    fetch(API_BASE + '/writing/user/' + encodeURIComponent(userId))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || data.length === 0) {
          writingListEl.innerHTML = '';
          writingEmptyEl.classList.remove('d-none');
          return;
        }
        writingEmptyEl.classList.add('d-none');
        writingListEl.innerHTML = data.map(function (w) {
          var created = w.createdAt ? new Date(w.createdAt).toLocaleString('vi-VN') : '';
          return '<div class="card" style="margin-bottom:0.75rem"><strong>' + (w.prompt || '') + '</strong><br><small>' + (w.content || '').substring(0, 100) + '...</small><br>Nhận xét: ' + (w.feedback || '').substring(0, 60) + '... | Điểm: ' + (w.score != null ? w.score : '-') + ' | ' + created + '</div>';
        }).join('');
      })
      .catch(function (err) {
        writingListEl.innerHTML = '';
        writingEmptyEl.classList.remove('d-none');
        writingEmptyEl.textContent = 'Lỗi: ' + (err.message || err);
      });
  }

  document.getElementById('btnLoadWritings').addEventListener('click', function () {
    loadWritings(document.getElementById('writingUserId').value.trim());
  });

  // -------- Quiz (11) --------
  var quizQuestions = [];
  var quizStartTime = 0;
  var quizTimerInterval = null;

  function renderQuestion(q, index) {
    var div = document.createElement('div');
    div.className = 'quiz-question';
    div.setAttribute('data-question-id', q.id);
    var label = document.createElement('label');
    label.textContent = (index + 1) + '. ' + (q.questionText || '');
    div.appendChild(label);
    if (q.type === 'MULTIPLE_CHOICE' && q.options && q.options.length) {
      var ul = document.createElement('ul');
      ul.className = 'quiz-options';
      q.options.forEach(function (opt) {
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q-' + q.id;
        input.value = opt;
        var lab = document.createElement('label');
        lab.textContent = ' ' + opt;
        lab.style.fontWeight = 'normal';
        li.appendChild(input);
        li.appendChild(lab);
        ul.appendChild(li);
      });
      div.appendChild(ul);
    } else {
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'form-control';
      inp.name = 'q-' + q.id;
      inp.placeholder = 'Nhập đáp án';
      div.appendChild(inp);
    }
    return div;
  }

  function collectQuizAnswers() {
    var answers = {};
    quizQuestions.forEach(function (q) {
      var name = 'q-' + q.id;
      var input = document.querySelector('[name="' + name + '"]:checked') || document.querySelector('input[name="' + name + '"]');
      if (input && input.value) answers[q.id] = input.value.trim();
    });
    return answers;
  }

  document.getElementById('btnLoadQuiz').addEventListener('click', function () {
    var lessonId = document.getElementById('quizLessonId').value.trim() || 'lesson-1';
    fetch(API_BASE + '/quiz/lesson/' + encodeURIComponent(lessonId) + '/questions')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        quizQuestions = data || [];
        var form = document.getElementById('formQuiz');
        form.innerHTML = '';
        quizQuestions.forEach(function (q, i) { form.appendChild(renderQuestion(q, i)); });
        document.getElementById('quizArea').classList.remove('d-none');
        document.getElementById('quizResult').classList.add('d-none');
        quizStartTime = Date.now();
        if (quizTimerInterval) clearInterval(quizTimerInterval);
        quizTimerInterval = setInterval(function () {
          var el = document.getElementById('quizTimer');
          if (el) el.textContent = Math.floor((Date.now() - quizStartTime) / 1000);
        }, 1000);
      })
      .catch(function (err) { alert('Lỗi tải câu hỏi: ' + (err.message || err)); });
  });

  document.getElementById('btnSubmitQuiz').addEventListener('click', function () {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    var timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    var userId = document.getElementById('quizUserId').value.trim() || 'user-demo';
    var lessonId = document.getElementById('quizLessonId').value.trim() || 'lesson-1';
    fetch(API_BASE + '/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, lessonId: lessonId, answers: collectQuizAnswers(), timeSpentSeconds: timeSpent })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var resultEl = document.getElementById('quizResult');
        resultEl.classList.remove('d-none');
        resultEl.className = 'alert ' + (data.passed ? 'alert-success' : 'alert-danger') + ' mt-2';
        resultEl.innerHTML = 'Điểm: <strong>' + data.score + '/' + data.totalQuestions + '</strong> | Thời gian: ' + data.timeSpentSeconds + 's | ' + (data.passed ? 'Đạt' : 'Chưa đạt');
      })
      .catch(function (err) {
        document.getElementById('quizResult').classList.remove('d-none');
        document.getElementById('quizResult').className = 'alert alert-danger mt-2';
        document.getElementById('quizResult').textContent = 'Lỗi: ' + (err.message || err);
      });
  });

  // -------- Progress (12) --------
  document.getElementById('btnLoadProgress').addEventListener('click', function () {
    var userId = document.getElementById('progressUserId').value.trim() || 'user-demo';
    fetch(API_BASE + '/progress/user/' + encodeURIComponent(userId))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        document.getElementById('progressEmpty').classList.add('d-none');
        document.getElementById('progressOverview').classList.remove('d-none');
        document.getElementById('progressTotal').textContent = data.totalLessonsCompleted || 0;
        document.getElementById('progressAvg').textContent = (data.averageScore != null ? data.averageScore : 0).toFixed(1);
        document.getElementById('progressLevel').textContent = data.currentLevel || '-';
        var bySkill = data.bySkill || {};
        var skills = ['listening', 'speaking', 'reading', 'writing'];
        var html = '';
        skills.forEach(function (sk) {
          var s = bySkill[sk] || { completedLessons: 0, averageScore: 0 };
          var pct = Math.min(100, (s.averageScore || 0) * 10);
          html += '<div class="skill-row"><span>' + sk + '</span><div class="skill-bar-wrap"><div class="skill-bar" style="width:' + pct + '%"></div></div><span>' + (s.completedLessons || 0) + ' bài, ' + (s.averageScore != null ? s.averageScore.toFixed(1) : 0) + '/10</span></div>';
        });
        document.getElementById('progressBySkill').innerHTML = html;
      })
      .catch(function (err) {
        document.getElementById('progressOverview').classList.add('d-none');
        document.getElementById('progressEmpty').classList.remove('d-none');
        document.getElementById('progressEmpty').textContent = 'Lỗi: ' + (err.message || err);
      });
  });
})();
