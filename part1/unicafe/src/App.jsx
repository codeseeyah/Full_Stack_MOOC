import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = (good - bad) / all || 0
  const positive = (good / all * 100) || 0

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button text="good" onClick={handleGoodClick} />
        <Button text="neutral" onClick={handleNeutralClick} />
        <Button text="bad" onClick={handleBadClick} />
      </div>
      <h1>statistics</h1>
      {all === 0 ?
        <p>No feedback given</p> :
        <table>
          <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={average.toFixed(2)} />
          <StatisticsLine text="positive" value={positive.toFixed(2) + ' %'} />
          </tbody>
        </table>
      }
    </div>
  )
}

export default App