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

  // get artists name from Spotify API -- arrow function
  // map an array of promieses (promises.all()) and throw promises array into state inside a useEffect
  // from weston's snippet, put resolved array in  state
  // const getArtistName = async (artistId) => {
  //   try{
  //   let apiResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
  //     headers: {
  //         Authorization: `Bearer ${spotifyToken}`
  //     }
  // })
  // return apiResponse.data.name} catch (err) {
  // console.log(err)
  //   }
  // }

  // // replace artistId with artists name
  // const addArtistNames = async (array) => {
  //   // let newArr = []
  //   for (const element of array) {
  //     element.artistName = await getArtistName(element.artistId)
  //     // let awaitArtist = await getArtistName(element.artist)
  //     // newArr.push(awaitArtist)
  //   }
  //   // console.log(newArr)
  //   // return newArr
  // }
  const summaryDetails = () => {
    let newSummaryArray = []
    for (let i =0; i < gameHistory.length; i++) {
      if (newSummaryArray.find(element=>element.artistName === gameHistory[i].artistName) === undefined) {
        artistList.push(gameHistory[i].artistName)
        newSummaryArray.push({artistName: gameHistory[i].artistName, gameCount: 0, easyGames:0, medGames: 0, hardGames: 0,totalEasyScore: 0, totalMedScore: 0, totalHardScore:0})
    }
    const summaryToUpdate = newSummaryArray.find(element=>element.artistName === gameHistory[i].artistName)
    console.log(summaryToUpdate)
    summaryToUpdate.gameCount++
    if (gameHistory[i].difficulty === 'easy') {
      summaryToUpdate.easyGames++
      summaryToUpdate.totalEasyScore+=gameHistory[i].score
    } else if (gameHistory[i].difficulty === 'medium') {
      summaryToUpdate.medGames++;
      summaryToUpdate.totalMedScore+=gameHistory[i].score
    } else if (gameHistory[i].difficulty === 'hard') {
      summaryToUpdate.hardGames++;
      summaryToUpdate.totalHardScore+=gameHistory[i].score
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
    if (summaryToUpdate.easyGames=== 0 && summaryToUpdate.medGames===0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgHardScore)} else
    if (summaryToUpdate.easyGames=== 0 && summaryToUpdate.hardGames===0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgMedScore)} else
    if (summaryToUpdate.medGames=== 0 && summaryToUpdate.hardGames===0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore)} else
    if (summaryToUpdate.easyGames=== 0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgMedScore + summaryToUpdate.avgHardScore)/2} else
    if (summaryToUpdate.medGames=== 0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore)/2} else
    if (summaryToUpdate.hardGames=== 0) {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore)/2} else {
      {summaryToUpdate.overallAvgScore = (summaryToUpdate.avgEasyScore + summaryToUpdate.avgMedScore+summaryToUpdate.avgHighScore)/3}
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
  newSummaryArray.sort((a,b)=> {
    return b.score - a.score
  })
  setSummary(newSummaryArray)

  }

  // use useEffect to get data from the back
  useEffect(()=> {(async () => {
      try {
        // get token for local storage
        const token = localStorage.getItem('jwt')
        // console.log('token', token)
        // make the auth headers
        const options = {
          headers: {
            'Authorization': token
          }
        }
        // hit the auth locked endpoint
        // axios.get(url, options)
        // axios.post(url, body, options) (same thing w put)
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/profile`, options)
        const gameArrayData = response.data.map(element => {
          return {gameId: element._id, artistName: element.artistName, score: element.score, difficulty: element.difficulty,songs: element.songsPlayed, date: new Date(element.createdAt)}
        })
        setGameHistory(gameArrayData)
        summaryDetails()
        // const uniqueArtists = [...new Set(artistArray)]
        // setArtists(uniqueArtists)
      
        // set the data from the server in state
        // setMsg(response.data.msg)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  useEffect(()=>{
    summaryDetails()
  }, [gameHistory])

      // handle deleteGame button
      const deleteGame = async (gameObj) => {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/game/${gameObj.gameId}`)
        console.log('delete button clicked')
        const indexOfDeletedGame = gameHistory.indexOf(gameHistory.find(element => element.gameId === gameObj.gameId))
        const updatedArray = gameHistory.slice()
        updatedArray.splice(indexOfDeletedGame, 1)
        setGameHistory(updatedArray)
        // setDeleted(!deleted)
    }

    const handleArtistSortClick = () => {
      
      setScoreSort(null)
      setDateSort(null)
      if (artistSort === null) {
        setArtistSort('⬆')
      }
      let sortedArray = gameHistory.slice()
      if (artistSort === '⬆') {
        sortedArray.sort((a,b)=> {
          const artistA = a.artistName.toUpperCase()
          const artistB = b.artistName.toUpperCase()
          return (artistA > artistB) ? -1: (artistA < artistB) ? 1: 0
        })
        setGameHistory(sortedArray)
        setArtistSort('⬇')
      } else if (artistSort === '⬇') {
        sortedArray.sort((a,b)=> {
          const artistA = a.artistName.toUpperCase()
          const artistB = b.artistName.toUpperCase()
          return (artistA < artistB) ? -1: (artistA > artistB) ? 1: 0
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
        sortedArray.sort((a,b)=> {
          return b.date - a.date
        })
        setGameHistory(sortedArray)
        setDateSort('⬇')
      } else if (dateSort === '⬇') {
        sortedArray.sort((a,b)=> {
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
        sortedArray.sort((a,b)=> {
          return b.score - a.score
        })
        setGameHistory(sortedArray)
        setScoreSort('⬇')
      } else if (scoreSort==="⬇") {
        sortedArray.sort((a,b)=> {
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
      setTimeout(()=> {setMsg(null)}, 5000)
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
  <input type="password" name="password" id="password" onChange={e=>setForm({...form, password: e.target.value})} value={form.password}/>

  <button type="submit" onClick={handlePasswordForm}>Submit</button>
</form>
      </>
    )

    const gameTableHeaders = (
        <tr>
          <th onClick={handleDateSortClick}>Date{dateSort ? dateSort: null}</th>
          <th onClick={handleArtistSortClick}>Artist{artistSort ? artistSort: null}</th>
          <th onClick={handleScoreSortClick}>Score{scoreSort ? scoreSort: null}</th>
          <th>Difficulty</th>
          <th>Details</th>
          <th>New Game</th>
          <th>Delete Game</th>
        </tr>        
    )

  const gameDetails =  gameHistory.map((element, index)=> {
    return <GameDetails key={`game-detail-index-${index}`} gameDetail={element} spotifyToken={spotifyToken} currentUser={currentUser} deleteGame={deleteGame} />
  })

  const summaryTableHeaders = (
    <tr>
      <th>Artist</th>
      <th>Games Played</th>
      <th>Overall Avg Score</th>
      <th>Avg Easy Score</th>
      <th>Avg Med Score</th>
      <th>Avg Hard Score</th>
    </tr>
  ) 
  
  const summaryTableRows = summary.map((element, index)=> {
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
    <div>
    <table>
      <tbody>
    {gameTableHeaders}
    {gameDetails}
    </tbody>
    </table>
    </div>
  )

  const summaryTable = (
    <table>
    <tbody>
      {summaryTableHeaders}
      {summaryTableRows}
    </tbody>
  </table>
  )

  return (
    <div>
      <div>
      <h3>{currentUser.name}'s Profile</h3>
      {!passwordForm && !msg ? <button onClick={handlePasswordForm}>Change Password?</button>: msg}
      {passwordForm ? changePasswordForm : null}
      </div>
      <div>
        <h2>Summary<button onClick={handleShowSummary}>{showSummary ? 'Hide': 'Show'}</button></h2>
        {showSummary ? summaryTable : null}
      </div>
      <div>
        <h2>Game History<button onClick={handleShowHistory}>{showHistory ? 'Hide' : 'Show'}</button></h2>
       {showHistory ? gameTable : null}

      </div>
    </div>
  )
}
