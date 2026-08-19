const CHEVRON = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>`;

class SortableTable extends HTMLElement {
  connectedCallback() {
    const table = this.querySelector('table');
    const tbody = table?.querySelector('tbody');
    const headerCells = table?.querySelectorAll('thead tr th');
    if (!table || !tbody || !headerCells?.length) return;

    this.table = table;
    this.tbody = tbody;
    this.headers = Array.from(headerCells);
    this.rows = Array.from(tbody.querySelectorAll('tr'));
    this.collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    this.addFilter();
    this.addSortButtons();
  }

  addFilter() {
    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'sortable-table__filter';
    input.placeholder = 'Filter…';
    input.setAttribute('aria-label', 'Filter table rows');
    input.addEventListener('input', () => this.filterRows(input.value));
    this.prepend(input);
  }

  filterRows(query) {
    const term = query.trim().toLowerCase();
    for (const row of this.rows) {
      row.hidden = Boolean(term) && !row.textContent.toLowerCase().includes(term);
    }
  }

  addSortButtons() {
    this.headers.forEach((th, index) => {
      const label = th.textContent.trim();
      th.textContent = '';
      th.setAttribute('aria-sort', 'none');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sortable-table__sort';
      button.innerHTML = `${label} ${CHEVRON}`;
      button.addEventListener('click', () => this.sortByColumn(index, th));
      th.append(button);
    });
  }

  sortByColumn(index, th) {
    const ascending = th.getAttribute('aria-sort') !== 'ascending';
    for (const header of this.headers) header.setAttribute('aria-sort', 'none');
    th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');

    const {collator} = this;
    this.rows.sort((a, b) => {
      const aText = a.children[index]?.textContent.trim() ?? '';
      const bText = b.children[index]?.textContent.trim() ?? '';
      const aEmpty = aText === '' || aText === '—';
      const bEmpty = bText === '' || bText === '—';
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;
      return collator.compare(aText, bText);
    });

    if (!ascending) this.rows.reverse();
    for (const row of this.rows) this.tbody.append(row);
  }
}

customElements.define('sortable-table', SortableTable);
