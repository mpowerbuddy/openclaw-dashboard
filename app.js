async function loadDashboard() {
  try {
    const data = await fetch('data.json').then(r => r.json());

    // Set date
    document.getElementById('date').textContent = data.date;

    // Weather
    document.getElementById('weather').textContent = `${data.weather.icon} ${data.weather.temp}`;

    // Walk suggestion
    const walkSection = document.getElementById('walk-info');
    if (data.walk.suggested) {
      walkSection.innerHTML = `
        <strong>${data.walk.bestTime}</strong> — ${data.walk.reason}
        ${data.walk.note ? `<br><small>${data.walk.note}</small>` : ''}
      `;
    } else {
      walkSection.innerHTML = 'Not recommended today';
    }

    // Calendar
    const calendarDiv = document.getElementById('calendar-events');
    if (data.calendar.length === 0) {
      calendarDiv.innerHTML = '<div class="empty-state">No events scheduled</div>';
    } else {
      calendarDiv.innerHTML = data.calendar.map(e =>
        `<div class="event-item">${e.time} — ${e.title}</div>`
      ).join('');
    }

    // Brain dump
    const brainDumpDiv = document.getElementById('brain-dump-items');
    if (data.brainDump.length === 0) {
      brainDumpDiv.innerHTML = '<div class="empty-state">All clear!</div>';
    } else {
      brainDumpDiv.innerHTML = data.brainDump.map(item => `
        <div class="brain-dump-item priority-${item.priority}">
          ${item.text}
          ${item.deadline ? `<div class="deadline">${item.deadline}</div>` : ''}
        </div>
      `).join('');
    }

    // Personal projects
    const projectsDiv = document.getElementById('projects');
    if (data.projects.length === 0) {
      projectsDiv.innerHTML = '<div class="empty-state">No active projects</div>';
    } else {
      projectsDiv.innerHTML = data.projects.map(p =>
        `<div class="project-item">${p}</div>`
      ).join('');
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

loadDashboard();
