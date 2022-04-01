import { useState, useEffect } from 'react'
import GameDetails from './GameDetails'
import axios from 'axios'


export default function Profile({ spotifyToken, currentUser }) {
  const [form, setForm] = useState({
    email: currentUser.email,
    password: ''
  })
  const [artistSort, setArtistSort] = useState(null)
  const [scoreSort, setScoreSort] = useState(null)
  const [dateSort, setDateSort] = useState(null)
  const [msg, setMsg] = useState(null)
  const [gameHistory, setGameHistory] = useState([])
  const [passwordForm, setPasswordForm] = useState(false)
  const [artistList, setArtistList] = useState([])
  const [summary, setSummary] = useState([])
  const [showSummary, setShowSummary] = useState(true)
  const [showHistory, setShowHistory] = useState(true)

  const summaryDetails = () => {
    let newSummaryArray = []
    for (let i = 0; i < gameHistory.length; i++) {
      if (newSummaryArray.find(element => element.artistName === gameHistory[i].artistName) === undefined) {
        artistList.push(gameHistory[i].artistName)
        newSummaryArray.push({ artistName: gameHistory[i].artistName, gameCount: 0, easyGames: 0, medGames: 0, hardGames: 0, totalEasyScore: 0, totalMedScore: 0, totalHardScore: 0 })
      }
      const summaryToUpdate = newSummaryArray.find(element => element.artistName === gameHistory[i].artistName)
      summaryToUpdate.gameCount++
      if (gameHistory[i].difficulty === 'easy') {
        summaryToUpdate.easyGames++
        summaryToUpdate.totalEasyScore += gameHistory[i].score
      } else if (gameHistory[i].difficulty === 'medium') {
        summaryToUpdate.medGames++;
        summaryToUpdate.totalMedScore += gameHistory[i].score
      } else if (gameHistory[i].difficulty === 'hard') {
        summaryToUpdate.hardGames++;
        summaryToUpdate.totalHardScore += gameHistory[i].score
      }
      if (summaryToUpdate.easyGames > 0) {
        summaryToUpdate.avgEasyScore = summaryToUpdate.totalEasyScore / summaryToUpdate.easyGames
      }
      if (summaryToUpdate.medGames > 0) {
        summaryToUpdate.avgMedScore = summaryToUpdate.totalMedScore / summaryToUpdate.medGames
      }
      if (summaryToUpdate.hardGames > 0) {
        summaryToUpdate.avgHardScore = summaryToUpdate.totalHardScore / summaryToUpdate.hardGames
      }
      // overall avg score
      if (summaryToUpdate.easyGames === 0 && summaryToUpdate.medGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgHardScore) } else
        if (summaryToUpdate.easyGames === 0 && summaryToUpdate.hardGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgMedScore) } else
          if (summaryToUpdate.medGames === 0 && summaryToUpdate.hardGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore) } else
            if (summaryToUpdate.easyGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgMedScore + summaryToUpdate.avgHardScore) / 2 } else
              if (summaryToUpdate.medGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore) / 2 } else
                if (summaryToUpdate.hardGames === 0) { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore) / 2 } else {
                  { summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore + summaryToUpdate.avgHighScore) / 3 }
                }

      // code for weighted score or average score
      // if (summaryToUpdate.easyGames === 0 && summaryToUpdate.medGames === 0 && summaryToUpdate.hardGames === 0) {
      // } else if (summaryToUpdate.easyGames === 0 && summaryToUpdate.medGames === 0) {
      //   summaryToUpdate.weightedScore = (totalHardScore/hardGames)*.6
      // } else if (summaryToUpdate.easyGames === 0 && summaryToUpdate.hardGames === 0) {
      //   summaryToUpdate.weightedScore = (totalMedScore/medGames)*.30
      // } else if (summaryToUpdate.medGames === 0 && summaryToUpdate.hardGames === 0) {
      //   summaryToUpdate.weightedScore = (totalEasyScore/easyGames)*.10
      // } else if (summaryToUpdate.medGames === 0) {
      //   summaryToUpdate.weightedScore = (totalEasyScore/easyGames)*.16 +(totalHardScore/hardGames)*.84
      // } else if (summaryToUpdate.hardGames === 0) {
      //   summaryToUpdate.weightedScore = (totalEasyScore/easyGames)*.33 +(totalMedScore/medGames)*.66
      // } else if (summaryToUpdate.easyGames === 0) {
      //   summaryToUpdate.weightedScore = (totalEasyScore/easyGames)*.40 +(totalMedScore/medGames)*.60
      // }
    }
    newSummaryArray.sort((a, b) => {
      return b.score - a.score
    })
    setSummary(newSummaryArray)

  }

  // use useEffect to get data from the back
  useEffect(() => {
    (async () => {
      try {
        // get token for local storage
        const token = localStorage.getItem('jwt')
        // make the auth headers
        const options = {
          headers: {
            'Authorization': token
          }
        }
        // hit the auth locked endpoint
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/profile`, options)
        const gameArrayData = response.data.map(element => {
          return { gameId: element._id, artistName: element.artistName, artistId: element.artistId, score: element.score, difficulty: element.difficulty, songs: element.songsPlayed, date: new Date(element.createdAt) }
        })
        setGameHistory(gameArrayData)
        summaryDetails()

        // set the data from the server in state
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  useEffect(() => {
    summaryDetails()
  }, [gameHistory])

  // handle deleteGame button
  const deleteGame = async (gameObj) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/game/${gameObj.gameId}`)
    const indexOfDeletedGame = gameHistory.indexOf(gameHistory.find(element => element.gameId === gameObj.gameId))
    const updatedArray = gameHistory.slice()
    updatedArray.splice(indexOfDeletedGame, 1)
    setGameHistory(updatedArray)
  }

  const handleArtistSortClick = () => {

    setScoreSort(null)
    setDateSort(null)
    if (artistSort === null) {
      setArtistSort('⬆')
    }
    let sortedArray = gameHistory.slice()
    if (artistSort === '⬆') {
      sortedArray.sort((a, b) => {
        const artistA = a.artistName.toUpperCase()
        const artistB = b.artistName.toUpperCase()
        return (artistA > artistB) ? -1 : (artistA < artistB) ? 1 : 0
      })
      setGameHistory(sortedArray)
      setArtistSort('⬇')
    } else if (artistSort === '⬇') {
      sortedArray.sort((a, b) => {
        const artistA = a.artistName.toUpperCase()
        const artistB = b.artistName.toUpperCase()
        return (artistA < artistB) ? -1 : (artistA > artistB) ? 1 : 0
      })
      setGameHistory(sortedArray)
      setArtistSort('⬆')
    }
  }
  const handleDateSortClick = () => {
    if (dateSort === null) {
      setDateSort('⬆')

    }
    setArtistSort(null)
    setScoreSort(null)

    let sortedArray = gameHistory.slice()
    if (dateSort === '⬆') {
      sortedArray.sort((a, b) => {
        return b.date - a.date
      })
      setGameHistory(sortedArray)
      setDateSort('⬇')
    } else if (dateSort === '⬇') {
      sortedArray.sort((a, b) => {
        return a.date - b.date
      })
      setGameHistory(sortedArray)
      setDateSort('⬆')
    }
  }
  const handleScoreSortClick = () => {
    if (scoreSort === null) {

      setScoreSort('⬆')
    }
    setArtistSort(null)
    setDateSort(null)

    let sortedArray = gameHistory.slice()
    if (scoreSort === '⬆') {
      sortedArray.sort((a, b) => {
        return b.score - a.score
      })
      setGameHistory(sortedArray)
      setScoreSort('⬇')
    } else if (scoreSort === "⬇") {
      sortedArray.sort((a, b) => {
        return a.score - b.score
      })
      setGameHistory(sortedArray)
      setScoreSort('⬆')
    }
  }

  const handlePasswordForm = async () => {
    setPasswordForm(!false)
  }
  const handlePasswordChange = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/changepassword`, form)
      setPasswordForm(!passwordForm)
      setMsg('Password successfully changed!')
      setTimeout(() => { setMsg(null) }, 5000)
    } catch (err) {
      console.log(err.response.data)
    }
  }
  const handleShowSummary = () => {
    setShowSummary(!showSummary)
  }
  const handleShowHistory = () => {
    setShowHistory(!showHistory)
  }

  const changePasswordForm = (
    <>
      <p>Change Password</p>
      <form onSubmit={handlePasswordChange}>
        <label htmlFor="password">New Password</label>
        <input type="password" name="password" id="password" onChange={e => setForm({ ...form, password: e.target.value })} value={form.password} />

        <button className='btn  btn-game-choices m-2 btn-sm btn-primary container-mini' type="submit" onClick={handlePasswordForm}>Submit</button>
      </form>
    </>
  )

  const gameTableHeaders = (
    <tr >
      <th style={{ paddingRight: '20px' }} onClick={handleDateSortClick}>Date{dateSort ? dateSort : null}</th>
      <th style={{ paddingRight: '20px' }} onClick={handleArtistSortClick}>Artist{artistSort ? artistSort : null}</th>
      <th style={{ paddingRight: '20px' }} onClick={handleScoreSortClick}>Score{scoreSort ? scoreSort : null}</th>
      <th style={{ paddingRight: '20px' }}>Difficulty</th>
      <th style={{ paddingRight: '20px' }}>Details</th>
      <th style={{ paddingRight: '20px' }}>New Game</th>
      <th style={{ paddingRight: '20px' }}>Delete Game</th>
    </tr>
  )

  const gameDetails = gameHistory.map((element, index) => {
    return <GameDetails key={`game-detail-index-${index}`} gameDetail={element} spotifyToken={spotifyToken} currentUser={currentUser} deleteGame={deleteGame} />
  })

  const summaryTableHeaders = (
    <tr >
      <th style={{ paddingRight: '20px' }}>Artist</th>
      <th style={{ paddingRight: '20px' }}>Games Played</th>
      <th style={{ paddingRight: '20px' }}>Overall Avg Score</th>
      <th style={{ paddingRight: '20px' }}>Avg Easy Score</th>
      <th style={{ paddingRight: '20px' }}>Avg Med Score</th>
      <th style={{ paddingRight: '20px' }}>Avg Hard Score</th>
    </tr>
  )

  const summaryTableRows = summary.map((element, index) => {
    return (
      <tr key={`summary-row-index-${index}`}>
        <td>{element.artistName}</td>
        <td>{element.gameCount}</td>
        <td>{element.overallAvgScore}</td>
        <td>{element.avgEasyScore}</td>
        <td>{element.avgMedScore}</td>
        <td>{element.avgHardScore}</td>
      </tr>
    )
  })

  const gameTable = (
    <div className='container-table'>
      <table>
        <tbody>
          {gameTableHeaders}
          {gameDetails}
        </tbody>
      </table>
    </div>
  )

  const summaryTable = (
    <div className='container-summary'>
      <table>
        <tbody>
          {summaryTableHeaders}
          {summaryTableRows}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <div className='paddingTop' >
        <h3>{currentUser.name}'s Profile</h3>
        {!passwordForm && !msg ? <button className='btn  btn-game-choices m-3 mx-5 btn-sm btn-primary container-mini' onClick={handlePasswordForm}>Change Password?</button> : msg}
        {passwordForm ? changePasswordForm : null}
      </div>
      <div className='paddingTop'>
        <h2>Summary<button className='btn  btn-game-choices m-2 btn-sm btn-primary container-mini' onClick={handleShowSummary}>{showSummary ? 'Hide' : 'Show'}</button></h2>
        {showSummary ? summaryTable : null}
      </div>
      <div className='paddingTop'>
        <h2>Game History<button className='btn  btn-game-choices m-2 btn-sm btn-primary container-mini' onClick={handleShowHistory}>{showHistory ? 'Hide' : 'Show'}</button></h2>
        {showHistory ? gameTable : null}

      </div>
    </div>
  )
}
