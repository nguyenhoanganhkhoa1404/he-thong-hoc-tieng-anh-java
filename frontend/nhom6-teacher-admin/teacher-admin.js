/**
 * Teacher / Admin Panel – Nhóm 6
 * Chức năng 16: Teacher/Admin Management | 17: Course Management | 18: Notification System
 */
(function () {
  const API_BASE = window.API_BASE || 'http://localhost:8080/api/admin';

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabId = this.getAttribute('data-tab');
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.section-content').forEach(function (s) { s.classList.remove('active'); });
      this.classList.add('active');
      var section = document.getElementById('section-' + tabId);
      if (section) section.classList.add('active');
      if (tabId === 'teachers') loadTeachers();
      if (tabId === 'courses') loadCourses();
    });
  });

  // -------- Teacher / Admin (16) --------
  var teacherListEl = document.getElementById('teacherList');
  var teacherEmptyEl = document.getElementById('teacherEmpty');
  var teacherAlertEl = document.getElementById('teacherAlert');
  var modalTeacher = document.getElementById('modalTeacher');
  var formTeacher = document.getElementById('formTeacher');

  function showTeacherAlert(msg, type) {
    teacherAlertEl.textContent = msg;
    teacherAlertEl.className = 'alert alert-' + (type || 'info');
    teacherAlertEl.classList.remove('d-none');
  }

  function loadTeachers() {
    fetch(API_BASE + '/teachers')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        teacherAlertEl.classList.add('d-none');
        if (!data || data.length === 0) {
          teacherListEl.innerHTML = '';
          teacherEmptyEl.classList.remove('d-none');
          return;
        }
        teacherEmptyEl.classList.add('d-none');
        teacherListEl.innerHTML = data.map(function (t) {
          var status = t.active ? '<span class="badge badge-success">Kích hoạt</span>' : '<span class="badge badge-warning">Chờ duyệt</span>';
          var actions = [
            '<button type="button" class="btn btn-outline btn-sm edit-teacher" data-uid="' + (t.uid || '') + '">Sửa</button>',
            !t.active ? '<button type="button" class="btn btn-success btn-sm approve-teacher" data-uid="' + (t.uid || '') + '">Duyệt</button>' : '',
            '<button type="button" class="btn btn-danger btn-sm delete-teacher" data-uid="' + (t.uid || '') + '">Xoá</button>'
          ].filter(Boolean).join(' ');
          return '<tr><td>' + (t.email || '') + '</td><td>' + (t.displayName || '') + '</td><td>' + (t.role || '') + '</td><td>' + (t.teacherId || '') + '</td><td>' + (t.specialization || '') + '</td><td>' + status + '</td><td>' + actions + '</td></tr>';
        }).join('');
        teacherListEl.querySelectorAll('.edit-teacher').forEach(function (btn) {
          btn.addEventListener('click', function () { openTeacherModal(this.getAttribute('data-uid')); });
        });
        teacherListEl.querySelectorAll('.approve-teacher').forEach(function (btn) {
          btn.addEventListener('click', function () { approveTeacher(this.getAttribute('data-uid')); });
        });
        teacherListEl.querySelectorAll('.delete-teacher').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (confirm('Bạn có chắc muốn xoá tài khoản này?')) deleteTeacher(this.getAttribute('data-uid'));
          });
        });
      })
      .catch(function (err) {
        showTeacherAlert('Lỗi tải danh sách: ' + (err.message || err), 'danger');
        teacherListEl.innerHTML = '';
        teacherEmptyEl.classList.remove('d-none');
      });
  }

  function openTeacherModal(uid) {
    document.getElementById('modalTeacherTitle').textContent = uid ? 'Sửa tài khoản' : 'Thêm tài khoản giáo viên / Admin';
    document.getElementById('teacherUid').value = uid || '';
    if (uid) {
      fetch(API_BASE + '/teachers/' + uid)
        .then(function (res) { return res.json(); })
        .then(function (t) {
          document.getElementById('teacherEmail').value = t.email || '';
          document.getElementById('teacherDisplayName').value = t.displayName || '';
          document.getElementById('teacherRole').value = t.role || 'TEACHER';
          document.getElementById('teacherTeacherId').value = t.teacherId || '';
          document.getElementById('teacherSpecialization').value = t.specialization || '';
          document.getElementById('teacherActive').checked = t.active !== false;
        })
        .catch(function () {
          formTeacher.reset();
          document.getElementById('teacherUid').value = uid;
        });
    } else {
      formTeacher.reset();
      document.getElementById('teacherActive').checked = true;
    }
    modalTeacher.classList.remove('d-none');
  }

  function approveTeacher(uid) {
    fetch(API_BASE + '/teachers/' + uid + '/approve', { method: 'POST' })
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        showTeacherAlert('Đã duyệt tài khoản.', 'success');
        loadTeachers();
      })
      .catch(function (err) { showTeacherAlert('Lỗi duyệt: ' + (err.message || err), 'danger'); });
  }

  function deleteTeacher(uid) {
    fetch(API_BASE + '/teachers/' + uid, { method: 'DELETE' })
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        showTeacherAlert('Đã xoá tài khoản.', 'success');
        loadTeachers();
      })
      .catch(function (err) { showTeacherAlert('Lỗi xoá: ' + (err.message || err), 'danger'); });
  }

  document.getElementById('btnAddTeacher').addEventListener('click', function () { openTeacherModal(null); });
  document.getElementById('btnCloseTeacherModal').addEventListener('click', function () { modalTeacher.classList.add('d-none'); });
  document.getElementById('btnCancelTeacher').addEventListener('click', function () { modalTeacher.classList.add('d-none'); });

  formTeacher.addEventListener('submit', function (e) {
    e.preventDefault();
    var uid = document.getElementById('teacherUid').value;
    var payload = {
      email: document.getElementById('teacherEmail').value.trim(),
      displayName: document.getElementById('teacherDisplayName').value.trim(),
      role: document.getElementById('teacherRole').value,
      teacherId: document.getElementById('teacherTeacherId').value.trim(),
      specialization: document.getElementById('teacherSpecialization').value.trim(),
      active: document.getElementById('teacherActive').checked
    };
    var url = uid ? API_BASE + '/teachers/' + uid : API_BASE + '/teachers';
    var method = uid ? 'PUT' : 'POST';
    fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (res) { return res.json(); })
      .then(function () {
        modalTeacher.classList.add('d-none');
        showTeacherAlert(uid ? 'Đã cập nhật.' : 'Đã thêm tài khoản.', 'success');
        loadTeachers();
      })
      .catch(function (err) { showTeacherAlert('Lỗi: ' + (err.message || err), 'danger'); });
  });

  // -------- Course (17) --------
  var courseListEl = document.getElementById('courseList');
  var courseEmptyEl = document.getElementById('courseEmpty');
  var courseAlertEl = document.getElementById('courseAlert');
  var modalCourse = document.getElementById('modalCourse');
  var formCourse = document.getElementById('formCourse');

  function showCourseAlert(msg, type) {
    courseAlertEl.textContent = msg;
    courseAlertEl.className = 'alert alert-' + (type || 'info');
    courseAlertEl.classList.remove('d-none');
  }

  function loadCourses() {
    fetch(API_BASE + '/courses')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        courseAlertEl.classList.add('d-none');
        if (!data || data.length === 0) {
          courseListEl.innerHTML = '';
          courseEmptyEl.classList.remove('d-none');
          return;
        }
        courseEmptyEl.classList.add('d-none');
        courseListEl.innerHTML = data.map(function (c) {
          var pub = c.published ? '<span class="badge badge-success">Có</span>' : '<span class="badge badge-warning">Chưa</span>';
          var desc = (c.description || '');
          if (desc.length > 50) desc = desc.substring(0, 50) + '...';
          return '<tr><td>' + (c.title || '') + '</td><td>' + desc + '</td><td>' + (c.level || '') + '</td><td>' + pub + '</td><td><button type="button" class="btn btn-outline btn-sm edit-course" data-id="' + (c.id || '') + '">Sửa</button> <button type="button" class="btn btn-danger btn-sm delete-course" data-id="' + (c.id || '') + '">Xoá</button></td></tr>';
        }).join('');
        courseListEl.querySelectorAll('.edit-course').forEach(function (btn) {
          btn.addEventListener('click', function () { openCourseModal(this.getAttribute('data-id')); });
        });
        courseListEl.querySelectorAll('.delete-course').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (confirm('Bạn có chắc muốn xoá khoá học này?')) deleteCourse(this.getAttribute('data-id'));
          });
        });
      })
      .catch(function (err) {
        showCourseAlert('Lỗi tải danh sách: ' + (err.message || err), 'danger');
        courseListEl.innerHTML = '';
        courseEmptyEl.classList.remove('d-none');
      });
  }

  function openCourseModal(id) {
    document.getElementById('modalCourseTitle').textContent = id ? 'Sửa khoá học' : 'Thêm khoá học';
    document.getElementById('courseId').value = id || '';
    if (id) {
      fetch(API_BASE + '/courses/' + id)
        .then(function (res) { return res.json(); })
        .then(function (c) {
          document.getElementById('courseTitle').value = c.title || '';
          document.getElementById('courseDescription').value = c.description || '';
          document.getElementById('courseLevel').value = c.level || 'A1';
          document.getElementById('coursePublished').checked = c.published === true;
          document.getElementById('courseModuleIds').value = (c.moduleIds && c.moduleIds.length) ? c.moduleIds.join('\n') : '';
        })
        .catch(function () {
          formCourse.reset();
          document.getElementById('courseId').value = id;
        });
    } else {
      formCourse.reset();
      document.getElementById('courseId').value = '';
    }
    modalCourse.classList.remove('d-none');
  }

  function deleteCourse(id) {
    fetch(API_BASE + '/courses/' + id, { method: 'DELETE' })
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        showCourseAlert('Đã xoá khoá học.', 'success');
        loadCourses();
      })
      .catch(function (err) { showCourseAlert('Lỗi xoá: ' + (err.message || err), 'danger'); });
  }

  document.getElementById('btnAddCourse').addEventListener('click', function () { openCourseModal(null); });
  document.getElementById('btnCloseCourseModal').addEventListener('click', function () { modalCourse.classList.add('d-none'); });
  document.getElementById('btnCancelCourse').addEventListener('click', function () { modalCourse.classList.add('d-none'); });

  formCourse.addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('courseId').value;
    var moduleIdsText = document.getElementById('courseModuleIds').value.trim();
    var moduleIds = moduleIdsText ? moduleIdsText.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean) : [];
    var payload = {
      title: document.getElementById('courseTitle').value.trim(),
      description: document.getElementById('courseDescription').value.trim(),
      level: document.getElementById('courseLevel').value,
      published: document.getElementById('coursePublished').checked,
      moduleIds: moduleIds
    };
    var url = id ? API_BASE + '/courses/' + id : API_BASE + '/courses';
    var method = id ? 'PUT' : 'POST';
    fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (res) { return res.json(); })
      .then(function () {
        modalCourse.classList.add('d-none');
        showCourseAlert(id ? 'Đã cập nhật.' : 'Đã thêm khoá học.', 'success');
        loadCourses();
      })
      .catch(function (err) { showCourseAlert('Lỗi: ' + (err.message || err), 'danger'); });
  });

  // -------- Notification (18) --------
  var notificationListEl = document.getElementById('notificationList');
  var notificationEmptyEl = document.getElementById('notificationEmpty');
  var notificationAlertEl = document.getElementById('notificationAlert');
  var formNotification = document.getElementById('formNotification');

  function showNotificationAlert(msg, type) {
    notificationAlertEl.textContent = msg;
    notificationAlertEl.className = 'alert alert-' + (type || 'info');
    notificationAlertEl.classList.remove('d-none');
  }

  document.getElementById('btnCreateNotification').addEventListener('click', function () {
    formNotification.classList.toggle('d-none');
  });
  document.getElementById('btnCancelNotification').addEventListener('click', function () {
    formNotification.classList.add('d-none');
  });

  formNotification.addEventListener('submit', function (e) {
    e.preventDefault();
    var targetId = document.getElementById('notifTargetId').value.trim();
    var payload = {
      title: document.getElementById('notifTitle').value.trim(),
      content: document.getElementById('notifContent').value.trim(),
      targetType: document.getElementById('notifTargetType').value,
      targetId: targetId || null
    };
    fetch(API_BASE + '/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        formNotification.classList.add('d-none');
        formNotification.reset();
        showNotificationAlert('Đã gửi thông báo.', 'success');
        var uid = document.getElementById('notifUserId').value.trim();
        if (uid) loadUserNotifications(uid);
      })
      .catch(function (err) { showNotificationAlert('Lỗi: ' + (err.message || err), 'danger'); });
  });

  function loadUserNotifications(userId) {
    if (!userId) {
      notificationListEl.innerHTML = '';
      notificationEmptyEl.classList.remove('d-none');
      return;
    }
    fetch(API_BASE + '/notifications/user/' + encodeURIComponent(userId))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        notificationAlertEl.classList.add('d-none');
        if (!data || data.length === 0) {
          notificationListEl.innerHTML = '';
          notificationEmptyEl.classList.remove('d-none');
          return;
        }
        notificationEmptyEl.classList.add('d-none');
        notificationListEl.innerHTML = data.map(function (n) {
          var read = n.read ? '<span class="badge badge-success">Đã đọc</span>' : '<span class="badge badge-warning">Chưa đọc</span>';
          var created = n.createdAt ? new Date(n.createdAt).toLocaleString('vi-VN') : '';
          var content = (n.content || '');
          if (content.length > 60) content = content.substring(0, 60) + '...';
          var markRead = n.read ? '' : '<button type="button" class="btn btn-outline btn-sm mark-read" data-id="' + (n.id || '') + '">Đánh dấu đọc</button>';
          return '<tr><td>' + (n.title || '') + '</td><td>' + content + '</td><td>' + (n.targetType || '') + '</td><td>' + created + '</td><td>' + read + '</td><td>' + markRead + '</td></tr>';
        }).join('');
        notificationListEl.querySelectorAll('.mark-read').forEach(function (btn) {
          btn.addEventListener('click', function () {
            fetch(API_BASE + '/notifications/' + this.getAttribute('data-id') + '/read', { method: 'POST' })
              .then(function () { loadUserNotifications(userId); });
          });
        });
      })
      .catch(function (err) {
        showNotificationAlert('Lỗi tải thông báo: ' + (err.message || err), 'danger');
        notificationListEl.innerHTML = '';
        notificationEmptyEl.classList.remove('d-none');
      });
  }

  document.getElementById('btnLoadUserNotifications').addEventListener('click', function () {
    loadUserNotifications(document.getElementById('notifUserId').value.trim());
  });

  loadTeachers();
})();
