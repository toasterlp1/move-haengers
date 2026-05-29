// ─────────────────────────────────────────────
//  OPBASE — Polls Module
// ─────────────────────────────────────────────
import { supabase } from './supabase.js';
import { state, sendDiscord, isExpired } from './app.js';

export async function loadPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_votes(*)')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  state.polls = (data || []).filter(p => !isExpired(p.created_at));
}

export async function createPoll({ question, options }) {
  const { data, error } = await supabase
    .from('polls')
    .insert({ question, options, created_by: state.currentUser.name })
    .select()
    .single();
  if (error) throw error;
  await loadPolls();

  const optStr = options.map((o, i) => `${['1️⃣','2️⃣','3️⃣','4️⃣'][i] || '▪'} ${o}`).join('\n');
  await sendDiscord(
    `📊 **NEUE ABSTIMMUNG** von **${state.currentUser.name}**\n` +
    `❓ **${question}**\n${optStr}\n\n👉 Jetzt auf OPBASE abstimmen!`
  );
  return data;
}

export async function vote(pollId, optionIndex) {
  const { error } = await supabase
    .from('poll_votes')
    .upsert({ poll_id: pollId, player_name: state.currentUser.name, option_index: optionIndex },
             { onConflict: 'poll_id,player_name' });
  if (error) throw error;
  await loadPolls();
}

export async function deletePoll(id) {
  const { error } = await supabase.from('polls').delete().eq('id', id);
  if (error) throw error;
  state.polls = state.polls.filter(p => p.id !== id);
}

export function renderPolls(containerId = 'polls-list') {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!state.polls.length) {
    el.innerHTML = `<p class="empty-state">Keine aktiven Abstimmungen.</p>`;
    return;
  }

  el.innerHTML = state.polls.map(p => {
    const votes = p.poll_votes || [];
    const total = votes.length;
    const myVote = votes.find(v => v.player_name === state.currentUser?.name)?.option_index ?? -1;

    const optionsHtml = (p.options || []).map((opt, i) => {
      const count = votes.filter(v => v.option_index === i).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      const isMine = myVote === i;
      return `
        <div class="poll-option ${isMine ? 'voted' : ''}" onclick="window.castVote(${p.id}, ${i})">
          <div class="poll-option-top">
            <span class="poll-opt-label">${opt}${isMine ? ' ✔' : ''}</span>
            <span class="poll-opt-pct">${count} (${pct}%)</span>
          </div>
          <div class="vote-bar"><div class="vote-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join('');

    return `
    <div class="poll-card" data-id="${p.id}">
      <div class="poll-header">
        <div class="poll-question">${p.question}</div>
        <div class="poll-meta">
          <span class="badge">${total} Stimmen</span>
          ${p.created_by === state.currentUser?.name
            ? `<button class="btn sm icon danger" onclick="window.delPoll(${p.id})"><i class="ti ti-trash"></i></button>`
            : ''}
        </div>
      </div>
      <div class="poll-options">${optionsHtml}</div>
      <div class="poll-footer">von ${p.created_by}</div>
    </div>`;
  }).join('');
}
