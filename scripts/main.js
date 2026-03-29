/**
 * main.js — Interactive Features for Ann Arbor Skyline Cross Country
 * Source: Custom-written for SI 338 Client Project Deliverable
 *
 * This file provides all client-side interactivity for the site:
 *   1. Card flip animation — toggles athlete cards between front/back on
 *      click or keyboard activation (Enter/Space).
 *   2. Roster sorting — reorders athlete cards by name, grade, season
 *      record, or personal record using data-* attributes.
 *   3. Race results filtering — filters the athlete results table rows
 *      by a text search (race name / location) and/or date picker.
 *   4. Athlete comparison — dynamically rebuilds the comparison section
 *      using embedded ATHLETES_DATA JSON when the user clicks Compare.
 *
 * No external libraries are used; all functionality is vanilla JavaScript.
 * The ATHLETES_DATA global object (used by the comparison feature) is
 * embedded in the team page HTML by team-builder.py during site generation.
 */

document.addEventListener('DOMContentLoaded', function () {
  hardenExternalLinks();
  initCardFlip();
  initSort();
  initFilter();
  initCompare();
});


/* ================================================================
   1. Card Flip
   Toggles the .flipped class on athlete roster cards when the user
   clicks or taps. CSS transforms (rotateY) handle the 3D flip
   animation via the .athlete-card.flipped .card-inner selector.
   Clicks on the "View Profile" link inside the card are allowed
   to propagate normally without toggling the flip.

   Keyboard users reach the "View Profile" link via Tab; the CSS
   :focus-within rule on .athlete-card automatically flips the card
   to reveal the link when it receives focus.
   ================================================================ */

function initCardFlip() {
  var cards = document.querySelectorAll('.athlete-card');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      toggleCard(card);
    });
  });
}

function toggleCard(card) {
  card.classList.toggle('flipped');
}


/* ================================================================
   2. Roster Sorting
   Listens for changes on the #sort-by <select> and reorders the
   .athlete-card elements within #athlete-roster by reading their
   data-name, data-grade, data-sr, and data-pr attributes.

   Time strings like "17:22.3" are parsed to total seconds for
   numeric comparison. Invalid or missing values sort last (Infinity).
   ================================================================ */

function initSort() {
  var sortSelect = document.getElementById('sort-by');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', function () {
    sortCards(this.value);
  });
}

/**
 * Converts a time string (e.g. "17:22.3") to total seconds.
 * Returns Infinity for invalid or missing values so they sort last.
 */
function timeToSeconds(t) {
  if (!t || t === 'N/A') return Infinity;
  t = t.replace('PR', '').trim();
  var parts = t.split(':');
  if (parts.length !== 2) return Infinity;
  return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
}

/**
 * Sorts .athlete-card elements inside #athlete-roster by the
 * given criterion. Uses appendChild to move existing DOM nodes
 * into the new order without recreating them.
 */
function sortCards(sortBy) {
  var container = document.getElementById('athlete-roster');
  if (!container) return;

  var cards = Array.from(container.querySelectorAll('.athlete-card'));

  cards.sort(function (a, b) {
    switch (sortBy) {
      case 'name':
        return a.dataset.name.localeCompare(b.dataset.name);
      case 'grade':
        return parseInt(a.dataset.grade, 10) - parseInt(b.dataset.grade, 10);
      case 'season-record':
        return timeToSeconds(a.dataset.sr) - timeToSeconds(b.dataset.sr);
      case 'personal-record':
        return timeToSeconds(a.dataset.pr) - timeToSeconds(b.dataset.pr);
      default:
        return 0;
    }
  });

  cards.forEach(function (card) {
    container.appendChild(card);
  });
}


/* ================================================================
   3. Race Results Filtering (Athlete Page)
   Filters #results-table rows based on a text search field (matches
   against race name and location columns) and/or a date picker.
   Non-matching rows are hidden with display:none.
   ================================================================ */

function initFilter() {
  var searchInput = document.getElementById('filter-location');
  var dateInput = document.getElementById('filter-date');
  if (!searchInput && !dateInput) return;

  var table = document.getElementById('results-table');
  if (!table) return;

  function applyFilters() {
    var searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var dateVal = dateInput ? dateInput.value : '';

    var rows = table.querySelectorAll('tbody tr');

    rows.forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      var raceName = cells[0].textContent.toLowerCase();
      var dateText = cells[1].textContent.trim();
      var location = cells[2].textContent.toLowerCase();

      var matchesSearch = !searchVal ||
        raceName.includes(searchVal) ||
        location.includes(searchVal);

      var matchesDate = true;
      if (dateVal) {
        var filterDate = new Date(dateVal);
        var rowDate = new Date(dateText);
        matchesDate = !isNaN(filterDate.getTime()) &&
          !isNaN(rowDate.getTime()) &&
          filterDate.toDateString() === rowDate.toDateString();
      }

      row.style.display = (matchesSearch && matchesDate) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (dateInput) dateInput.addEventListener('change', applyFilters);
}


/* ================================================================
   4. Athlete Comparison (Team Page)
   Uses the ATHLETES_DATA global object (embedded as JSON in the
   HTML by team-builder.py) to dynamically update the comparison
   section when the user selects two athletes and clicks Compare.

   The function finds shared meets between both athletes and
   generates a side-by-side comparison card layout plus a table
   of shared meet placements.
   ================================================================ */

function initCompare() {
  var compareBtn = document.getElementById('compare-button');
  if (!compareBtn) return;

  compareBtn.addEventListener('click', function () {
    var selectA = document.getElementById('athlete-a');
    var selectB = document.getElementById('athlete-b');
    if (!selectA || !selectB) return;

    var idA = selectA.value;
    var idB = selectB.value;

    if (typeof ATHLETES_DATA === 'undefined') return;

    var a = ATHLETES_DATA[idA];
    var b = ATHLETES_DATA[idB];
    if (!a || !b) return;

    updateComparison(a, b);
    announceComparisonResult(a, b);
  });
}

/**
 * Rebuilds the #comparison-results section with comparison cards
 * and a shared-meets table for two athletes.
 */
function updateComparison(a, b) {
  var container = document.getElementById('comparison-results');
  if (!container) return;

  var sharedMeets = [];
  for (var meet in a.meets) {
    if (b.meets.hasOwnProperty(meet)) {
      sharedMeets.push(meet);
    }
  }
  sharedMeets.sort();

  // ATHLETES_DATA values are already HTML-escaped by team-builder.py,
  // so they can be inserted directly into innerHTML without re-escaping.
  var sharedRows = '';
  sharedMeets.forEach(function (meet) {
    sharedRows +=
      '<tr><td>' + meet + '</td>' +
      '<td>' + a.meets[meet] + '</td>' +
      '<td>' + b.meets[meet] + '</td></tr>';
  });

  var sharedHTML = '';
  if (sharedRows) {
    sharedHTML =
      '<div class="shared-meets">' +
      '<h3>Shared Meets</h3>' +
      '<table>' +
      '<caption class="sr-only">Shared meet placements for ' + a.name + ' and ' + b.name + '</caption>' +
      '<thead><tr><th>Meet</th>' +
      '<th>' + a.name + ' Place</th>' +
      '<th>' + b.name + ' Place</th></tr></thead>' +
      '<tbody>' + sharedRows + '</tbody>' +
      '</table></div>';
  } else {
    sharedHTML =
      '<p role="status">No shared meets found for the selected athletes.</p>';
  }

  container.innerHTML =
    '<h3>Comparison Results</h3>' +
    '<div class="comparison-cards">' +
    comparisonCard(a) + comparisonCard(b) +
    '</div>' + sharedHTML;
}

/**
 * Builds the HTML string for one athlete's comparison card.
 * Values from ATHLETES_DATA are pre-escaped by the Python builder.
 */
function comparisonCard(athlete) {
  return '<div class="comparison-card">' +
    '<img src="' + athlete.profilePic + '" alt="" aria-hidden="true">' +
    '<h3>' + athlete.name + '</h3>' +
    '<p>Grade: ' + athlete.grade + '</p>' +
    '<p>Season Record: ' + athlete.sr + '</p>' +
    '<p>Personal Record: ' + athlete.pr + '</p>' +
    '<p>Meets Competed: ' + athlete.meetCount + '</p>' +
    '</div>';
}

/**
 * Escapes HTML special characters in a string to prevent XSS
 * when inserting user-facing data into innerHTML.
 */
function esc(text) {
  var el = document.createElement('span');
  el.textContent = text;
  return el.innerHTML;
}

/**
 * Adds rel attributes to all target="_blank" links to prevent
 * reverse-tabnabbing and quiet accessibility/security warnings.
 */
function hardenExternalLinks() {
  var externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(function (link) {
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

/**
 * Announces comparison updates in a polite live region.
 */
function announceComparisonResult(a, b) {
  var status = document.getElementById('compare-status');
  if (!status) return;
  status.textContent = 'Updated comparison for ' + a.name + ' and ' + b.name + '.';
}
