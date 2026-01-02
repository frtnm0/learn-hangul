import React from 'react'

export default function Reviewer({ items = [], title = 'Review', onBack }) {
  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
  function speak(text){
    if (!hasTTS) {
      alert('Speech synthesis not supported in this browser')
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ko-KR'
    // stop any ongoing speech then speak
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  return (
    <main className="container">
      <div className="card">
        <div className="top">
          <h2>{title}</h2>
        </div>

        <p className="hint">Browse the characters and their romanizations (tap the 🔊 to hear pronunciation).</p>

        <div className="review-list">
          {items.map((it, i) => (
            <div key={i} className="review-item" title={it.example || ''}>
              <div className="review-content">
                <div className="review-head">
                  <div className="review-char">{it.char}</div>
                  <div className="review-name">{it.name}</div>
                </div>
                {it.example && <div className="review-example">{it.example}</div>}
              </div>
              <div className="review-actions">
                <button
                  className="play-btn"
                  onClick={(e) => { e.stopPropagation(); speak(it.char) }}
                  aria-label={`Play ${it.name}`}
                  disabled={!hasTTS}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',marginTop:16}}>
          <button onClick={onBack}>Menu</button>
        </div>
      </div>
    </main>
  )
}
