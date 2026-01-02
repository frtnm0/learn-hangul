import React, { useState, useMemo } from 'react'

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5)
}

export default function Quiz({ items, onBack }) {
  const TOTAL = 20
  const pool = useMemo(() => shuffle(items), [items])
  const questions = useMemo(() => {
    const result = []
    for (let i = 0; i < TOTAL; i++) {
      const correct = pool[i % pool.length]
      // pick two other random names
      const others = shuffle(items.filter(p => p.name !== correct.name)).slice(0, 2)
      const options = shuffle([correct, ...others])
      result.push({ correct, options })
    }
    return result
  }, [items, pool])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)

  function redo() {
    setIndex(0)
    setScore(0)
    setSelected(null)
  }

  if (index >= TOTAL) {
    return (
      <div className="container">
        <div className="card result">
          <h2>Finished</h2>
          <p className="big">{score} / {TOTAL}</p>
          <div className="controls">
            <button onClick={redo}>Redo</button>
            <button onClick={onBack}>Back to Menu</button>
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
          <button onClick={onBack}>Menu</button>
        </div>
      </div>
    </div>
  )
}
