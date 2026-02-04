async function loadDashboard() {
  try {
    // Try to fetch from same directory first
    let data;
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Fetch failed');
      data = await response.json();
    } catch (fetchErr) {
      // Fallback: try absolute URL
      const fallbackUrl = 'https://mpowerbuddy.github.io/openclaw-dashboard/data.json';
      console.log('Trying fallback URL:', fallbackUrl);
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw new Error('Fallback failed');
      data = await response.json();
    }

    // Set date
    document.getElementById('date').textContent = data.date || 'Today';

    // Weather
    const weatherEl = document.getElementById('weather');
    if (data.weather) {
      weatherEl.textContent = `${data.weather.icon || ''} ${data.weather.temp || ''}`;
    } else {
      weatherEl.textContent = 'Loading...';
    }

    // Walk suggestion
    const walkSection = document.getElementById('walk-info');
    if (data.walk && data.walk.suggested) {
      walkSection.innerHTML = `
        <strong>${data.walk.bestTime || ''}</strong> — ${data.walk.reason || ''}
        ${data.walk.note ? `<br><small>${data.walk.note}</small>` : ''}
      `;
    } else if (data.walk) {
      walkSection.innerHTML = 'Not recommended today';
    } else {
      walkSection.innerHTML = 'Walk data not available';
    }

    // Calendar (may not have data)
    const calendarDiv = document.getElementById('calendar-events');
    if (data.calendar && data.calendar.length > 0) {
      calendarDiv.innerHTML = data.calendar.map(e =>
        `<div class="event-item">${e.time || ''} — ${e.title || ''} <span class="cal-badge">${e.calendar || ''}</span></div>`
      ).join('');
    } else {
      calendarDiv.innerHTML = '<div class="empty-state">No events loaded</div>';
    }

    // Brain dump
    const brainDumpDiv = document.getElementById('brain-dump-items');
    if (data.brainDump && data.brainDump.length > 0) {
      brainDumpDiv.innerHTML = data.brainDump.map(item => `
        <div class="brain-dump-item priority-${item.priority || 'normal'}">
          ${item.text || ''}
          ${item.deadline ? `<div class="deadline">${item.deadline}</div>` : ''}
        </div>
      `).join('');
    } else {
      brainDumpDiv.innerHTML = '<div class="empty-state">All clear!</div>';
    }

    // Personal projects
    const projectsDiv = document.getElementById('projects');
    if (data.projects && data.projects.length > 0) {
      projectsDiv.innerHTML = data.projects.map(p =>
        `<div class="project-item">${p}</div>`
      ).join('');
    } else {
      projectsDiv.innerHTML = '<div class="empty-state">No active projects</div>';
    }

    console.log('Dashboard loaded successfully');
  } catch (err) {
    console.error('Failed to load dashboard:', err);
    document.getElementById('walk-info').innerHTML = '<div class="empty-state">Data unavailable</div>';
    document.getElementById('calendar-events').innerHTML = '<div class="empty-state">Data unavailable</div>';
    document.getElementById('brain-dump-items').innerHTML = '<div class="empty-state">Data unavailable</div>';
    document.getElementById('projects').innerHTML = '<div class="empty-state">Data unavailable</div>';
  }
}

loadDashboard();
