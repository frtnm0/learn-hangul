import React, { useState, useEffect } from 'react'

// Fisher–Yates shuffle for robust randomness
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeQuestions(items, TOTAL) {
  if (!items || items.length === 0) return []
  const result = []
  // create a shuffled pool that cycles through all items before repeating
  const pool = []
  while (pool.length < TOTAL) {
    pool.push(...shuffle(items))
  }
  pool.length = TOTAL // trim to exactly TOTAL

  for (let i = 0; i < TOTAL; i++) {
    const correct = pool[i]
    const othersPool = items.filter(p => p.name !== correct.name)
    const others = shuffle(othersPool).slice(0, Math.min(2, othersPool.length))
    const options = shuffle([correct, ...others])
    result.push({ correct, options })
  }
  return result
}

export default function Quiz({ items, onBack }) {
  const TOTAL = 20
  const [questions, setQuestions] = useState(() => makeQuestions(items, TOTAL))

  // regenerate when items change
  useEffect(() => {
    setQuestions(makeQuestions(items, TOTAL))
  }, [items])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)

  function redo() {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setQuestions(makeQuestions(items, TOTAL))
  }

  if (index >= TOTAL) {
    return (
      <div className="container">
        <div className="card result">
          <h2>Finished</h2>
          <p className="big">{score} / {TOTAL}</p>
          <div className="controls">
            <button onClick={redo}>Redo</button>
            <button onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[index]

  if (!q) return <div className="container"><div className="card">Loading...</div></div>

  function handleChoose(opt) {
    if (selected) return
    setSelected(opt)
    if (opt.name === q.correct.name) setScore(s => s + 1)
  }

  function next() {
    setSelected(null)
    if (index + 1 < TOTAL) setIndex(i => i + 1)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="top">
          <div>Question {index + 1} / {TOTAL}</div>
          <div>Score: {score}</div>
        </div>

        <div className="character big">{q.correct.char}</div>

        <div className="options">
          {q.options.map((opt, i) => {
            const isSelected = selected && selected.name === opt.name
            const isCorrect = opt.name === q.correct.name
            let cls = 'opt'
            if (selected) {
              if (isCorrect) cls += ' correct'
              else if (isSelected) cls += ' wrong'
            }
            return (
              <button key={i} className={cls} onClick={() => handleChoose(opt)}>
                <div style={{fontWeight:600}}>{opt.name}</div>
                {opt.example && <div style={{fontSize:'0.85rem',marginTop:6,color:'var(--muted)'}}>{opt.example}</div>}
              </button>
            )
          })}
        </div>

        <div className="controls">
          <button onClick={() => { if (index + 1 < TOTAL) next(); else setIndex(TOTAL) }} disabled={!selected}>
            {index + 1 < TOTAL ? 'Next' : 'Finish'}
          </button>
          <button onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  )
}
