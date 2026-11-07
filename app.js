/**
 * The Secret Word - Minimal Impromptu Party Game Engine
 * Features:
 * - "Times Spoken" tracker appears ONLY when speaking starts (timer active)
 * - Minimum speaking time threshold: countdown to min time, then counts overtime so speaker can speak as long as they want!
 * - Configurable Minimum Repetitions (Dynamic Stepper & Dots)
 * - Press & Hold to Peek Word (Privacy shield)
 * - Permanent Unreveal on "Reveal to Audience" with exact repetition count & total speaking time
 * - Reroll lock while speaking/timer active
 * - Free Web Speech Recognition for auto-counting
 * - Audio Chime on min time completion (Web Audio API)
 * - LocalStorage duration & target persistence
 */

// Unified Game Data directly loaded from data/game_data.json
const GAME_DATA = {
  "meta": {
    "title": "THE SECRET WORD GAME DATASET",
    "version": "2.0.0",
    "description": "Curated impromptu topics organized by category and difficulty levels, paired with subtle camouflage secret words."
  },
  "categories": {
    "fun": {
      "id": "fun",
      "name": "Fun & Silly",
      "emoji": "😂",
      "levels": {
        "easy": [
          {
            "topic": "Why cereal is technically a cold soup",
            "relatedWords": [
              "chemistry",
              "recipe",
              "liquid",
              "chef",
              "tradition",
              "temperature"
            ]
          },
          {
            "topic": "Why morning people should not be trusted before 10 a.m.",
            "relatedWords": [
              "sunshine",
              "conspiracy",
              "energy",
              "suspicious",
              "alarm",
              "danger"
            ]
          },
          {
            "topic": "How to eat the last slice of pizza without anyone blaming you",
            "relatedWords": [
              "ninja",
              "stealth",
              "innocent",
              "fridge",
              "evidence",
              "diplomat"
            ]
          },
          {
            "topic": "The unspoken laws of choosing a grocery store checkout line",
            "relatedWords": [
              "cashier",
              "receipt",
              "patience",
              "cart",
              "coupon",
              "strategy"
            ]
          },
          {
            "topic": "Why cats are secretly plotting global domination",
            "relatedWords": [
              "shadow",
              "military",
              "couch",
              "whisper",
              "silent",
              "mastermind"
            ]
          },
          {
            "topic": "Why afternoon naps should be legally mandatory for all working adults",
            "relatedWords": [
              "pillow",
              "productivity",
              "boss",
              "blanket",
              "energy",
              "routine"
            ]
          },
          {
            "topic": "The real reason why your left sock always goes missing in the laundry",
            "relatedWords": [
              "portal",
              "machine",
              "mystery",
              "blackhole",
              "monster",
              "dimension"
            ]
          },
          {
            "topic": "Why adult board games ruin more friendships than real arguments",
            "relatedWords": [
              "cheating",
              "lawyer",
              "strategy",
              "revenge",
              "winner",
              "tears"
            ]
          }
        ],
        "medium": [
          {
            "topic": "How to survive a zombie apocalypse using only items currently in this room",
            "relatedWords": [
              "weapon",
              "bandage",
              "flashlight",
              "panic",
              "defense",
              "escape"
            ]
          },
          {
            "topic": "Why socks with sandals is misunderstood high fashion",
            "relatedWords": [
              "designer",
              "confidence",
              "runway",
              "comfort",
              "revolution",
              "aesthetic"
            ]
          },
          {
            "topic": "Convince us that aliens exist and they are secretly disappointed in us",
            "relatedWords": [
              "telescope",
              "diplomat",
              "embarrassing",
              "civilization",
              "satellite",
              "galaxy"
            ]
          },
          {
            "topic": "The absolute worst superpower to have in everyday life",
            "relatedWords": [
              "invisible",
              "accident",
              "curse",
              "hospital",
              "nuisance",
              "explosion"
            ]
          },
          {
            "topic": "Explain your last weird Google search without looking guilty",
            "relatedWords": [
              "history",
              "curiosity",
              "detective",
              "midnight",
              "innocent",
              "browser"
            ]
          },
          {
            "topic": "Pitch a completely ridiculous business idea with 100% confidence",
            "relatedWords": [
              "billionaire",
              "investor",
              "patent",
              "monopoly",
              "genius",
              "profit"
            ]
          },
          {
            "topic": "Why villains in movies usually have better arguments than the heroes",
            "relatedWords": [
              "monologue",
              "cape",
              "logic",
              "revenge",
              "destruction",
              "philosophy"
            ]
          },
          {
            "topic": "Convince us that humans would be much better off if we had tails",
            "relatedWords": [
              "balance",
              "furniture",
              "evolution",
              "emotion",
              "fluffy",
              "posture"
            ]
          }
        ],
        "hard": [
          {
            "topic": "Why you should be elected Supreme Ruler of the world today",
            "relatedWords": [
              "throne",
              "speech",
              "promise",
              "palace",
              "lawyer",
              "crown"
            ]
          },
          {
            "topic": "Convince the room that water is not wet",
            "relatedWords": [
              "molecule",
              "surface",
              "physics",
              "aquarium",
              "moisture",
              "science"
            ]
          },
          {
            "topic": "How you would spend 10 million dollars in 24 hours without buying houses or cars",
            "relatedWords": [
              "charity",
              "private",
              "island",
              "extravagant",
              "ticket",
              "helicopter"
            ]
          },
          {
            "topic": "The awkward science of figuring out what to do with your hands while walking",
            "relatedWords": [
              "pocket",
              "swinging",
              "robot",
              "posture",
              "sidewalk",
              "stranger"
            ]
          },
          {
            "topic": "Why shampoo bottles have too much reading material for shower time",
            "relatedWords": [
              "bathroom",
              "ingredients",
              "boredom",
              "literature",
              "bubbles",
              "poetry"
            ]
          },
          {
            "topic": "How to fake being an expert in modern art at a fancy museum",
            "relatedWords": [
              "glasses",
              "chin",
              "canvas",
              "profound",
              "splatter",
              "auction"
            ]
          }
        ]
      }
    },
    "hottakes": {
      "id": "hottakes",
      "name": "Hot Takes",
      "emoji": "🔥",
      "levels": {
        "easy": [
          {
            "topic": "Cold pizza for breakfast is superior to hot pizza for dinner",
            "relatedWords": [
              "fridge",
              "crust",
              "morning",
              "tradition",
              "microwave",
              "delicious"
            ]
          },
          {
            "topic": "Making your bed every morning is an overrated waste of energy",
            "relatedWords": [
              "blanket",
              "routine",
              "neat",
              "energy",
              "pointless",
              "mattress"
            ]
          },
          {
            "topic": "Popcorn at movie theaters is just an overpriced delivery vehicle for salt",
            "relatedWords": [
              "butter",
              "crunchy",
              "theater",
              "kernel",
              "robbery",
              "bucket"
            ]
          },
          {
            "topic": "Small talk about the weather is an underrated conversational masterpiece",
            "relatedWords": [
              "umbrella",
              "clouds",
              "temperature",
              "neighbor",
              "elevator",
              "forecast"
            ]
          }
        ],
        "medium": [
          {
            "topic": "Group chats with more than 5 people are a form of punishment",
            "relatedWords": [
              "notification",
              "mute",
              "chaos",
              "drama",
              "typing",
              "escape"
            ]
          },
          {
            "topic": "Voice notes longer than 30 seconds should require a written permit",
            "relatedWords": [
              "podcast",
              "transcript",
              "mic",
              "lecture",
              "patience",
              "monologue"
            ]
          },
          {
            "topic": "Social media was better when it was just status updates about what you ate",
            "relatedWords": [
              "nostalgia",
              "sandwich",
              "timeline",
              "algorithm",
              "innocent",
              "feed"
            ]
          },
          {
            "topic": "Watching movies with subtitles on is mandatory even in your native language",
            "relatedWords": [
              "whisper",
              "dialogue",
              "accent",
              "mumble",
              "comprehension",
              "cinema"
            ]
          },
          {
            "topic": "Replying to emails immediately only invites more emails to be sent to you",
            "relatedWords": [
              "inbox",
              "boundary",
              "urgent",
              "keyboard",
              "trap",
              "workflow"
            ]
          }
        ],
        "hard": [
          {
            "topic": "People who clap when the airplane lands should be placed on a watchlist",
            "relatedWords": [
              "turbulence",
              "runway",
              "celebration",
              "pilot",
              "oxygen",
              "embarrassing"
            ]
          },
          {
            "topic": "Birthdays get significantly more exhausting after the age of 21",
            "relatedWords": [
              "candles",
              "cake",
              "aging",
              "hangover",
              "celebration",
              "fatigue"
            ]
          },
          {
            "topic": "Unsolicited phone calls without a warning text should be illegal",
            "relatedWords": [
              "ringtone",
              "panic",
              "vibration",
              "voicemail",
              "boundary",
              "rude"
            ]
          },
          {
            "topic": "The 40-hour work week was designed for a world that no longer exists",
            "relatedWords": [
              "commute",
              "exhaustion",
              "cubicle",
              "factory",
              "efficiency",
              "freedom"
            ]
          }
        ]
      }
    },
    "awkward": {
      "id": "awkward",
      "name": "Awkward Moments",
      "emoji": "😬",
      "levels": {
        "easy": [
          {
            "topic": "Trying to walk away gracefully after saying bye to someone walking in the same direction",
            "relatedWords": [
              "pace",
              "sidewalk",
              "destination",
              "awkward",
              "companion",
              "detour"
            ]
          },
          {
            "topic": "Realizing you forgot someone's name 20 seconds after they introduced themselves",
            "relatedWords": [
              "handshake",
              "memory",
              "nickname",
              "amnesia",
              "buddy",
              "guilt"
            ]
          },
          {
            "topic": "Pushing a door with all your strength when it clearly says PULL",
            "relatedWords": [
              "handle",
              "glass",
              "physics",
              "strength",
              "spectators",
              "embarrassing"
            ]
          }
        ],
        "medium": [
          {
            "topic": "The panic of waving back at someone who was actually waving at the person behind you",
            "relatedWords": [
              "stranger",
              "pretend",
              "haircut",
              "disaster",
              "invisible",
              "hallway"
            ]
          },
          {
            "topic": "The 5-second silence after making a joke in a meeting that nobody laughed at",
            "relatedWords": [
              "crickets",
              "microphone",
              "cough",
              "punchline",
              "career",
              "apology"
            ]
          },
          {
            "topic": "The struggle of trying to quietly open a bag of chips in a dead silent room",
            "relatedWords": [
              "plastic",
              "crinkle",
              "decibels",
              "explosion",
              "sneak",
              "shame"
            ]
          }
        ],
        "hard": [
          {
            "topic": "The dread of being sung Happy Birthday to while having no idea where to look",
            "relatedWords": [
              "candles",
              "clapping",
              "agony",
              "frozen",
              "chorus",
              "eyeball"
            ]
          },
          {
            "topic": "Accidentally liking a 4-year-old photo on Instagram at 2 a.m.",
            "relatedWords": [
              "stalker",
              "thumb",
              "midnight",
              "investigation",
              "heartbeat",
              "panic"
            ]
          },
          {
            "topic": "Making accidental eye contact with someone through the gap in a public bathroom stall",
            "relatedWords": [
              "locking",
              "freeze",
              "creepy",
              "ceiling",
              "mortified",
              "escape"
            ]
          }
        ]
      }
    },
    "roast": {
      "id": "roast",
      "name": "Playful Roasts",
      "emoji": "🎯",
      "levels": {
        "easy": [
          {
            "topic": "People who leave their shopping cart in an empty parking space instead of returning it",
            "relatedWords": [
              "lazy",
              "civilization",
              "exercise",
              "wheels",
              "selfish",
              "judgment"
            ]
          },
          {
            "topic": "Anyone who unironically writes 'hope this email finds you well'",
            "relatedWords": [
              "inbox",
              "fake",
              "greeting",
              "formal",
              "corporate",
              "cliché"
            ]
          },
          {
            "topic": "People who take 15 items into the 10-items-or-less grocery line",
            "relatedWords": [
              "math",
              "audacity",
              "cashier",
              "cheating",
              "basket",
              "glare"
            ]
          }
        ],
        "medium": [
          {
            "topic": "People who walk slowly four-abreast on a crowded city sidewalk",
            "relatedWords": [
              "traffic",
              "parade",
              "blocking",
              "urgency",
              "barrier",
              "patience"
            ]
          },
          {
            "topic": "Gym bros who grunt loudly while lifting five-pound dumbbells",
            "relatedWords": [
              "mirror",
              "audience",
              "biceps",
              "soundtrack",
              "dramatic",
              "workout"
            ]
          },
          {
            "topic": "People who reply to a detailed emotional paragraph with just a thumbs-up emoji",
            "relatedWords": [
              "heartless",
              "typing",
              "effort",
              "disrespect",
              "friendship",
              "apathy"
            ]
          }
        ],
        "hard": [
          {
            "topic": "Influencers filming dance videos in airport security lines",
            "relatedWords": [
              "terminal",
              "baggage",
              "cringe",
              "handcuffs",
              "flight",
              "embarrassment"
            ]
          },
          {
            "topic": "People who put 'entrepreneur' in their bio after buying one crypto coin",
            "relatedWords": [
              "billionaire",
              "resume",
              "investor",
              "delusion",
              "lamborghini",
              "scam"
            ]
          },
          {
            "topic": "Couples who share a joint Facebook account in the current year",
            "relatedWords": [
              "trust",
              "paranoia",
              "investigation",
              "identity",
              "suspicious",
              "profile"
            ]
          }
        ]
      }
    },
    "conspiracy": {
      "id": "conspiracy",
      "name": "Fun Conspiracies",
      "emoji": "👽",
      "levels": {
        "easy": [
          {
            "topic": "The conspiracy theory that pigeons are government surveillance drones",
            "relatedWords": [
              "battery",
              "feather",
              "rooftop",
              "statue",
              "camera",
              "signal"
            ]
          },
          {
            "topic": "Why GPS intentionally sends you into traffic jams just to test your patience",
            "relatedWords": [
              "satellite",
              "algorithm",
              "detour",
              "robot",
              "compass",
              "rage"
            ]
          }
        ],
        "medium": [
          {
            "topic": "Printers only run out of cyan ink when you have an urgent interview in 10 minutes",
            "relatedWords": [
              "cartridge",
              "sensor",
              "hardware",
              "evil",
              "deadline",
              "sabotage"
            ]
          },
          {
            "topic": "Socks go missing in the dryer because washing machines are interdimensional portals",
            "relatedWords": [
              "wormhole",
              "physics",
              "universe",
              "laundry",
              "lint",
              "teleport"
            ]
          }
        ],
        "hard": [
          {
            "topic": "Dentists recommend toothpaste brands that keep you coming back for cavities",
            "relatedWords": [
              "enamel",
              "sugar",
              "profit",
              "monopoly",
              "appointment",
              "fluoride"
            ]
          },
          {
            "topic": "Bedtime thoughts exist solely to stop humans from achieving optimal rest",
            "relatedWords": [
              "insomnia",
              "regret",
              "midnight",
              "caffeine",
              "replay",
              "exhaustion"
            ]
          }
        ]
      }
    }
  },
  "words": [
    "banana",
    "spaghetti",
    "ninja",
    "suspicious",
    "dinosaur",
    "umbrella",
    "potato",
    "chaos",
    "microwave",
    "majestic",
    "slippery",
    "secret",
    "champion",
    "bubble",
    "dangerous",
    "superstar",
    "nightmare",
    "legendary",
    "explosive",
    "awkward",
    "magic",
    "genius",
    "frozen",
    "magnetic",
    "mystery",
    "treasure",
    "disaster",
    "spicy",
    "chocolate",
    "invisible",
    "galaxy",
    "adventure",
    "monster",
    "detective",
    "cactus",
    "spaceship",
    "diamond",
    "puzzle",
    "whisper",
    "miracle",
    "butter",
    "popcorn",
    "thunder",
    "chemistry",
    "recipe",
    "designer",
    "runway",
    "portal",
    "stealth",
    "telescope",
    "monologue",
    "notification",
    "blanket",
    "candles",
    "traffic",
    "pillow",
    "battery"
  ]
};
let gameData = GAME_DATA;
let currentCategory = 'all';
let currentLevel = 'all';
let currentTopic = '';
let currentWord = '';
let currentTopicObj = null;

// Persistent Local Session Storage Key
const SESSION_STORAGE_KEY = 'secret_word_game_session_v2';

// Repetition Target & Count State
const REPEAT_STORAGE_KEY = 'secret_word_target_repeats';
let targetRepeats = parseInt(localStorage.getItem(REPEAT_STORAGE_KEY), 10) || 3;
let repeatCount = 0;

// Session & Reveal States
let isSessionActive = false;
let isWordPermanentlyRevealed = false;

// Minimum Speaking Time State & LocalStorage
const TIMER_STORAGE_KEY = 'secret_word_timer_duration';
let minTimeTarget = parseInt(localStorage.getItem(TIMER_STORAGE_KEY), 10) || 150; // default 2:30 (150s)
let timerRemaining = minTimeTarget;
let overtimeSeconds = 0;
let isMinTimeMet = false;
let totalSpokenSeconds = 0;
let timerInterval = null;
let isTimerRunning = false;

// Audio Context for Chimes (Web Audio API - Zero dependencies)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.3 }, // C5
      { freq: 659.25, time: 0.15, dur: 0.3 }, // E5
      { freq: 783.99, time: 0.30, dur: 0.3 }, // G5
      { freq: 1046.50, time: 0.45, dur: 0.8 } // C6
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });
  } catch (e) {
    console.error('Audio play error:', e);
  }
}

// Free Web Speech Recognition (Built into browsers, 0 AI tokens, 0 API keys)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListeningDesired = false;    // User/session intent: mic should remain always on
let isRecognitionActive = false;   // Hardware state
let isMicMutedByUser = false;      // Manual mute toggle
let micRestartTimeout = null;
let lastDetectedTimestamp = 0;

function updateMicBadge(isActive, message) {
  if (!speechIndicator) return;
  speechIndicator.style.display = 'inline-flex';
  if (isActive) {
    speechIndicator.textContent = message || '🎙️ Mic: Always ON';
    speechIndicator.classList.add('mic-active');
    speechIndicator.classList.remove('mic-muted');
    speechIndicator.setAttribute('aria-pressed', 'true');
  } else {
    speechIndicator.textContent = message || '🎙️ Mic: OFF';
    speechIndicator.classList.remove('mic-active');
    speechIndicator.classList.add('mic-muted');
    speechIndicator.setAttribute('aria-pressed', 'false');
  }
}

function initSpeechRecognition() {
  if (!SpeechRecognition) {
    if (speechIndicator) {
      speechIndicator.style.display = 'inline-flex';
      speechIndicator.textContent = '🎙️ Tap Dots (No Mic)';
      speechIndicator.classList.add('mic-muted');
    }
    return;
  }

  try {
    recognition = new SpeechRecognition();
    // Continuous MUST always be true so the browser never closes the mic after a sentence
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecognitionActive = true;
      if (!isMicMutedByUser && isListeningDesired) {
        updateMicBadge(true, '🎙️ Mic: Always ON');
      }
    };

    recognition.onaudiostart = () => {
      isRecognitionActive = true;
    };

    recognition.onresult = (event) => {
      if (!isSessionActive || !currentWord || isMicMutedByUser) return;

      const now = Date.now();
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        const target = currentWord.toLowerCase().trim();

        // Exact word boundary matching (e.g. \bbanana\b or \bbananas\b)
        const regex = new RegExp(`\\b${target}(s|es|ed|ing)?\\b`, 'i');
        if (regex.test(transcript)) {
          // Debounce to prevent multiple counts from the same spoken sentence
          if (now - lastDetectedTimestamp > 2000) {
            lastDetectedTimestamp = now;
            incrementWordCount();
          }
        }
      }
    };

    recognition.onerror = (event) => {
      // 'no-speech' or 'aborted' are normal pauses in speech; keep listening!
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListeningDesired = false;
        isRecognitionActive = false;
        updateMicBadge(false, '🎙️ Mic Denied (Tap dots)');
        return;
      }
      if (event.error === 'audio-capture') {
        isListeningDesired = false;
        isRecognitionActive = false;
        updateMicBadge(false, '🎙️ No Mic Found');
        return;
      }
    };

    recognition.onend = () => {
      isRecognitionActive = false;

      // Keep it ALWAYS ON while speaking time is active
      if (isListeningDesired && !isMicMutedByUser && isSessionActive && isTimerRunning) {
        restartRecognition();
      } else if (isMicMutedByUser) {
        updateMicBadge(false, '🎙️ Mic: OFF (Tap dots)');
      }
    };
  } catch (err) {
    console.warn('Speech recognition setup error:', err);
  }
}

function restartRecognition() {
  if (!isListeningDesired || isMicMutedByUser || !isSessionActive || !isTimerRunning) return;
  clearTimeout(micRestartTimeout);

  // Immediate restart to prevent phone from releasing microphone and dropping the green indicator
  try {
    recognition.start();
    isRecognitionActive = true;
  } catch (err) {
    // If browser needs a micro-tick to recycle, restart within 25ms
    micRestartTimeout = setTimeout(() => {
      if (isListeningDesired && !isMicMutedByUser && isSessionActive && isTimerRunning) {
        try {
          recognition.start();
          isRecognitionActive = true;
        } catch (e) {
          try {
            // Re-instantiate if instance died
            initSpeechRecognition();
            if (recognition) {
              recognition.start();
              isRecognitionActive = true;
            }
          } catch (e2) { }
        }
      }
    }, 25);
  }
}

function startListening() {
  if (!recognition || isMicMutedByUser) return;
  isListeningDesired = true;
  clearTimeout(micRestartTimeout);
  updateMicBadge(true, '🎙️ Mic: Always ON');

  // Resume Web Audio Context if suspended
  try {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) { }

  if (!isRecognitionActive) {
    try {
      recognition.start();
      isRecognitionActive = true;
    } catch (e) {
      restartRecognition();
    }
  }
}

function stopListening() {
  isListeningDesired = false;
  clearTimeout(micRestartTimeout);
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) { }
  }
  isRecognitionActive = false;
  if (!isMicMutedByUser) {
    updateMicBadge(false, '🎙️ Mic: Paused');
  }
}

function toggleMicManual() {
  if (!SpeechRecognition) {
    alert('Speech recognition is not supported on this browser. You can manually tap the 1, 2, 3 repetition dots to count!');
    return;
  }

  isMicMutedByUser = !isMicMutedByUser;
  if (isMicMutedByUser) {
    // User wants mic completely off
    stopListening();
    updateMicBadge(false, '🎙️ Mic: OFF (Tap dots)');
  } else {
    // User wants mic on
    if (isSessionActive && isTimerRunning) {
      startListening();
    } else {
      updateMicBadge(true, '🎙️ Mic: Always ON (Ready)');
    }
  }
}

// DOM Elements
const topicDisplay = document.getElementById('topic-display');
const wordDisplay = document.getElementById('word-display');
const wordCardTag = document.getElementById('word-card-tag');
const hintTargetCount = document.getElementById('hint-target-count');
const peekContainer = document.getElementById('peek-container');
const peekHidden = document.getElementById('peek-hidden');
const peekRevealed = document.getElementById('peek-revealed');

const targetRepVal = document.getElementById('target-rep-val');
const btnRepMinus = document.getElementById('btn-rep-minus');
const btnRepPlus = document.getElementById('btn-rep-plus');
const repeatTrackerWrap = document.getElementById('repeat-tracker-wrap');
const trackerDotsContainer = document.getElementById('tracker-dots');
const revealedScoreBanner = document.getElementById('revealed-score-banner');
const revealedScoreText = document.getElementById('revealed-score-text');

const btnSpinAll = document.getElementById('btn-spin-all');
const btnRerollTopic = document.getElementById('btn-reroll-topic');
const btnRerollWord = document.getElementById('btn-reroll-word');
const statusBar = document.getElementById('session-status-bar');

const filterPills = document.querySelectorAll('.pill');
const levelChips = document.querySelectorAll('.level-chip');
const speechIndicator = document.getElementById('speech-indicator');

const btnRevealAudience = document.getElementById('btn-reveal-audience');
const revealModal = document.getElementById('reveal-modal');
const modalWordText = document.getElementById('modal-word-text');
const modalRepeatCountText = document.getElementById('modal-repeat-count-text');
const modalTotalTimeText = document.getElementById('modal-total-time-text');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnModalNext = document.getElementById('btn-modal-next');

// Timer DOM
const timerLabelStatus = document.getElementById('timer-label-status');
const timerText = document.getElementById('timer-text');
const minTimeBadge = document.getElementById('min-time-badge');
const btnTimerStart = document.getElementById('btn-timer-start');
const btnTimerReset = document.getElementById('btn-timer-reset');
const timeChips = document.querySelectorAll('.time-chip');
const inputCustomMin = document.getElementById('input-custom-min');
const inputCustomSec = document.getElementById('input-custom-sec');
const btnSaveCustomTime = document.getElementById('btn-save-custom-time');

// App Initialization with Local Session Persistence
async function init() {
  initSpeechRecognition();
  if (speechIndicator) {
    speechIndicator.addEventListener('click', toggleMicManual);
  }
  loadSavedTimer();
  updateTargetRepUI();
  renderTrackerDots();

  // 1. Fetch latest server data so topics and categories stay up-to-date with server
  try {
    const res = await fetch('./data/game_data.json');
    if (res.ok) gameData = await res.json();
  } catch (e) { }

  // 2. Restore locally saved session (topic, word, timings, counts)
  const restored = loadSavedSessionState();
  if (!restored) {
    rollNewCombo();
  }
}

// Local Session Persistence: Saves counts, timings, word, and topic locally
function saveSessionState() {
  try {
    const state = {
      topic: currentTopic,
      word: currentWord,
      topicObj: currentTopicObj,
      category: currentCategory,
      level: currentLevel,
      targetRepeats: targetRepeats,
      repeatCount: repeatCount,
      minTimeTarget: minTimeTarget,
      timerRemaining: timerRemaining,
      overtimeSeconds: overtimeSeconds,
      totalSpokenSeconds: totalSpokenSeconds,
      isMinTimeMet: isMinTimeMet,
      isSessionActive: isSessionActive,
      isWordPermanentlyRevealed: isWordPermanentlyRevealed,
      savedAt: Date.now()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save session state:', err);
  }
}

function loadSavedSessionState() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (!state || !state.topic || !state.word) return false;

    // 1. Restore Category and Level
    if (state.category) {
      currentCategory = state.category;
      filterPills.forEach(p => {
        p.classList.toggle('active', p.dataset.cat === currentCategory);
      });
    }

    if (state.level) {
      currentLevel = state.level;
      levelChips.forEach(c => {
        c.classList.toggle('active', c.dataset.level === currentLevel);
      });
    }

    // 2. Restore Topic & Word
    currentTopic = state.topic;
    currentWord = state.word;
    currentTopicObj = state.topicObj || { topic: currentTopic, relatedWords: [currentWord.toLowerCase()] };

    topicDisplay.textContent = currentTopic;
    wordDisplay.textContent = currentWord.toUpperCase();
    modalWordText.textContent = currentWord.toUpperCase();

    // 3. Restore Target Repetitions & Spoken Count
    if (typeof state.targetRepeats === 'number' && state.targetRepeats >= 1) {
      targetRepeats = state.targetRepeats;
    }
    if (typeof state.repeatCount === 'number' && state.repeatCount >= 0) {
      repeatCount = state.repeatCount;
    }
    updateTargetRepUI();
    renderTrackerDots();
    updateDotVisuals();

    // 4. Restore Timings
    if (typeof state.minTimeTarget === 'number') minTimeTarget = state.minTimeTarget;
    if (typeof state.timerRemaining === 'number') timerRemaining = state.timerRemaining;
    if (typeof state.overtimeSeconds === 'number') overtimeSeconds = state.overtimeSeconds;
    if (typeof state.totalSpokenSeconds === 'number') totalSpokenSeconds = state.totalSpokenSeconds;
    isMinTimeMet = !!state.isMinTimeMet;

    updateTimerDisplay();
    highlightActiveChip(minTimeTarget);
    updateCustomInputs(minTimeTarget);

    // 5. Restore Session & Reveal States
    isWordPermanentlyRevealed = !!state.isWordPermanentlyRevealed;
    isSessionActive = !!state.isSessionActive;

    if (isWordPermanentlyRevealed) {
      peekContainer.classList.add('unrevealed');
      peekHidden.style.display = 'none';
      peekRevealed.style.display = 'block';
      wordCardTag.textContent = 'SECRET WORD (REVEALED)';
      revealedScoreBanner.style.display = 'block';
      const achieved = repeatCount >= targetRepeats;
      revealedScoreText.textContent = `Repeated ${repeatCount} of ${targetRepeats} times (${achieved ? 'Target Achieved! 🎉' : 'Target Missed ⚠️'})`;
      repeatTrackerWrap.style.display = 'flex';
      setSessionActive(false);
    } else if (isSessionActive) {
      repeatTrackerWrap.style.display = 'flex';
      setSessionActive(true);
      btnTimerStart.textContent = isMinTimeMet ? 'Finish Speech' : 'Resume';
      btnTimerStart.classList.remove('running');
    } else {
      repeatTrackerWrap.style.display = 'none';
      setSessionActive(false);
    }

    return true;
  } catch (err) {
    console.warn('Could not load saved session state:', err);
    return false;
  }
}

function loadSavedTimer() {
  const saved = parseInt(localStorage.getItem(TIMER_STORAGE_KEY), 10);
  if (saved && !isNaN(saved)) {
    minTimeTarget = saved;
  } else {
    minTimeTarget = 150; // default 2:30
  }
  timerRemaining = minTimeTarget;
  updateTimerDisplay();
  highlightActiveChip(minTimeTarget);
  updateCustomInputs(minTimeTarget);
}

function saveMinTimeTarget(seconds) {
  minTimeTarget = Math.max(10, seconds);
  localStorage.setItem(TIMER_STORAGE_KEY, minTimeTarget);
  resetTimer();
  highlightActiveChip(minTimeTarget);
  updateCustomInputs(minTimeTarget);
  saveSessionState();
}

function updateCustomInputs(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (inputCustomMin) inputCustomMin.value = m;
  if (inputCustomSec) inputCustomSec.value = s < 10 ? `0${s}` : s;
}

function highlightActiveChip(seconds) {
  timeChips.forEach(chip => {
    if (parseInt(chip.dataset.time, 10) === seconds) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// Target Repetitions UI & Dots
function updateTargetRepUI() {
  if (targetRepVal) targetRepVal.textContent = targetRepeats;
  if (hintTargetCount) hintTargetCount.textContent = `${targetRepeats} times`;
  const targetDisplay = document.getElementById('spoken-target-display');
  if (targetDisplay) targetDisplay.textContent = targetRepeats;
  localStorage.setItem(REPEAT_STORAGE_KEY, targetRepeats);
}

function renderTrackerDots() {
  if (!trackerDotsContainer) return;
  trackerDotsContainer.innerHTML = '';
  for (let i = 1; i <= targetRepeats; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `dot ${i <= repeatCount ? 'done' : ''}`;
    dot.dataset.count = i;
    dot.setAttribute('aria-label', `Spoken ${i} times`);
    dot.textContent = i;
    dot.addEventListener('click', toggleDot);
    trackerDotsContainer.appendChild(dot);
  }
}

function setTargetRepeats(newVal) {
  if (isSessionActive) return; // Do not alter while session is running
  targetRepeats = Math.min(10, Math.max(1, newVal));
  updateTargetRepUI();
  if (repeatCount > targetRepeats) repeatCount = targetRepeats;
  renderTrackerDots();
  saveSessionState();
}

btnRepMinus.addEventListener('click', () => setTargetRepeats(targetRepeats - 1));
btnRepPlus.addEventListener('click', () => setTargetRepeats(targetRepeats + 1));

// Roll Mechanics: Subtle relation between topic and word with Category & Level filtering
function getRandomTopicObj(cat = 'all', level = 'all') {
  let pool = [];
  const categories = gameData.categories || {};

  // 1. If gameData uses modern category + level structure
  if (Object.keys(categories).length > 0) {
    const targetCats = (cat === 'all')
      ? Object.values(categories)
      : [categories[cat]].filter(Boolean);

    targetCats.forEach(c => {
      if (!c.levels) return;
      if (level === 'all') {
        Object.values(c.levels).forEach(lvlList => {
          if (Array.isArray(lvlList)) pool = pool.concat(lvlList);
        });
      } else if (c.levels[level]) {
        pool = pool.concat(c.levels[level]);
      }
    });
  }
  // 2. Fallback if gameData has flat topics object
  else if (gameData.topics) {
    if (cat === 'all') {
      Object.values(gameData.topics).forEach(list => { pool = pool.concat(list); });
    } else if (gameData.topics[cat]) {
      pool = gameData.topics[cat];
    } else {
      pool = gameData.topics.fun || [];
    }
  }

  if (pool.length === 0) {
    Object.values(categories).forEach(c => {
      if (c && c.levels) {
        Object.values(c.levels).forEach(lvlList => {
          if (Array.isArray(lvlList)) pool = pool.concat(lvlList);
        });
      }
    });
  }

  const item = pool[Math.floor(Math.random() * pool.length)];
  if (typeof item === 'string') {
    return { topic: item, relatedWords: [] };
  }
  return item;
}

function getRandomWordForTopic(topicObj, excludeWord = '') {
  let candidates = [];
  if (topicObj && topicObj.relatedWords && topicObj.relatedWords.length > 0) {
    candidates = topicObj.relatedWords;
  } else {
    candidates = (gameData && gameData.words) ? gameData.words : (GAME_DATA.words || ['SECRET']);
  }
  if (excludeWord && candidates.length > 1) {
    const filtered = candidates.filter(w => w.toLowerCase() !== excludeWord.toLowerCase());
    if (filtered.length > 0) candidates = filtered;
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function rollNewCombo() {
  if (isTimerRunning) pauseTimer();
  setSessionActive(false);

  // Reset revealed state
  isWordPermanentlyRevealed = false;
  peekContainer.classList.remove('unrevealed');
  hideWord();
  wordCardTag.textContent = 'SECRET WORD (HOLD TO PEEK)';
  revealedScoreBanner.style.display = 'none';

  // Hide the Times Spoken tracker on fresh combo
  repeatTrackerWrap.style.display = 'none';

  currentTopicObj = getRandomTopicObj(currentCategory, currentLevel);
  currentTopic = currentTopicObj.topic;
  currentWord = getRandomWordForTopic(currentTopicObj);

  topicDisplay.textContent = currentTopic;
  wordDisplay.textContent = currentWord.toUpperCase();
  modalWordText.textContent = currentWord.toUpperCase();

  resetRepeatDots();
  renderTrackerDots();
  updateTargetRepUI();
  resetTimer();
  saveSessionState();
}

function rerollTopic() {
  if (isTimerRunning) return; // Only lock while actively speaking
  currentTopicObj = getRandomTopicObj(currentCategory, currentLevel);
  currentTopic = currentTopicObj.topic;
  topicDisplay.textContent = currentTopic;

  // Re-roll related word matching the new topic
  currentWord = getRandomWordForTopic(currentTopicObj);
  wordDisplay.textContent = currentWord.toUpperCase();
  modalWordText.textContent = currentWord.toUpperCase();
  resetRepeatDots();
  saveSessionState();
}

function rerollWord() {
  if (isTimerRunning) return; // Only lock while actively speaking
  // Pick another slightly-related word for the active topic
  currentWord = getRandomWordForTopic(currentTopicObj, currentWord);
  wordDisplay.textContent = currentWord.toUpperCase();
  modalWordText.textContent = currentWord.toUpperCase();
  resetRepeatDots();
  saveSessionState();
}

// Lock / Unlock Mechanism
function setSessionActive(active) {
  isSessionActive = active;
  btnRepMinus.disabled = active && isTimerRunning;
  btnRepPlus.disabled = active && isTimerRunning;

  if (active && isTimerRunning) {
    btnSpinAll.disabled = true;
    btnRerollTopic.disabled = true;
    btnRerollWord.disabled = true;
    filterPills.forEach(p => p.disabled = true);
    levelChips.forEach(c => c.disabled = true);
    statusBar.style.display = 'flex';
  } else {
    btnSpinAll.disabled = false;
    btnRerollTopic.disabled = false;
    btnRerollWord.disabled = false;
    filterPills.forEach(p => p.disabled = false);
    levelChips.forEach(c => c.disabled = false);
    statusBar.style.display = (active && isTimerRunning) ? 'flex' : 'none';
  }
}

// Press & Hold to Peek Word (Mobile & Desktop)
function showWord() {
  if (isWordPermanentlyRevealed) return;
  peekHidden.style.display = 'none';
  peekRevealed.style.display = 'block';
  peekContainer.classList.add('held');
}

function hideWord() {
  if (isWordPermanentlyRevealed) return;
  peekHidden.style.display = 'flex';
  peekRevealed.style.display = 'none';
  peekContainer.classList.remove('held');
}

// Desktop Mouse Events
peekContainer.addEventListener('mousedown', showWord);
peekContainer.addEventListener('mouseup', hideWord);
peekContainer.addEventListener('mouseleave', hideWord);

// Touch Events for Mobile (with contextmenu prevention)
peekContainer.addEventListener('touchstart', (e) => {
  if (!isWordPermanentlyRevealed) {
    e.preventDefault();
    showWord();
  }
}, { passive: false });

peekContainer.addEventListener('touchend', hideWord);
peekContainer.addEventListener('touchcancel', hideWord);
peekContainer.addEventListener('contextmenu', (e) => e.preventDefault());

// Repeat Tracker Logic
function incrementWordCount() {
  if (repeatCount < targetRepeats) {
    repeatCount++;
    updateDotVisuals();
    saveSessionState();
  }
}

function toggleDot(e) {
  const count = parseInt(e.target.dataset.count, 10);
  if (e.target.classList.contains('done')) {
    repeatCount = count - 1;
  } else {
    repeatCount = count;
  }
  updateDotVisuals();
  saveSessionState();
}

function updateDotVisuals() {
  if (trackerDotsContainer) {
    const dots = trackerDotsContainer.querySelectorAll('.dot');
    dots.forEach(dot => {
      const dotNum = parseInt(dot.dataset.count, 10);
      if (dotNum <= repeatCount) {
        dot.classList.add('done');
      } else {
        dot.classList.remove('done');
      }
    });
  }

  const spokenDisplay = document.getElementById('spoken-count-display');
  if (spokenDisplay) spokenDisplay.textContent = repeatCount;
}

function resetRepeatDots() {
  repeatCount = 0;
  updateDotVisuals();
}

// Minimum Speaking Time Logic (User can speak as much as they want!)
function updateTimerDisplay() {
  if (!isMinTimeMet) {
    // Phase 1: Counting down to minimum threshold
    const m = Math.floor(timerRemaining / 60);
    const s = timerRemaining % 60;
    timerText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    timerText.classList.remove('overtime');
    timerLabelStatus.textContent = '⏱ Min Time:';
    minTimeBadge.style.display = 'none';
  } else {
    // Phase 2: Minimum reached! Showing total time / overtime so speaker finishes comfortably
    const totalSecs = minTimeTarget + overtimeSeconds;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    timerText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    timerText.classList.add('overtime');
    timerLabelStatus.textContent = '🎙 Speaking:';
    minTimeBadge.style.display = 'inline-block';
  }
}

function formatDuration(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function toggleTimer() {
  getAudioContext();

  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  isTimerRunning = true;
  setSessionActive(true); // Lock rerolls!

  // Ensure dots & count are rendered and synced immediately when speaker starts!
  renderTrackerDots();
  updateDotVisuals();
  updateTargetRepUI();
  repeatTrackerWrap.style.display = 'flex';

  btnTimerStart.textContent = isMinTimeMet ? 'Finish Speech' : 'Pause';
  btnTimerStart.classList.add('running');
  if (isMinTimeMet) btnTimerStart.classList.add('met');
  startListening();
  saveSessionState();

  timerInterval = setInterval(() => {
    totalSpokenSeconds++;

    if (!isMinTimeMet) {
      timerRemaining--;
      if (timerRemaining <= 0) {
        // Hit the minimum time threshold!
        isMinTimeMet = true;
        playCompletionChime(); // Play the celebration chime!
        btnTimerStart.textContent = 'Finish Speech';
        btnTimerStart.classList.add('met');
      }
    } else {
      // Continuing indefinitely - user takes as long as they want!
      overtimeSeconds++;
    }

    updateTimerDisplay();
    saveSessionState();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  btnTimerStart.textContent = isMinTimeMet ? 'Finish Speech' : 'Resume';
  btnTimerStart.classList.remove('running');
  stopListening();
  setSessionActive(isSessionActive);
  saveSessionState();
}

function resetTimer() {
  pauseTimer();
  isMinTimeMet = false;
  overtimeSeconds = 0;
  totalSpokenSeconds = 0;
  timerRemaining = minTimeTarget;
  btnTimerStart.textContent = 'Start';
  btnTimerStart.classList.remove('met');
  updateTimerDisplay();
  setSessionActive(false); // Unlock rerolls!

  // Hide the tracker again until the next round starts
  if (!isWordPermanentlyRevealed) {
    repeatTrackerWrap.style.display = 'none';
  }
  saveSessionState();
}

// Presets & Custom Time Handlers
timeChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const secs = parseInt(chip.dataset.time, 10);
    saveMinTimeTarget(secs);
  });
});

if (btnSaveCustomTime) {
  btnSaveCustomTime.addEventListener('click', () => {
    const min = parseInt(inputCustomMin.value, 10) || 0;
    const sec = parseInt(inputCustomSec.value, 10) || 0;
    const total = min * 60 + sec;
    if (total > 0) {
      saveMinTimeTarget(total);
    }
  });
}

// Category Pills
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    if (isTimerRunning) return; // Only lock while actively speaking
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCategory = pill.dataset.cat;
    rerollTopic();
  });
});

// Level Chips
levelChips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (isTimerRunning) return; // Only lock while actively speaking
    levelChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentLevel = chip.dataset.level;
    rerollTopic();
  });
});

// Reveal Word & Repetitions to Audience
function revealToAudience() {
  // Stop speaking session
  if (isTimerRunning) pauseTimer();

  // 1. Permanently unreveal the word on the card
  isWordPermanentlyRevealed = true;
  peekContainer.classList.add('unrevealed');
  peekHidden.style.display = 'none';
  peekRevealed.style.display = 'block';
  wordCardTag.textContent = 'SECRET WORD (REVEALED)';

  // Ensure tracker is visible on reveal so audience sees the dots
  repeatTrackerWrap.style.display = 'flex';

  // 2. Display score banner on the card
  const achieved = repeatCount >= targetRepeats;
  const statusMsg = achieved
    ? `🎉 Target Achieved: Spoken ${repeatCount} of ${targetRepeats} times!`
    : `⚠️ Target Missed: Spoken ${repeatCount} of ${targetRepeats} times (${targetRepeats - repeatCount} short)`;

  revealedScoreText.textContent = statusMsg;
  revealedScoreBanner.style.display = 'block';

  // 3. Populate and show modal with word, repetition score, and total speaking time
  modalWordText.textContent = currentWord.toUpperCase();
  modalRepeatCountText.textContent = `${repeatCount} of ${targetRepeats} times ${achieved ? '(Target Met! 🎉)' : ''}`;
  modalTotalTimeText.textContent = formatDuration(totalSpokenSeconds || minTimeTarget - timerRemaining);
  revealModal.style.display = 'flex';
  saveSessionState();
}

btnRevealAudience.addEventListener('click', revealToAudience);

btnCloseModal.addEventListener('click', () => {
  revealModal.style.display = 'none';
});

btnModalNext.addEventListener('click', () => {
  revealModal.style.display = 'none';
  setSessionActive(false);
  rollNewCombo();
});

// Global Button Listeners
btnSpinAll.addEventListener('click', rollNewCombo);
btnRerollTopic.addEventListener('click', rerollTopic);
btnRerollWord.addEventListener('click', rerollWord);

btnTimerStart.addEventListener('click', toggleTimer);
btnTimerReset.addEventListener('click', resetTimer);

// Run on page load immediately if DOM ready, or wait for event
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
