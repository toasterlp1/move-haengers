// ============================================================
//  GamingHub — polls.js
// ============================================================

console.log('GH: polls.js loaded');

const Polls = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;

  function render() {
    const me = S().getMe();
    const polls = S().getPolls();

    document.getElementById('polls-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon pink"><i class="ti ti-chart-bar"></i></div>
          <div><h1>Umfragen</h1><p>Gemeinsam entscheiden was als nächstes gespielt wird</p></div>
        </div>
        ${me ? `<button class="btn btn-pink btn-lg" onclick="Polls.openCreate()"><i class="ti ti-plus"></i> Umfrage starten</button>` : ''}
      </div>

      ${polls.length === 0 ? `<div class="empty-state"><span class="empty-icon">🗳️</span><p>Keine aktiven Umfragen. Starte eine!</p></div>` : ''}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        ${polls.map(p => renderPollCard(p, me)).join('')}
      </div>

      <!-- Create Modal -->
      <div class="modal-overlay" id="modal-create-poll">
        <div class="modal">
          <div class="modal-header">
            <h2 class="neon-pink">Umfrage erstellen</h2>
            <button class="icon-btn" onclick="GH.utils.closeModal('modal-create-poll')"><i class="ti ti-x"></i></button>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div><label>Frage</label><input class="input" id="poll-question" placeholder="z.B. Was zocken wir am Wochenende?"></div>
            <div>
              <label>Optionen (min. 2)</label>
              <div id="poll-options-list" style="display:flex;flex-direction:column;gap:8px">
                <input class="input" placeholder="Option 1">
                <input class="input" placeholder="Option 2">
                <input class="input" placeholder="Option 3 (optional)">
                <input class="input" placeholder="Option 4 (optional)">
              </div>
              <button class="btn btn-ghost btn-sm mt-2" onclick="Polls.addOptionField()"><i class="ti ti-plus"></i> Option hinzufügen</button>
            </div>
            <div><label>Läuft ab am</label><input class="input" type="datetime-local" id="poll-expires"></div>
            <div class="flex gap-3 justify-between mt-2">
              <button class="btn btn-ghost" onclick="GH.utils.closeModal('modal-create-poll')">Abbrechen</button>
              <button class="btn btn-pink btn-lg" onclick="Polls.submitCreate()"><i class="ti ti-send"></i> Starten & Benachrichtigen</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPollCard(poll, me) {
    const totalVotes = Object.keys(poll.votes || {}).length;
    const myVote = me ? poll.votes?.[me.username] : null;
    const isCreator = me?.username === poll.createdBy;
    const expires = poll.expiresAt ? U().countdownText(poll.expiresAt) : null;

    return `
      <div class="card card-pink" style="display:flex;flex-direction:column;gap:12px">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            ${U().renderAvatar(poll.createdBy, 'sm')}
            <span style="font-size:0.8rem;color:var(--text-secondary)">${U().escHtml(poll.createdBy)}</span>
          </div>
          <div class="flex items-center gap-2">
            ${expires ? `<span class="badge badge-orange"><i class="ti ti-clock" style="font-size:10px"></i> ${expires}</span>` : ''}
            ${isCreator ? `<button class="icon-btn" style="width:28px;height:28px" onclick="Polls.confirmDelete('${poll.id}')"><i class="ti ti-trash" style="font-size:13px"></i></button>` : ''}
          </div>
        </div>
        <h3 style="font-size:1rem;line-height:1.4">${U().escHtml(poll.question)}</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${poll.options.map((opt, i) => renderOption(poll, i, opt, myVote, totalVotes, me)).join('')}
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${totalVotes} Stimme${totalVotes !== 1 ? 'n' : ''}</div>
      </div>
    `;
  }

  function renderOption(poll, index, label, myVote, totalVotes, me) {
    const votes = Object.values(poll.votes || {}).filter(v => v === index).length;
    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    const isSelected = myVote === index;
    const showResults = myVote !== null && myVote !== undefined;

    return `
      <div>
        <button
          class="w-full"
          style="background:${isSelected ? 'rgba(255,0,160,0.12)' : 'rgba(255,255,255,0.03)'};border:1px solid ${isSelected ? 'var(--neon-pink)' : 'var(--dark-border)'};border-radius:var(--radius-md);padding:0.55rem 0.9rem;cursor:${me ? 'pointer' : 'default'};transition:all 0.2s;width:100%;text-align:left;color:var(--text-primary);font-family:var(--font-body);font-size:0.9rem;display:flex;align-items:center;justify-content:space-between"
          onclick="${me ? `Polls.vote('${poll.id}',${index})` : ''}"
          ${isSelected ? 'data-selected="true"' : ''}
        >
          <span>${U().escHtml(label)}</span>
          ${showResults ? `<span style="font-family:var(--font-display);font-size:0.75rem;color:${isSelected ? 'var(--neon-pink)' : 'var(--text-secondary)'}">${pct}%</span>` : ''}
        </button>
        ${showResults ? `<div class="progress-bar mt-1"><div class="progress-fill" style="width:${pct}%;background:${isSelected ? 'linear-gradient(90deg,var(--neon-pink),var(--neon-purple))' : 'linear-gradient(90deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))'}"></div></div>` : ''}
      </div>
    `;
  }

  function openCreate() {
    if (!S().getMe()) return U().showToast('Erstell zuerst ein Profil!', 'error');
    const nextWeek = new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,16);
    document.getElementById('poll-expires').value = nextWeek;
    document.getElementById('poll-question').value = '';
    document.querySelectorAll('#poll-options-list input').forEach((el, i) => el.value = '');
    U().openModal('modal-create-poll');
  }

  function addOptionField() {
    const list = document.getElementById('poll-options-list');
    const count = list.querySelectorAll('input').length + 1;
    const input = document.createElement('input');
    input.className = 'input';
    input.placeholder = `Option ${count}`;
    list.appendChild(input);
  }

  async function submitCreate() {
    const me = S().getMe();
    if (!me) return;
    const question = document.getElementById('poll-question').value.trim();
    const options = [...document.querySelectorAll('#poll-options-list input')]
      .map(i => i.value.trim()).filter(Boolean);
    if (!question) return U().showToast('Bitte eine Frage eingeben', 'error');
    if (options.length < 2) return U().showToast('Mindestens 2 Optionen nötig', 'error');
    const poll = S().addPoll({
      question, options,
      createdBy: me.username,
      expiresAt: document.getElementById('poll-expires').value || null,
    });
    U().closeModal('modal-create-poll');
    render();
    U().showToast('Umfrage gestartet!', 'success');
    const sent = await U().notifyPoll(poll);
    if (sent) U().showToast('Discord-Benachrichtigung gesendet ✓', 'success');
  }

  function vote(pollId, optionIndex) {
    const me = S().getMe();
    if (!me) return U().showToast('Erstell zuerst ein Profil!', 'error');
    S().votePoll(pollId, me.username, optionIndex);
    render();
  }

  function confirmDelete(id) {
    U().confirmAction('Diese Umfrage wirklich löschen?', () => {
      S().deletePoll(id);
      render();
      U().showToast('Umfrage gelöscht', 'info');
    });
  }

  window.Polls = { render, openCreate, addOptionField, submitCreate, vote, confirmDelete };
})();
