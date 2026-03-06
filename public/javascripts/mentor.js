
  // Show confirmation message
  function showConfirmation() {
    const msg = document.getElementById('confirmationMsg');
    msg.classList.add('show');

    setTimeout(() => {
      msg.classList.remove('show');
    }, 3000);
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.12)';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(76, 175, 80, 0.08)';
      }
    });
  }

/* ================= ATTENDANCE PAGE FUNCTIONALITY ================= */

// Initialize attendance page
document.addEventListener('DOMContentLoaded', function() {
  initializeAttendancePage();
});

function initializeAttendancePage() {
  const dateInput = document.getElementById('attendanceDate');
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const saveBtn = document.getElementById('saveAttendanceBtn');
  const resetBtn = document.getElementById('resetAttendanceBtn');

  // Set today's date as default
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
    dateInput.max = today;
  }

  // Toggle button functionality
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const sessionGroup = this.closest('.session-toggle');
      const otherBtn = sessionGroup.querySelector('.toggle-btn:not(.active)') || 
                       sessionGroup.querySelector('.toggle-btn');
      
      // Toggle active state
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        sessionGroup.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        updateAttendanceSummary(this.closest('tr'));
      }
    });
  });

  // Save attendance
  if (saveBtn) {
    saveBtn.addEventListener('click', saveAttendance);
  }

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAttendanceForm);
  }

  // Update all summaries on load
  updateAllSummaries();
}

function updateAttendanceSummary(row) {
  if (!row) return;

  const morningBtn = row.querySelector('[data-session="morning"].active[data-status="present"]');
  const afternoonBtn = row.querySelector('[data-session="afternoon"].active[data-status="present"]');
  
  const morningPresent = !!morningBtn;
  const afternoonPresent = !!afternoonBtn;
  
  // Update visual indicator
  const dayTotal = (morningPresent ? 0.5 : 0) + (afternoonPresent ? 0.5 : 0);
  
  // Optional: Update a display if available
  const dayDisplay = row.querySelector('[data-day-total]');
  if (dayDisplay) {
    dayDisplay.textContent = dayTotal.toFixed(1);
  }
}

function updateAllSummaries() {
  const rows = document.querySelectorAll('.attendance-table tbody tr');
  rows.forEach(row => updateAttendanceSummary(row));
}

function saveAttendance() {
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');
  const saveBtn = document.getElementById('saveAttendanceBtn');
  const dateInput = document.getElementById('attendanceDate');

  // Clear previous messages
  successMsg?.classList.remove('show');
  errorMsg?.classList.remove('show');

  // Get attendance data
  const attendanceData = getAttendanceData();
  
  if (!attendanceData || attendanceData.length === 0) {
    if (errorMsg) {
      errorMsg.textContent = '⚠️ Please mark attendance for at least one student.';
      errorMsg.classList.add('show');
    }
    return;
  }

  // Simulate saving (frontend only)
  console.log('Saving attendance for:', dateInput.value, attendanceData);

  // Show success message
  if (successMsg) {
    successMsg.classList.add('show');
  }

  // Disable save button temporarily
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '✓ Saved';
    
    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Attendance';
    }, 3000);
  }

  // Auto-hide success message
  setTimeout(() => {
    if (successMsg) {
      successMsg.classList.remove('show');
    }
  }, 3000);
}

function getAttendanceData() {
  const rows = document.querySelectorAll('.attendance-table tbody tr');
  const data = [];

  rows.forEach(row => {
    const studentId = row.querySelector('[data-student-id]')?.getAttribute('data-student-id');
    const morningPresent = !!row.querySelector('[data-session="morning"].active[data-status="present"]');
    const afternoonPresent = !!row.querySelector('[data-session="afternoon"].active[data-status="present"]');

    if (morningPresent || afternoonPresent) {
      data.push({
        studentId,
        morning: morningPresent,
        afternoon: afternoonPresent,
        dayTotal: (morningPresent ? 0.5 : 0) + (afternoonPresent ? 0.5 : 0)
      });
    }
  });

  return data;
}

function resetAttendanceForm() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(btn => btn.classList.remove('active'));
  updateAllSummaries();
  
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');
  if (successMsg) successMsg.classList.remove('show');
  if (errorMsg) errorMsg.classList.remove('show');
}

// Calculate and display attendance percentage
function calculateAttendancePercentage(studentData) {
  if (!studentData.totalSessions || studentData.totalSessions === 0) return 0;
  return Math.round((studentData.sessionsPresent / studentData.totalSessions) * 100);
}

// Update stats dynamically
function updateStatCard(studentId, percentage) {
  const statCard = document.querySelector(`[data-stat-student-id="${studentId}"]`);
  if (!statCard) return;

  const percentageDisplay = statCard.querySelector('.stat-percentage');
  const progressFill = statCard.querySelector('.stat-progress-fill');

  if (percentageDisplay) {
    percentageDisplay.textContent = percentage + '%';
    
    // Update color based on percentage
    percentageDisplay.classList.remove('low', 'critical');
    if (percentage < 60) {
      percentageDisplay.classList.add('critical');
      if (progressFill) progressFill.classList.add('critical');
    } else if (percentage < 75) {
      percentageDisplay.classList.add('low');
      if (progressFill) progressFill.classList.add('low');
    } else {
      if (progressFill) progressFill.classList.remove('low', 'critical');
    }
  }

  if (progressFill) {
    progressFill.style.width = percentage + '%';
  }
}

/* ================= STUDENTS LISTING PAGE FUNCTIONALITY ================= */

// Initialize students page
document.addEventListener('DOMContentLoaded', function() {
  initializeStudentsPage();
  initializeNavbar();
});

function initializeStudentsPage() {
  // Card hover animations
  const cards = document.querySelectorAll('.student-listing-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Set active nav link
  highlightActiveNavLink();
}

function initializeNavbar() {
  // Navbar Toggle for Mobile
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
