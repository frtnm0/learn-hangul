import React, { useState } from 'react'
import Quiz from './components/Quiz'
import Reviewer from './components/Reviewer'
import commonWords from './data/words_common_1000.json'
import shortWords from './data/words_short_1000.json'
import {
  vowels,
  consonants,
  vowels_single,
  vowels_double,
  consonants_single,
  consonants_double
} from './data/hangul'
import { useEffect } from 'react'

export default function App() {
  const [mode, setMode] = useState(null) // 'vowels' | 'consonants' | 'vowels_single' ...
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState('dark')

  // navigation helpers: use `navigate(next)` to go to `next` and remember current
  function navigate(next) {
    setHistory(h => [...h, mode])
    setMode(next)
  }

  function goBack() {
    setHistory(h => {
      if (!h || h.length === 0) {
        setMode(null)
        return []
      }
      const prev = h[h.length - 1]
      setMode(prev)
      return h.slice(0, -1)
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem('hp-theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('hp-theme', theme)
  }, [theme])

  // helper: compose Hangul syllable from initial consonant and vowel jamo
  const L_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  const V_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
  function composeHangul(Lchar, Vchar){
    const L = L_LIST.indexOf(Lchar)
    const V = V_LIST.indexOf(Vchar)
    const Lidx = L === -1 ? 11 : L // default to ㅇ
    const Vidx = V === -1 ? 0 : V
    const code = 0xAC00 + ((Lidx * 21) + Vidx) * 28
    return String.fromCharCode(code)
  }

  // generate syllable reviewers
  const syllables = {
    vowels_single: vowels_single.map(v => ({
      char: composeHangul('ㅇ', v.char),
      name: v.name,
      example: v.example
    })),
    vowels_double: vowels_double.map(v => ({
      char: composeHangul('ㅇ', v.char),
      name: v.name,
      example: v.example
    })),
    consonants_single: consonants_single.map(c => ({
      char: composeHangul(c.char, 'ㅏ'),
      name: c.name + 'a',
      example: c.example
    })),
    consonants_double: consonants_double.map(c => ({
      char: composeHangul(c.char, 'ㅏ'),
      name: c.name + 'a',
      example: c.example
    }))
  }

  // map generated wordlists into Quiz/Reviewer-friendly format
  const wordsCommonItems = (commonWords || []).map(w => ({ char: w.word, name: w.romanization || w.word, example: w.meaning || '' }))
  const wordsShortItems = (shortWords || []).map(w => ({ char: w.word, name: w.romanization || w.word, example: w.meaning || '' }))

  return (
    <div className="app" data-theme={theme}>
      <header className="header">
        <h1>Hangul Practice</h1>
        <div style={{position:'absolute',right:16,top:16}}>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{background:'transparent',color:'inherit',border:'none',cursor:'pointer'}}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Level 1: main menu */}
      {!mode && (
        <main className="container">
          <div className="card menu">
            <h2>Choose Category</h2>
            <div className="menu-buttons menu-level1">
              <button onClick={() => { navigate('submenu_vowels') }}>Vowels</button>
              <button onClick={() => { navigate('submenu_consonants') }}>Consonants</button>
              <button onClick={() => { navigate('submenu_syllables') }}>Syllables</button>
              <button onClick={() => { navigate('submenu_words') }}>Words</button>
            </div>
            <p className="hint">Choose a category to see practice and review options.</p>
          </div>
        </main>
      )}

      {/* Level 2: submenu for vowels */}
      {mode === 'submenu_vowels' && (
        <main className="container">
          <div className="card menu">
            <h2>Vowels</h2>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div></div>
              <button onClick={goBack} style={{background:'transparent',color:'inherit',border:'none',cursor:'pointer'}}>Back</button>
            </div>

            <div className="menu-sections">
              <div className="menu-section">
                <h3>Quiz</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('vowels_single')}>Vowels (single)</button>
                  <button onClick={() => navigate('vowels_double')}>Vowels (double)</button>
                </div>
              </div>
              <div className="menu-section">
                <h3>Review</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('review_vowels_single')}>Vowels (single)</button>
                  <button onClick={() => navigate('review_vowels_double')}>Vowels (double)</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Level 2: submenu for consonants */}
      {mode === 'submenu_consonants' && (
        <main className="container">
          <div className="card menu">
            <h2>Consonants</h2>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div></div>
              <button onClick={goBack} style={{background:'transparent',color:'inherit',border:'none',cursor:'pointer'}}>Back</button>
            </div>

            <div className="menu-sections">
              <div className="menu-section">
                <h3>Quiz</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('consonants_single')}>Consonants (single)</button>
                  <button onClick={() => navigate('consonants_double')}>Consonants (double)</button>
                </div>
              </div>
              <div className="menu-section">
                <h3>Review</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('review_consonants_single')}>Consonants (single)</button>
                  <button onClick={() => navigate('review_consonants_double')}>Consonants (double)</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Level 2: submenu for all */}
      {mode === 'submenu_syllables' && (
        <main className="container">
          <div className="card menu">
            <h2>Syllables</h2>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div></div>
              <button onClick={goBack} style={{background:'transparent',color:'inherit',border:'none',cursor:'pointer'}}>Back</button>
            </div>

            <div className="menu-sections">
              <div className="menu-section">
                <h3>Quiz</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('syllables_vowels_single_quiz')}>Vowel Syllables (single)</button>
                  <button onClick={() => navigate('syllables_vowels_double_quiz')}>Vowel Syllables (double)</button>
                  <button onClick={() => navigate('syllables_consonants_single_quiz')}>Consonant Syllables (single)</button>
                  <button onClick={() => navigate('syllables_consonants_double_quiz')}>Consonant Syllables (double)</button>
                </div>
              </div>

              <div className="menu-section">
                <h3>Review</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('syllables_vowels_single')}>Vowel Syllables (single)</button>
                  <button onClick={() => navigate('syllables_vowels_double')}>Vowel Syllables (double)</button>
                  <button onClick={() => navigate('syllables_consonants_single')}>Consonant Syllables (single)</button>
                  <button onClick={() => navigate('syllables_consonants_double')}>Consonant Syllables (double)</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Level 2: submenu for words */}
      {mode === 'submenu_words' && (
        <main className="container">
          <div className="card menu">
            <h2>Words</h2>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div></div>
              <button onClick={goBack} style={{background:'transparent',color:'inherit',border:'none',cursor:'pointer'}}>Back</button>
            </div>

            <div className="menu-sections">
              <div className="menu-section">
                <h3>Quiz</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('quiz_words_common')}>Common Words</button>
                  <button onClick={() => navigate('quiz_words_short')}>Short Words</button>
                </div>
              </div>

              <div className="menu-section">
                <h3>Practice</h3>
                <div className="menu-buttons">
                  <button onClick={() => navigate('review_words_common')}>Common Words</button>
                  <button onClick={() => navigate('review_words_short')}>Short Words</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {mode === 'vowels_single' && (
        <Quiz items={vowels_single} onBack={goBack} />
      )}

      {mode === 'vowels_double' && (
        <Quiz items={vowels_double} onBack={goBack} />
      )}

      {mode === 'consonants_single' && (
        <Quiz items={consonants_single} onBack={goBack} />
      )}

      {mode === 'consonants_double' && (
        <Quiz items={consonants_double} onBack={goBack} />
      )}

      {mode === 'review_vowels_single' && (
        <Reviewer items={vowels_single} title="Vowels — single" onBack={goBack} />
      )}

      {mode === 'review_vowels_double' && (
        <Reviewer items={vowels_double} title="Vowels — double" onBack={goBack} />
      )}

      {mode === 'review_consonants_single' && (
        <Reviewer items={consonants_single} title="Consonants — single" onBack={goBack} />
      )}

      {mode === 'review_consonants_double' && (
        <Reviewer items={consonants_double} title="Consonants — double" onBack={goBack} />
      )}

      {mode === 'syllables_vowels_single' && (
        <Reviewer items={syllables.vowels_single} title="Syllables — Vowels (single)" onBack={goBack} />
      )}

      {mode === 'syllables_vowels_double' && (
        <Reviewer items={syllables.vowels_double} title="Syllables — Vowels (double)" onBack={goBack} />
      )}

      {mode === 'syllables_consonants_single' && (
        <Reviewer items={syllables.consonants_single} title="Syllables — Consonants (single)" onBack={goBack} />
      )}

      {mode === 'syllables_consonants_double' && (
        <Reviewer items={syllables.consonants_double} title="Syllables — Consonants (double)" onBack={goBack} />
      )}

      {mode === 'syllables_vowels_single_quiz' && (
        <Quiz items={syllables.vowels_single} onBack={goBack} />
      )}

      {mode === 'syllables_vowels_double_quiz' && (
        <Quiz items={syllables.vowels_double} onBack={goBack} />
      )}

      {mode === 'syllables_consonants_single_quiz' && (
        <Quiz items={syllables.consonants_single} onBack={goBack} />
      )}

      {mode === 'syllables_consonants_double_quiz' && (
        <Quiz items={syllables.consonants_double} onBack={goBack} />
      )}

      {/* Words: quizzes and reviews */}
      {mode === 'quiz_words_common' && (
        <Quiz items={wordsCommonItems} onBack={goBack} />
      )}

      {mode === 'quiz_words_short' && (
        <Quiz items={wordsShortItems} onBack={goBack} />
      )}

      {mode === 'review_words_common' && (
        <Reviewer items={wordsCommonItems} title="Words — Common" onBack={goBack} />
      )}

      {mode === 'review_words_short' && (
        <Reviewer items={wordsShortItems} title="Words — Short" onBack={goBack} />
      )}

      <footer className="footer">
        <small>Simple Hangul practice — 20 Q</small>
      </footer>
    </div>
  )
}
