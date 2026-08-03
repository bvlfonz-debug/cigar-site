// Client-side only — the ONE place every "add to humidor" touchpoint reads
// and writes through. See CLAUDE.md "Personal Humidor" for the authoritative
// description.
//
// Private rating/note here is NEVER the same thing as a public Community
// Review (data/cigars.db's cigar_community_review table) — this data never
// leaves the visitor's own browser, is never submitted anywhere, and is
// never blended with any official score.
//
// Phase 1's only implementation (LocalStorageHumidorStore) is
// localStorage-backed. A future account-synced implementation can satisfy
// the exact same HumidorStore interface and be swapped in as the `humidor`
// export below WITHOUT any caller (cigar page, compare page, search page,
// /humidor/ page) changing a single line — they only ever call
// humidor.getAll()/get()/upsert()/remove(), never touch storage directly.

export type HumidorList = 'smoked' | 'want-to-try';
export type HumidorSource = 'manual' | 'compare' | 'search' | 'review' | 'scan';

export interface HumidorEntry {
  cigarId: string; // the cigar's own path, e.g. "/cigars/brand/line/vitola/"
  list: HumidorList;
  addedAt: string; // ISO date
  privateRating: number | null; // 1-5, the user's own — never public, never Codex Score
  privateNote: string | null; // free text — never public
  source: HumidorSource;
}

export interface HumidorStore {
  getAll(): HumidorEntry[];
  get(cigarId: string): HumidorEntry | null;
  upsert(
    cigarId: string,
    list: HumidorList,
    opts?: Partial<Pick<HumidorEntry, 'privateRating' | 'privateNote' | 'source'>>
  ): HumidorEntry;
  remove(cigarId: string): void;
}

const STORAGE_KEY = 'stickscore-humidor-v1';

class LocalStorageHumidorStore implements HumidorStore {
  private read(): HumidorEntry[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(entries: HumidorEntry[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  getAll(): HumidorEntry[] {
    return this.read();
  }

  get(cigarId: string): HumidorEntry | null {
    return this.read().find((e) => e.cigarId === cigarId) ?? null;
  }

  upsert(
    cigarId: string,
    list: HumidorList,
    opts: Partial<Pick<HumidorEntry, 'privateRating' | 'privateNote' | 'source'>> = {}
  ): HumidorEntry {
    const entries = this.read();
    const existing = entries.find((e) => e.cigarId === cigarId);
    if (existing) {
      existing.list = list;
      if (opts.privateRating !== undefined) existing.privateRating = opts.privateRating;
      if (opts.privateNote !== undefined) existing.privateNote = opts.privateNote;
      if (opts.source !== undefined) existing.source = opts.source;
      this.write(entries);
      return existing;
    }
    const entry: HumidorEntry = {
      cigarId,
      list,
      addedAt: new Date().toISOString(),
      privateRating: opts.privateRating ?? null,
      privateNote: opts.privateNote ?? null,
      source: opts.source ?? 'manual',
    };
    entries.push(entry);
    this.write(entries);
    return entry;
  }

  remove(cigarId: string): void {
    this.write(this.read().filter((e) => e.cigarId !== cigarId));
  }
}

export const humidor: HumidorStore = new LocalStorageHumidorStore();

// Progressive-enhancement wiring for <HumidorButton> instances. Finds every
// [data-humidor-button] element on whatever page it runs on and wires it up
// generically — adding a new touchpoint anywhere else on the site later is
// just dropping in the same markup, no new script code needed.
export function initHumidorButtons(root: ParentNode = document): void {
  const buttons = root.querySelectorAll<HTMLElement>('[data-humidor-button]');
  buttons.forEach((el) => {
    if (el.dataset.humidorWired === 'true') return;
    el.dataset.humidorWired = 'true';

    const cigarId = el.dataset.cigarId;
    if (!cigarId) return;
    const source = (el.dataset.humidorSource as HumidorSource | undefined) ?? 'manual';

    const wantBtn = el.querySelector<HTMLButtonElement>('[data-humidor-action="want-to-try"]');
    const smokedBtn = el.querySelector<HTMLButtonElement>('[data-humidor-action="smoked"]');
    const removeBtn = el.querySelector<HTMLButtonElement>('[data-humidor-action="remove"]');
    const statusEl = el.querySelector<HTMLElement>('[data-humidor-status]');

    function render() {
      const entry = humidor.get(cigarId!);
      if (statusEl) {
        statusEl.textContent = entry
          ? entry.list === 'smoked'
            ? 'In your humidor: Smoked'
            : 'In your humidor: Want to Try'
          : 'Not in your humidor yet';
      }
      wantBtn?.classList.toggle('humidor-btn--active', entry?.list === 'want-to-try');
      smokedBtn?.classList.toggle('humidor-btn--active', entry?.list === 'smoked');
      if (removeBtn) removeBtn.hidden = !entry;
    }

    wantBtn?.addEventListener('click', () => {
      humidor.upsert(cigarId!, 'want-to-try', { source });
      render();
    });
    smokedBtn?.addEventListener('click', () => {
      humidor.upsert(cigarId!, 'smoked', { source });
      render();
    });
    removeBtn?.addEventListener('click', () => {
      humidor.remove(cigarId!);
      render();
    });

    render();
  });
}
