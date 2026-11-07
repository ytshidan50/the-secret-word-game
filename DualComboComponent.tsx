'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lock } from 'lucide-react';
import gameData from './data/game_data.json';

// Helper functions for pure dataset selection
function getCandidatesFromData(selectedCat: string, selectedLvl: string) {
  const categories = (gameData && (gameData as any).categories) || {};
  let pool: any[] = [];
  Object.keys(categories).forEach((cId) => {
    if (selectedCat !== 'all' && selectedCat !== cId) return;
    const cat = categories[cId];
    if (cat && cat.levels) {
      Object.keys(cat.levels).forEach((lId) => {
        if (selectedLvl !== 'all' && selectedLvl !== lId) return;
        const list = cat.levels[lId];
        if (Array.isArray(list)) pool = pool.concat(list);
      });
    }
  });

  if (pool.length === 0) {
    Object.values(categories).forEach((c: any) => {
      if (c && c.levels) {
        Object.values(c.levels).forEach((lvlList: any) => {
          if (Array.isArray(lvlList)) pool = pool.concat(lvlList);
        });
      }
    });
  }
  return pool;
}

function getRandomTopicFromData(selectedCat: string, selectedLvl: string) {
  const pool = getCandidatesFromData(selectedCat, selectedLvl);
  if (pool.length === 0) return { topic: 'Loading topic...', relatedWords: ['SECRET'] };
  return pool[Math.floor(Math.random() * pool.length)];
}

function getRandomWordFromData(topicObj: any, excludeWord = '') {
  let candidates: string[] = [];
  if (topicObj && topicObj.relatedWords && topicObj.relatedWords.length > 0) {
    candidates = topicObj.relatedWords;
  } else {
    candidates = (gameData as any).words || ['SECRET'];
  }
  if (excludeWord && candidates.length > 1) {
    const filtered = candidates.filter((w: string) => w.toLowerCase() !== excludeWord.toLowerCase());
    if (filtered.length > 0) candidates = filtered;
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function DualComboComponent() {
  const [topic, setTopic] = useState('Loading game topic...');
  const [word, setWord] = useState('SECRET');
  const [currentTopicObj, setCurrentTopicObj] = useState<any>(null);
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  // Repetition Target & Count
  const [targetReps, setTargetReps] = useState(3);
  const [repeatCount, setRepeatCount] = useState(0);

  // States
  const [isHeld, setIsHeld] = useState(false);
  const [isPermanentlyRevealed, setIsPermanentlyRevealed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Minimum Speaking Time State (Default 2:30 = 150s)
  const [minTimeTarget, setMinTimeTarget] = useState(150);
  const [timerRemaining, setTimerRemaining] = useState(150);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [isMinTimeMet, setIsMinTimeMet] = useState(false);
  const [totalSpokenSeconds, setTotalSpokenSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Cross-environment timer ref (safe in both Node and Browser environments)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audio completion chime (Web Audio API - zero tokens, zero external files)
  const playChime = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.3 }, // C5
        { freq: 659.25, time: 0.15, dur: 0.3 }, // E5
        { freq: 783.99, time: 0.30, dur: 0.3 }, // G5
        { freq: 1046.50, time: 0.45, dur: 0.8 }, // C6
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);
      });
    } catch (err) {
      console.warn('Audio chime notice:', err);
    }
  }, []);

  // Cleanup timer interval on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsMinTimeMet(false);
    setIsSessionActive(false);
    setOvertimeSeconds(0);
    setTotalSpokenSeconds(0);
    setTimerRemaining(minTimeTarget);
  }, [minTimeTarget]);

  const fetchCombo = useCallback(async () => {
    if (isRunning) return; // Locked only while actively speaking
    setIsPermanentlyRevealed(false);
    setRepeatCount(0);
    setIsSessionActive(false);
    resetTimer();

    try {
      const res = await fetch(`/api/combo?category=${category}&level=${level}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTopic(json.data.topic);
          setWord(String(json.data.word).toUpperCase());
          setCurrentTopicObj({ topic: json.data.topic, relatedWords: [json.data.word] });
          return;
        }
      }
    } catch {
      // Offline fallback: select purely from game_data.json
    }

    const item = getRandomTopicFromData(category, level);
    setCurrentTopicObj(item);
    setTopic(item.topic);
    const pickedWord = getRandomWordFromData(item);
    setWord(String(pickedWord).toUpperCase());
  }, [category, level, isRunning, resetTimer]);

  const rerollTopic = useCallback(() => {
    if (isRunning) return;
    const item = getRandomTopicFromData(category, level);
    setCurrentTopicObj(item);
    setTopic(item.topic);
    const pickedWord = getRandomWordFromData(item);
    setWord(String(pickedWord).toUpperCase());
    setRepeatCount(0);
  }, [category, level, isRunning]);

  const rerollWord = useCallback(() => {
    if (isRunning) return;
    const pickedWord = getRandomWordFromData(currentTopicObj, word);
    setWord(String(pickedWord).toUpperCase());
    setRepeatCount(0);
  }, [currentTopicObj, word, isRunning]);

  // Restore local session state on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('secret_word_game_session_v2');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.topic) setTopic(s.topic);
        if (s.word) setWord(s.word);
        if (s.topicObj) setCurrentTopicObj(s.topicObj);
        if (s.category) setCategory(s.category);
        if (s.level) setLevel(s.level);
        if (typeof s.targetRepeats === 'number') setTargetReps(s.targetRepeats);
        if (typeof s.repeatCount === 'number') setRepeatCount(s.repeatCount);
        if (typeof s.minTimeTarget === 'number') setMinTimeTarget(s.minTimeTarget);
        if (typeof s.timerRemaining === 'number') setTimerRemaining(s.timerRemaining);
        if (typeof s.overtimeSeconds === 'number') setOvertimeSeconds(s.overtimeSeconds);
        if (typeof s.totalSpokenSeconds === 'number') setTotalSpokenSeconds(s.totalSpokenSeconds);
        if (typeof s.isMinTimeMet === 'boolean') setIsMinTimeMet(s.isMinTimeMet);
        if (typeof s.isSessionActive === 'boolean') setIsSessionActive(s.isSessionActive);
        if (typeof s.isWordPermanentlyRevealed === 'boolean') setIsPermanentlyRevealed(s.isWordPermanentlyRevealed);
      } else {
        fetchCombo();
      }
    } catch {
      fetchCombo();
    }
  }, [fetchCombo]);

  // Automatically save session state locally (counts, timings, word, topic)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const s = {
        topic,
        word,
        topicObj: currentTopicObj,
        category,
        level,
        targetRepeats: targetReps,
        repeatCount,
        minTimeTarget,
        timerRemaining,
        overtimeSeconds,
        totalSpokenSeconds,
        isMinTimeMet,
        isSessionActive,
        isPermanentlyRevealed
      };
      localStorage.setItem('secret_word_game_session_v2', JSON.stringify(s));
    } catch { }
  }, [topic, word, currentTopicObj, category, level, targetReps, repeatCount, minTimeTarget, timerRemaining, overtimeSeconds, totalSpokenSeconds, isMinTimeMet, isSessionActive, isPermanentlyRevealed]);

  // Timer controls: counts down to minimum threshold, then continues into overtime
  const toggleTimer = () => {
    if (isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setIsSessionActive(true);

      timerRef.current = setInterval(() => {
        setTotalSpokenSeconds((prev) => prev + 1);

        setTimerRemaining((rem) => {
          if (rem > 1) {
            return rem - 1;
          } else if (rem === 1) {
            setIsMinTimeMet(true);
            playChime();
            return 0;
          } else {
            setOvertimeSeconds((ot) => ot + 1);
            return 0;
          }
        });
      }, 1000);
    }
  };

  // Reveal to audience
  const handleRevealToAudience = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
    setIsPermanentlyRevealed(true);
    setShowModal(true);
  };

  const handleNextSpeaker = () => {
    setShowModal(false);
    setIsSessionActive(false);
    fetchCombo();
  };

  const displayTime = () => {
    if (!isMinTimeMet) {
      const m = Math.floor(timerRemaining / 60);
      const s = timerRemaining % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    } else {
      const total = minTimeTarget + overtimeSeconds;
      const m = Math.floor(total / 60);
      const s = total % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-white text-slate-950 text-xs font-black px-2 py-0.5 rounded">GAME</span>
          <span className="font-extrabold text-lg tracking-tight">The Secret Word</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">Session Mode</span>
      </div>

      {/* Rules Notice */}
      <div className="bg-slate-900 border-l-4 border-sky-400 p-3 rounded-lg text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
        🎯 <strong>The Challenge:</strong> Speak on the topic for <strong>at least the minimum time</strong> (speak as long as you want!). Sneak the secret word in naturally for the target count.
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {[
          { id: 'all', label: '✨ All Categories' },
          { id: 'fun', label: '😂 Silly & Fun' },
          { id: 'hottakes', label: '🔥 Hot Takes' },
          { id: 'awkward', label: '😬 Awkward' },
          { id: 'roast', label: '🎯 Light Roast' },
          { id: 'conspiracy', label: '🕵️ Conspiracy' },
        ].map((pill) => (
          <button
            key={pill.id}
            type="button"
            disabled={isRunning}
            onClick={() => setCategory(pill.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === pill.id
                ? 'bg-white text-slate-950 border-white'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white disabled:opacity-30'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Session Active Warning */}
      {isRunning && (
        <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold py-2 px-3 rounded-lg mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Speaking session in progress (Rerolls locked during speech)</span>
        </div>
      )}

      {/* Board */}
      <div className="space-y-4">
        {/* Topic Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span>TOPIC TO SPEAK ABOUT</span>
            <button
              type="button"
              disabled={isRunning}
              onClick={rerollTopic}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-30"
            >
              ↺ New Topic
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-snug">{topic}</h2>
        </div>

        {/* Secret Word Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] font-extrabold tracking-wider">
            <span className="text-sky-400 uppercase">
              {isPermanentlyRevealed ? 'SECRET WORD (REVEALED)' : 'SECRET WORD (HOLD TO PEEK)'}
            </span>
            <button
              type="button"
              disabled={isRunning}
              onClick={rerollWord}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-30"
            >
              ↺ New Word
            </button>
          </div>

          {/* Press and Hold Peek Box */}
          <div
            role="button"
            tabIndex={0}
            aria-label={isPermanentlyRevealed ? 'Secret word revealed' : 'Press and hold to view secret word'}
            onMouseDown={() => !isPermanentlyRevealed && setIsHeld(true)}
            onMouseUp={() => !isPermanentlyRevealed && setIsHeld(false)}
            onMouseLeave={() => !isPermanentlyRevealed && setIsHeld(false)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                if (!isPermanentlyRevealed) setIsHeld(true);
              }
            }}
            onKeyUp={() => !isPermanentlyRevealed && setIsHeld(false)}
            onTouchStart={(e) => {
              if (!isPermanentlyRevealed) {
                e.preventDefault();
                setIsHeld(true);
              }
            }}
            onTouchEnd={() => !isPermanentlyRevealed && setIsHeld(false)}
            onContextMenu={(e) => e.preventDefault()}
            className={`p-6 rounded-lg text-center cursor-pointer select-none transition-all mb-4 outline-none focus:ring-2 focus:ring-sky-400 ${
              isPermanentlyRevealed || isHeld
                ? 'bg-slate-950 border-2 border-yellow-400'
                : 'bg-slate-950/60 border-2 border-dashed border-slate-800 hover:border-slate-700'
            }`}
          >
            {isPermanentlyRevealed || isHeld ? (
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-yellow-400 uppercase mb-1">
                  {word}
                </h1>
                <p className="text-xs text-slate-400">
                  Repeat this word at least <strong className="text-white">{targetReps} times</strong> naturally!
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <Lock className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-sm font-extrabold tracking-wide text-slate-200">
                  PRESS & HOLD TO VIEW WORD
                </span>
                <small className="text-[11px] text-slate-400 uppercase">Release finger to hide instantly</small>
              </div>
            )}
          </div>

          {/* Stepper for Minimum Repetitions */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg mb-3">
            <span className="text-xs font-semibold text-slate-400">Target repetitions:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isRunning}
                onClick={() => setTargetReps((r) => Math.max(1, r - 1))}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 text-white font-bold hover:bg-slate-700 disabled:opacity-30"
              >
                −
              </button>
              <span className="w-7 text-center font-extrabold text-sky-400 text-sm">{targetReps}</span>
              <button
                type="button"
                disabled={isRunning}
                onClick={() => setTargetReps((r) => Math.min(10, r + 1))}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 text-white font-bold hover:bg-slate-700 disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Repeat Tracker (Appears when speech / session is active or word is revealed) */}
          {(isSessionActive || isPermanentlyRevealed) && (
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-xs font-semibold text-slate-400">
                Times spoken: <strong className="text-sky-400">{repeatCount}</strong>/{targetReps}
              </span>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: targetReps }).map((_, idx) => {
                  const countNum = idx + 1;
                  const isDone = countNum <= repeatCount;
                  return (
                    <button
                      key={countNum}
                      type="button"
                      onClick={() => setRepeatCount(isDone ? countNum - 1 : countNum)}
                      className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center border transition-all ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {countNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Permanent Reveal Score Banner */}
          {isPermanentlyRevealed && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              {repeatCount >= targetReps
                ? `🎉 Target Achieved: Spoken ${repeatCount} of ${targetReps} times!`
                : `⚠️ Target Missed: Spoken ${repeatCount} of ${targetReps} times (${targetReps - repeatCount} short)`}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => {
              if (isRunning) toggleTimer();
              setIsSessionActive(false);
              fetchCombo();
            }}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold bg-white text-slate-950 hover:bg-slate-100 active:translate-y-0.5 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            🎲 Roll New Combo
          </button>
          <button
            type="button"
            onClick={handleRevealToAudience}
            className="w-full py-3.5 px-4 rounded-xl font-bold border border-slate-700 bg-slate-900 hover:bg-slate-800 active:translate-y-0.5 transition-all text-white flex items-center justify-center gap-2"
          >
            📢 Reveal to Audience
          </button>
        </div>

        {/* Timer Section (Open-ended: speak as long as you want!) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">
                {isMinTimeMet ? '🎙 Speaking:' : '⏱ Min Time:'}
              </span>
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isMinTimeMet ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {displayTime()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : isMinTimeMet
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    : 'bg-white hover:bg-slate-200 text-slate-950'
                }`}
              >
                {isRunning ? 'Pause' : isMinTimeMet ? 'Finish Speech' : 'Start'}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick preset durations */}
          <div className="flex gap-1.5 pt-1 overflow-x-auto">
            {[
              { label: '1m', sec: 60 },
              { label: '1:30', sec: 90 },
              { label: '2m', sec: 120 },
              { label: '2:30', sec: 150 },
              { label: '3m', sec: 180 },
              { label: '5m', sec: 300 },
            ].map((preset) => (
              <button
                key={preset.sec}
                type="button"
                disabled={isRunning}
                onClick={() => {
                  setMinTimeTarget(preset.sec);
                  setTimerRemaining(preset.sec);
                  setIsMinTimeMet(false);
                  setOvertimeSeconds(0);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                  minTimeTarget === preset.sec
                    ? 'bg-sky-500 border-sky-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white disabled:opacity-30'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audience Reveal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <span className="text-4xl">🎉</span>
            <h2 className="text-xl font-black text-white">Speech Finished!</h2>
            <p className="text-xs text-slate-400">Can the audience guess what the secret word was?</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                The Secret Word Was:
              </span>
              <h3 className="text-3xl font-black text-yellow-400 uppercase tracking-widest">{word}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Repetition Target</span>
                <span className="text-sm font-extrabold text-slate-200">
                  {repeatCount} / {targetReps} times
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Speech Time</span>
                <span className="text-sm font-extrabold text-slate-200">
                  {Math.floor(totalSpokenSeconds / 60)}:
                  {totalSpokenSeconds % 60 < 10 ? '0' : ''}
                  {totalSpokenSeconds % 60}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleNextSpeaker}
                className="w-full py-3 px-4 rounded-xl font-extrabold bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-lg shadow-sky-500/25"
              >
                Next Speaker ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
