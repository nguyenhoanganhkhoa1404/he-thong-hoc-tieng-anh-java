(function() {
  var API_BASE = window.API_BASE || 'http://localhost:8080/api';

  // tab switching
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var id = this.getAttribute('data-tab');
      document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
      document.querySelectorAll('.section-content').forEach(function(s){s.classList.remove('active');});
      this.classList.add('active');
      var sec = document.getElementById('section-' + id);
      if (sec) sec.classList.add('active');
      if (id === 'achievements') document.getElementById('btnLoadAchievements').click();
      if (id === 'forum') document.getElementById('btnLoadPosts').click();
    });
  });

  // -------- Achievements --------
  document.getElementById('btnLoadAchievements').addEventListener('click', function() {
    var uid = document.getElementById('achUserId').value.trim() || 'user-demo';
    fetch(API_BASE + '/achievements?userId=' + encodeURIComponent(uid))
      .then(res=>res.json())
      .then(data => renderBadges(data, 'badgesUnlocked'))
      .catch(err=>console.error(err));
    fetch(API_BASE + '/achievements/available?userId=' + encodeURIComponent(uid))
      .then(res=>res.json())
      .then(data => renderBadges(data, 'badgesLocked', true))
      .catch(err=>console.error(err));
  });

  function renderBadges(list, containerId, locked) {
    var cont = document.getElementById(containerId);
    cont.innerHTML = '';
    if (!list || list.length===0) { cont.innerHTML = '<p class="text-muted">(không có)</p>'; return; }
    list.forEach(function(b) {
      var div = document.createElement('div');
      div.className = 'badge' + (locked ? ' locked' : '');
      div.innerHTML = '<strong>' + (b.name||'') + '</strong><br><small>' + (b.description||'') + '</small>';
      cont.appendChild(div);
    });
  }

  // -------- Daily plan --------
  function buildTaskRow(task) {
    var div = document.createElement('div');
    div.className = 'task-item';
    var chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = task.completed;
    chk.dataset.taskId = task.id;
    var txt = document.createElement('input');
    txt.type = 'text';
    txt.className = 'form-control';
    txt.value = task.text;
    txt.dataset.taskId = task.id;
    div.appendChild(chk);
    div.appendChild(txt);
    chk.addEventListener('change', function() {
      var planId = document.getElementById('planTasks').dataset.planId;
      var userId = document.getElementById('planUserId').value.trim() || 'user-demo';
      fetch(API_BASE + '/daily-plan/' + encodeURIComponent(planId) + '/task/' + encodeURIComponent(this.dataset.taskId)
            + '?completed=' + this.checked + '&userId=' + encodeURIComponent(userId), { method:'PUT' })
        .then(res=>res.json())
        .then(function(){})
        .catch(console.error);
    });
    return div;
  }

  document.getElementById('btnLoadPlan').addEventListener('click', function() {
    var userId = document.getElementById('planUserId').value.trim() || 'user-demo';
    var date = document.getElementById('planDate').value;
    if (!date) { alert('Chọn ngày'); return; }
    fetch(API_BASE + '/daily-plan?userId=' + encodeURIComponent(userId) + '&date=' + encodeURIComponent(date))
      .then(function(res) {
        if (res.status===404) throw new Error('No plan');
        return res.json();
      })
      .then(function(plan) {
        var container = document.getElementById('planTasks');
        container.dataset.planId = plan.id;
        container.innerHTML = '';
        plan.tasks.forEach(function(t){ container.appendChild(buildTaskRow(t)); });
        document.getElementById('planEmpty').classList.add('d-none');
      })
      .catch(function(err){
        document.getElementById('planTasks').innerHTML = '';
        document.getElementById('planEmpty').classList.remove('d-none');
      });
  });

  document.getElementById('btnSavePlan').addEventListener('click', function() {
    var userId = document.getElementById('planUserId').value.trim() || 'user-demo';
    var date = document.getElementById('planDate').value;
    if (!date) { alert('Chọn ngày'); return; }
    var container = document.getElementById('planTasks');
    var tasks = [];
    container.querySelectorAll('.task-item').forEach(function(row){
      tasks.push({ id: row.querySelector('input[type=text]').dataset.taskId || null,
                   text: row.querySelector('input[type=text]').value,
                   completed: row.querySelector('input[type=checkbox]').checked });
    });
    var payload = { userId:userId, date:date, tasks: tasks };
    fetch(API_BASE + '/daily-plan', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    })
    .then(res=>res.json())
    .then(function(plan){
      document.getElementById('planTasks').dataset.planId = plan.id;
      document.getElementById('planEmpty').classList.add('d-none');
    });
  });

  // -------- Forum --------
  function renderPost(post) {
    var div = document.createElement('div');
    div.className = 'post';
    var created = post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : '';
    div.innerHTML = '<strong>' + (post.title||'') + '</strong> by ' + (post.authorId||'') + ' <small>' + created + '</small><br>'
      + '<p>' + (post.content||'') + '</p>';
    var commentArea = document.createElement('div');
    post.comments && post.comments.forEach(function(c){
      var cdiv = document.createElement('div');
      cdiv.className = 'comment';
      cdiv.innerHTML = '<strong>' + (c.authorId||'') + '</strong>: ' + (c.content||'');
      commentArea.appendChild(cdiv);
    });
    var txt = document.createElement('textarea');
    txt.className = 'form-control'; txt.rows=2;
    txt.placeholder='Viết bình luận...';
    var btn = document.createElement('button');
    btn.className='btn btn-sm btn-secondary mt-1';
    btn.textContent='Bình luận';
    btn.addEventListener('click', function(){
      var content = txt.value.trim();
      if(!content) return;
      var userId = 'user-demo';
      fetch(API_BASE + '/forum/posts/' + encodeURIComponent(post.id) + '/comments', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ authorId:userId, content:content })
      })
      .then(res=>res.json())
      .then(function(updated){
        div.replaceWith(renderPost(updated));
      });
    });
    div.appendChild(commentArea);
    div.appendChild(txt);
    div.appendChild(btn);
    return div;
  }

  document.getElementById('btnLoadPosts').addEventListener('click', function() {
    fetch(API_BASE + '/forum/posts')
      .then(res=>res.json())
      .then(function(data){
        var list = document.getElementById('postList');
        list.innerHTML = '';
        data.forEach(function(p){ list.appendChild(renderPost(p)); });
      });
  });

  document.getElementById('btnCreatePost').addEventListener('click', function() {
    var title = document.getElementById('newPostTitle').value.trim();
    var content = document.getElementById('newPostContent').value.trim();
    if (!title || !content) { alert('Nhập cả tiêu đề và nội dung'); return; }
    var payload = { authorId:'user-demo', title:title, content:content };
    fetch(API_BASE + '/forum/posts', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    })
    .then(res=>res.json())
    .then(function(p){
      document.getElementById('postList').prepend(renderPost(p));
      document.getElementById('newPostTitle').value = '';
      document.getElementById('newPostContent').value = '';
    });
  });
})();
