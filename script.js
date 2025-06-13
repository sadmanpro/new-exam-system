// Current user state
const state = {
  user: null,
  currentView: 'home',
  examInProgress: false,
  questions: [
    {
      id: 1,
      text: "What is the correct syntax for referring to an external script called 'script.js'?",
      options: [
        { id: 1, text: "<script href=\"script.js\">", correct: false },
        { id: 2, text: "<script name=\"script.js\">", correct: false },
        { id: 3, text: "<script src=\"script.js\">", correct: true },
        { id: 4, text: "<script file=\"script.js\">", correct: false }
      ],
      explanation: "The correct syntax for including an external JavaScript file is using the src attribute."
    }
  ]
};

// DOM Elements
const views = {
  home: document.getElementById('home-view'),
  liveExams: document.getElementById('live-exams-view'),
  studentDashboard: document.getElementById('student-dashboard-view'),
  adminDashboard: document.getElementById('admin-dashboard-view'),
  createExam: document.getElementById('create-exam-view'),
  examTaking: document.getElementById('exam-taking-view')
};

// Auth Modal Toggle
const authModal = document.getElementById('auth-modal');
const authButton = document.getElementById('auth-button');
const closeAuth = document.getElementById('close-auth');
const authTabs = document.querySelectorAll('.auth-tab');
const studentLoginForm = document.getElementById('student-login-form');
const studentRegisterForm = document.getElementById('student-register-form');
const adminLoginForm = document.getElementById('admin-login-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

authButton.addEventListener('click', (e) => {
  e.preventDefault();
  authModal.classList.remove('hidden');
});

closeAuth.addEventListener('click', () => {
  authModal.classList.add('hidden');
});

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('tab-active'));
    tab.classList.add('tab-active');
    
    if (tab.dataset.tab === 'student-login') {
      studentLoginForm.classList.remove('hidden');
      studentRegisterForm.classList.add('hidden');
      adminLoginForm.classList.add('hidden');
    } else if (tab.dataset.tab === 'admin-login') {
      studentLoginForm.classList.add('hidden');
      studentRegisterForm.classList.add('hidden');
      adminLoginForm.classList.remove('hidden');
    }
  });
});

showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  studentLoginForm.classList.add('hidden');
  studentRegisterForm.classList.remove('hidden');
  
  // Update tabs to show we're in registration
  authTabs.forEach(t => t.classList.remove('tab-active'));
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  studentRegisterForm.classList.add('hidden');
  studentLoginForm.classList.remove('hidden');
  
  // Update tabs to show we're back to login
  authTabs.forEach(t => {
    if (t.dataset.tab === 'student-login') t.classList.add('tab-active');
  });
});

// Form submissions
studentLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.user = { role: 'student', name: 'John Doe' };
  authModal.classList.add('hidden');
  showView('studentDashboard');
  updateNav();
});

studentRegisterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.user = { role: 'student', name: 'New User' };
  authModal.classList.add('hidden');
  showView('studentDashboard');
  updateNav();
});

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.user = { role: 'admin' };
  authModal.classList.add('hidden');
  showView('adminDashboard');
  updateNav();
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const view = e.target.dataset.view;
    showView(view);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
  });
});

document.getElementById('explore-exams').addEventListener('click', () => {
  showView('liveExams');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector('[data-view="live-exams"]').classList.add('active');
});

document.getElementById('back-to-admin').addEventListener('click', () => {
  showView('adminDashboard');
});

// Create Exam Flow
document.getElementById('create-exam-btn').addEventListener('click', () => {
  showView('createExam');
});

document.getElementById('add-question-btn').addEventListener('click', () => {
  // In a real app, this would show the question form or add a new question template
  alert('Add new question form would appear here');
});

// Option selection in exam taking
document.querySelectorAll('.option-item').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.option-item').forEach(opt => {
      opt.classList.remove('option-selected');
    });
    option.classList.add('option-selected');
  });
});

// Start exam from student dashboard or live exams
document.querySelectorAll('[class*="hover:bg-gray-50"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.textContent === 'Start' || e.target.textContent === 'Start Exam') {
      state.examInProgress = true;
      showView('examTaking');
      
      // Start exam timer
      startTimer(30 * 60); // 30 minutes
    }
  });
});

// Correct option selection in question creation
document.querySelectorAll('.option-correct-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.option-correct-btn').forEach(b => {
      b.innerHTML = '<i class="far fa-circle text-gray-400"></i>';
    });
    btn.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
  });
});

// View management
function showView(viewName) {
  // Hide all views
  Object.values(views).forEach(view => {
    if (view) view.classList.add('hidden');
  });
  
  // Show requested view
  if (views[viewName]) {
    views[viewName].classList.remove('hidden');
  }
  
  // Update state
  state.currentView = viewName;
}

// Update navigation based on auth state
function updateNav() {
  if (state.user) {
    authButton.textContent = 'Logout';
    authButton.onclick = () => {
      state.user = null;
      authButton.textContent = 'Login';
      authButton.onclick = () => authModal.classList.remove('hidden');
      showView('home');
    };
  }
}

// Timer function for exams
function startTimer(duration) {
  let timer = duration, minutes, seconds;
  const timerElement = document.getElementById('timer');
  
  const interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    timerElement.textContent = minutes + ":" + seconds;
    
    if (--timer < 0) {
      clearInterval(interval);
      timerElement.textContent = "Time's up!";
      
      // In a real app, would submit the exam automatically
      alert('Time is up! Your exam will be submitted automatically.');
    }
  }, 1000);
}
