async function loadDashboard() {
  try {
    // Try GitHub Pages first, fallback to local
    let data;
    try {
      const response = await fetch('https://mpowerbuddy.github.io/openclaw-dashboard/data.json');
      if (!response.ok) throw new Error('Fetch failed');
      data = await response.json();
    } catch (fetchErr) {
      const response = await fetch('data.json');
      data = await response.json();
    }

    // Set date
    document.getElementById('date').textContent = data.date || new Date().toLocaleDateString();

    // Weather
    const weatherEl = document.getElementById('weather');
    if (data.weather) {
      weatherEl.textContent = `${data.weather.icon || ''} ${data.weather.temp || ''}`;
    } else {
      weatherEl.textContent = '--°F';
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
      walkSection.innerHTML = 'Walk data unavailable';
    }

    // Status Update (new section)
    const statusSection = document.getElementById('status-update');
    if (data.status && data.status.currentFocus) {
      statusSection.innerHTML = `
        <div class="status-section">
          <h3>📋 Status Update</h3>
          <p><strong>Current:</strong> ${data.status.currentFocus}</p>
          <p><strong>Progress:</strong> ${data.status.progress || 'None'}</p>
          <p><strong>Blockers:</strong> ${data.status.blockers || 'None'}</p>
          <p><strong>Next:</strong> ${data.status.nextActions || 'None'}</p>
          <small>${data.status.timestamp || ''}</small>
        </div>
      `;
    } else {
      statusSection.innerHTML = '<small>No status update today</small>';
    }

    // Brain Dumps by Category
    const brainDumpDiv = document.getElementById('brain-dump-items');
    if (data.brainDump && data.brainDump.length > 0) {
      // Group by priority
      const urgent = data.brainDump.filter(i => i.priority === 'urgent');
      const high = data.brainDump.filter(i => i.priority === 'high' || i.priority === 'soon');
      const normal = data.brainDump.filter(i => i.priority === 'normal');
      const low = data.brainDump.filter(i => i.priority === 'low' || i.priority === 'someday');

      brainDumpDiv.innerHTML = `
        ${urgent.length ? `<div class="priority-group"><h4>🔴 Urgent</h4>${urgent.map(i => renderItem(i)).join('')}</div>` : ''}
        ${high.length ? `<div class="priority-group"><h4>🟡 Soon</h4>${high.map(i => renderItem(i)).join('')}</div>` : ''}
        ${normal.length ? `<div class="priority-group"><h4>⚪ Normal</h4>${normal.slice(0, 5).map(i => renderItem(i)).join('')}${normal.length > 5 ? `<p><small>+${normal.length - 5} more</small></p>` : ''}</div>` : ''}
        ${low.length ? `<div class="priority-group"><h4>🩵 Someday</h4>${low.map(i => renderItem(i)).join('')}</div>` : ''}
      `;
    } else {
      brainDumpDiv.innerHTML = '<div class="empty-state">All clear!</div>';
    }

    function renderItem(item) {
      return `
        <div class="brain-dump-item priority-${item.priority || 'normal'}">
          ${item.text || ''}
          ${item.deadline ? `<div class="deadline">📅 ${item.deadline}</div>` : ''}
        </div>
      `;
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

  } catch (err) {
    console.error('Dashboard load error:', err);
    document.getElementById('walk-info').innerHTML = '<div class="empty-state">Data unavailable</div>';
    document.getElementById('brain-dump-items').innerHTML = '<div class="empty-state">Data unavailable</div>';
  }
}

loadDashboard();
