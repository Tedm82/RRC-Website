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
  
  // If it's Monday but 9 PM has already passed, get next Monday
  if (daysToMonday === 0 && qcwa < now) {
      qcwa.setDate(qcwa.getDate() + 7);
  }

  // --- NEW CODE ---

  // ARES/RACES Net → Next Monday @ 8:00 PM
  let ares = new Date(now);
  const daysToMondayARES = (1 - now.getDay() + 7) % 7; // 1=Monday
  ares.setDate(now.getDate() + daysToMondayARES);
  ares.setHours(20, 0, 0, 0); // 8:00 PM
  
  // If it's Monday but 8 PM has already passed, get next Monday
  if (daysToMondayARES === 0 && ares < now) {
      ares.setDate(ares.getDate() + 7);
  }

  // BRAIN Net → Next Wednesday @ 8:00 PM
  let brain = new Date(now);
  const daysToWednesday = (3 - now.getDay() + 7) % 7; // 3=Wednesday
  brain.setDate(now.getDate() + daysToWednesday);
  brain.setHours(20, 0, 0, 0); // 8:00 PM
  
  // If it's Wednesday but 8 PM has already passed, get next Wednesday
  if (daysToWednesday === 0 && brain < now) {
      brain.setDate(brain.getDate() + 7);
  }

  // --- END NEW CODE ---


  function format(date) {
    // Shorter format for the quick links
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    }) + " @ " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  // This formatter is for the full date on other pages
  function formatFull(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + " @ " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  // Populate elements
  // Note: Using a shorter date format for the homepage
  document.querySelectorAll('.next-general').forEach(el => el.textContent = format(general));
  document.querySelectorAll('.next-board').forEach(el => el.textContent = format(board));
  document.querySelectorAll('.next-mota').forEach(el => el.textContent = format(mota));
  
  // These use the full format for other pages (like nets.html)
  document.querySelectorAll('.next-simplex-full').forEach(el => el.textContent = formatFull(simplex));
  document.querySelectorAll('.next-digital-full').forEach(el => el.textContent = formatFull(digital));
  document.querySelectorAll('.next-qcwa-full').forEach(el => el.textContent = formatFull(qcwa));

  // --- NEW CODE ---
  // Populate the new net times
  document.querySelectorAll('.next-ares').forEach(el => el.textContent = format(ares));
  document.querySelectorAll('.next-brain').forEach(el => el.textContent = format(brain));
  // --- END NEW CODE ---
});
