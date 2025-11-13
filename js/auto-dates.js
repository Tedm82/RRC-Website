// js/auto-dates.js
// W3BN Auto-Updating Meeting Dates — Forever Accurate
document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  function getNthWeekday(y, m, weekday, n) {
    const d = new Date(y, m, 1);
    let count = 0;
    while (count < n) {
      if (d.getDay() === weekday) count++;
      if (count < n) d.setDate(d.getDate() + 1);
    }
    return new Date(d);
  }

  // === CALCULATE ALL EVENT DATES ===

  // General Meeting → 1st Friday @ 7:30 PM
  let general = getNthWeekday(year, month, 5, 1);
  general.setHours(19, 30, 0, 0);
  if (general < now) {
    general = getNthWeekday(year, month + 1, 5, 1);
    general.setHours(19, 30, 0, 0);
  }

  // Board Meeting → 1st Tuesday @ 7:30 PM
  let board = getNthWeekday(year, month, 2, 1);
  board.setHours(19, 30, 0, 0);
  if (board < now) {
    board = getNthWeekday(year, month + 1, 2, 1);
    board.setHours(19, 30, 0, 0);
  }

  // Simplex Test → Saturday after General Meeting
  const simplex = new Date(general);
  simplex.setDate(general.getDate() + ((6 - general.getDay() + 7) % 7 || 7));
  simplex.setHours(10, 0, 0, 0); // 10:00 AM

  // Digital Modes Net → 3rd Thursday @ 8:00 PM
  let digital = getNthWeekday(year, month, 4, 3); // 4=Thursday, 3=3rd
  digital.setHours(20, 0, 0, 0); // 8:00 PM
  if (digital < now) {
    digital = getNthWeekday(year, month + 1, 4, 3);
    digital.setHours(20, 0, 0, 0);
  }
  
  // QCWA Net → Next Monday @ 9:00 PM
  let qcwa = new Date(now);
  const daysToMonday = (1 - now.getDay() + 7) % 7; // 1=Monday
  qcwa.setDate(now.getDate() + daysToMonday);
  qcwa.setHours(21, 0, 0, 0); // 9:00 PM
  if (daysToMonday === 0 && qcwa < now) {
      qcwa.setDate(qcwa.getDate() + 7);
  }

  // ARES/RACES Net → Next Monday @ 8:00 PM
  let ares = new Date(now);
  const daysToMondayARES = (1 - now.getDay() + 7) % 7;
  ares.setDate(now.getDate() + daysToMondayARES);
  ares.setHours(20, 0, 0, 0); // 8:00 PM
  if (daysToMondayARES === 0 && ares < now) {
      ares.setDate(ares.getDate() + 7);
  }

  // BRAIN Net → Next Wednesday @ 8:00 PM
  let brain = new Date(now);
  const daysToWednesday = (3 - now.getDay() + 7) % 7; // 3=Wednesday
  brain.setDate(now.getDate() + daysToWednesday);
  brain.setHours(20, 0, 0, 0); // 8:00 PM
  if (daysToWednesday === 0 && brain < now) {
      brain.setDate(brain.getDate() + 7);
  }

  // MOTA Net → Next Friday that is NOT the General Meeting Friday
  let candidate = new Date(now);
  candidate.setHours(20, 0, 0, 0);
  const daysToFriday = (5 - now.getDay() + 7) % 7 || 7;
  candidate.setDate(now.getDate() + daysToFriday);
  while (candidate.toDateString() === general.toDateString()) {
    candidate.setDate(candidate.getDate() + 7);
  }
  if (candidate < now) candidate.setDate(candidate.getDate() + 7);
  const mota = candidate;


  // === DATE FORMATTERS ===

  function formatShort(date) {
    // Short format for dashboard (e.g., Nov 12 @ 8:00 PM)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    }) + " @ " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  function formatFull(date) {
    // Full format for other pages (e.g., Wednesday, Nov 12, 2025 @ 8:00 PM)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + " @ " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  // === POPULATE ALL ELEMENTS ===

  // Populate dashboard nets
  document.querySelectorAll('.next-general').forEach(el => el.textContent = formatShort(general));
  document.querySelectorAll('.next-board').forEach(el => el.textContent = formatShort(board));
  document.querySelectorAll('.next-mota').forEach(el => el.textContent = formatShort(mota));
  document.querySelectorAll('.next-ares').forEach(el => el.textContent = formatShort(ares));
  document.querySelectorAll('.next-brain').forEach(el => el.textContent = formatShort(brain));
  
  // Populate full date nets (for other pages)
  document.querySelectorAll('.next-simplex-full').forEach(el => el.textContent = formatFull(simplex));
  document.querySelectorAll('.next-digital-full').forEach(el => el.textContent = formatFull(digital));
  document.querySelectorAll('.next-qcwa-full').forEach(el => el.textContent = formatFull(qcwa));

  // --- NEW: Find and Populate the "Upcoming Event" card ---
  try {
    const events = [
      { name: 'General Meeting', date: general },
      { name: 'Board Meeting', date: board },
      { name: 'Digital Modes Net', date: digital },
      { name: 'Simplex Test', date: simplex }
    ];

    // Sort events by date, soonest first
    events.sort((a, b) => a.date - b.date);

    // Find the next event
    const nextEvent = events[0]; // The soonest one

    // Populate the card
    const loader = document.getElementById('next-event-loader');
    const content = document.getElementById('next-event-content');
    
    document.getElementById('next-event-name').textContent = nextEvent.name;
    document.getElementById('next-event-date').textContent = formatFull(nextEvent.date); // Use full date format
    
    // Hide loader, show content
    loader.style.display = 'none';
    content.classList.remove('hidden');

  } catch (e) {
    console.error("Could not populate next event", e);
    const loader = document.getElementById('next-event-loader');
    if (loader) loader.innerHTML = '<p class="text-red-400">Error loading event.</p>';
  }
});
