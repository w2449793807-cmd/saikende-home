(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.Tournament = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STATE_VERSION = 1;
  const ROUND_LABELS = new Map([
    [2, '决赛'],
    [4, '4 强'],
    [8, '8 强'],
    [16, '16 强'],
    [32, '32 强'],
  ]);

  function shuffle(items, rng) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const next = Math.floor(rng() * (index + 1));
      [copy[index], copy[next]] = [copy[next], copy[index]];
    }
    return copy;
  }

  function assertPowerOfTwo(count) {
    if (!Number.isInteger(count) || count < 2 || (count & (count - 1)) !== 0) {
      throw new Error('参赛车型数量必须是大于等于 2 的 2 次幂');
    }
  }

  function createTournament(categoryId, contestantIds, rng) {
    assertPowerOfTwo(contestantIds.length);
    const roundCount = Math.log2(contestantIds.length);
    const rounds = Array.from({ length: roundCount + 1 }, () => []);
    rounds[0] = shuffle(contestantIds, rng || Math.random);

    return {
      version: STATE_VERSION,
      categoryId,
      rounds,
      roundIndex: 0,
      matchIndex: 0,
      history: [],
      complete: false,
      championId: null,
    };
  }

  function pairAt(state) {
    const round = state.rounds[state.roundIndex] || [];
    const start = state.matchIndex * 2;
    return [round[start], round[start + 1]];
  }

  function getCurrentPair(state) {
    if (!state || state.complete) return null;
    const pair = pairAt(state);
    return pair[0] && pair[1] ? pair : null;
  }

  function cloneRounds(rounds) {
    return rounds.map((round) => round.slice());
  }

  function snapshot(state) {
    return {
      rounds: cloneRounds(state.rounds),
      roundIndex: state.roundIndex,
      matchIndex: state.matchIndex,
      complete: state.complete,
      championId: state.championId,
    };
  }

  function vote(state, winnerId) {
    const pair = getCurrentPair(state);
    if (!pair || !pair.includes(winnerId)) {
      throw new Error('所选车型不属于当前对决');
    }

    const next = {
      ...state,
      rounds: cloneRounds(state.rounds),
      history: state.history.concat(snapshot(state)),
    };
    const currentRoundSize = next.rounds[next.roundIndex].length;
    next.rounds[next.roundIndex + 1].push(winnerId);
    next.matchIndex += 1;

    if (next.matchIndex >= currentRoundSize / 2) {
      if (next.roundIndex === next.rounds.length - 2) {
        next.complete = true;
        next.championId = winnerId;
      } else {
        next.roundIndex += 1;
        next.matchIndex = 0;
      }
    }

    return next;
  }

  function undo(state) {
    if (!state || state.history.length === 0) return state;
    const previous = state.history[state.history.length - 1];
    return {
      ...state,
      rounds: cloneRounds(previous.rounds),
      roundIndex: previous.roundIndex,
      matchIndex: previous.matchIndex,
      complete: previous.complete,
      championId: previous.championId,
      history: state.history.slice(0, -1),
    };
  }

  function getProgress(state) {
    const initialCount = state.rounds[0].length;
    const roundSize = state.rounds[state.roundIndex] ? state.rounds[state.roundIndex].length : 2;
    return {
      completedMatches: state.history.length,
      totalMatches: initialCount - 1,
      matchInRound: state.matchIndex + 1,
      matchesInRound: roundSize / 2,
      roundLabel: ROUND_LABELS.get(roundSize) || `${roundSize} 强`,
    };
  }

  function serializeState(state) {
    return JSON.stringify(state);
  }

  function isValidState(value) {
    if (!value || typeof value !== 'object') return false;
    if (value.version !== STATE_VERSION || typeof value.categoryId !== 'string') return false;
    if (!Array.isArray(value.rounds) || value.rounds.length < 2) return false;
    if (!value.rounds.every((round) => Array.isArray(round) && round.every((id) => typeof id === 'string'))) {
      return false;
    }
    if (!Number.isInteger(value.roundIndex) || !Number.isInteger(value.matchIndex)) return false;
    if (!Array.isArray(value.history)) return false;
    if (typeof value.complete !== 'boolean') return false;
    if (value.complete && typeof value.championId !== 'string') return false;
    return value.roundIndex >= 0 && value.roundIndex < value.rounds.length - 1 && value.matchIndex >= 0;
  }

  function deserializeState(raw) {
    if (typeof raw !== 'string') return null;
    try {
      const parsed = JSON.parse(raw);
      return isValidState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return {
    STATE_VERSION,
    createTournament,
    getCurrentPair,
    getProgress,
    vote,
    undo,
    serializeState,
    deserializeState,
    isValidState,
  };
});
