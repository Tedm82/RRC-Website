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
  simplex.setHours(10, 0, 0, 0); // 10:00 AM (change if needed)

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

  // NEW! Digital Modes Net → 3rd Thursday @ 8:00 PM
  let digital = getNthWeekday(year, month, 4, 3); // 4=Thursday, 3=3rd
  digital.setHours(20, 0, 0, 0); // 8:00 PM
  if (digital < now) {
    digital = getNthWeekday(year, month + 1, 4, 3);
    digital.setHours(20, 0, 0, 0);
  }
  
  // NEW! QCWA Net → Next Monday @ 9:00 PM
  let qcwa = new Date(now);
  const daysToMonday = (1 - now.getDay() + 7) % 7; // 1=Monday
  qcwa.setDate(now.getDate() + daysToMonday);
  qcwa.setHours(21, 0, 0, 0); // 9:00 PM
  
  // If it's Monday but 9 PM has already passed, get next Monday
  if (daysToMonday === 0 && qcwa < now) {
      qcwa.setDate(qcwa.getDate() + 7);
  }


  function format(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + " @ " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  document.querySelectorAll('.next-general').forEach(el => el.textContent = format(general));
  document.querySelectorAll('.next-board').forEach(el => el.textContent = format(board));
  document.querySelectorAll('.next-mota').forEach(el => el.textContent = format(mota));
  document.querySelectorAll('.next-simplex').forEach(el => el.textContent = format(simplex));
  
  // NEW! Add these two lines
  document.querySelectorAll('.next-digital').forEach(el => el.textContent = format(digital));
  document.querySelectorAll('.next-qcwa').forEach(el => el.textContent = format(qcwa));
});
