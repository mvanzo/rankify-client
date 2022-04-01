import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { render } from "@testing-library/react"

export default function Search({ spotifyToken, setSpotifyToken, setDifficulty, difficulty }) {
    const CLIENT_ID = "9339daa0c0bd4724976bb425f44f9a2f"
    const REDIRECT_URI = "http://localhost:3000/search"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [search, setSearch] = useState('')
    const [artists, setArtists] = useState([])
    const [artistId, setArtistId] = useState('')
    const [artistName, setArtistName] = useState('')
    const [expired, setExpired] = useState(false)
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        setDifficulty('')
    }, [])

    const searchArtists = async e => {
        try {
            e.preventDefault()
            const { data } = await axios.get("https://api.spotify.com/v1/search", {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`
                },
                params: {
                    q: search,
                    type: "artist"
                }
            })
            setArtists(data.artists.items)
            setExpired(false)
        }
        catch (err) {
            if (err.response.status === 401) {
                console.log(err.response.data)
                setExpired(true)
            }
        }
    }

    const handleArtistClick = (id, name) => {
        console.log(`handle artist click for ${id}`)
        setArtistId(id)
        setArtistName(name)
        setSelected(true)
    }

    const renderedArtists = artists.map(artist => {
        return (
            <>
                <div className="grid-item" key={artist.id} onClick={() => handleArtistClick(artist.id, artist.name)}>
                    {artist.images.length ? <img className={`img-container ${selected && artist.id === artistId ? 'image-select' : ''}`} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                    <br />
                    {artist.name}
                </div>
            </>
        )
    })

    const spotifyLogout = () => {
        setSpotifyToken('')
        window.localStorage.removeItem("token")
        setExpired(false)
    }

    const gameModes = (value) => {
        if (value === 'easy') {
            setDifficulty(value)
        } else if (value === 'medium') {
            setDifficulty(value)
        } else if (value === 'hard') {
            setDifficulty(value)
        }
    }
    return (
        <div>
            <h1 className="paddingTop">How To Play</h1>
            {/* <h1>Search Page</h1> */}
            <div>
                {/* <img className='paddingTop' src="https://c.tenor.com/WOQ4NaiPiRwAAAAC/beats-art.gif" alt="search-page-pic" width="55%" height="220vh" /> */}
                {/* {renderedArtists.length != 0 ?
                    <>
                        <p className="div-center paddingTop" style={{ width: '60%' }}>
                            The world is obsessed with the word guessing game Wordle, but if vocabulary is not your thing and music is more of your speed, may we suggest our game, "Rankify"!
                        </p>
                        <img className='paddingTop' src="https://c.tenor.com/WOQ4NaiPiRwAAAAC/beats-art.gif" alt="search-page-pic" width="30%" height="100vh" />
                    </>
                    :
                    <>
                        <p className="div-center paddingTop" style={{ width: '60%' }}>
                            The world is obsessed with the word guessing game Wordle, but if vocabulary is not your thing and music is more of your speed, may we suggest our game, "Rankify"!
                        </p>
                        <img className='paddingTop' src="https://c.tenor.com/WOQ4NaiPiRwAAAAC/beats-art.gif" alt="search-page-pic" width="55%" height="220vh" />
                    </>
                } */}
                {renderedArtists.length === 0 ?
                    <>
                        <p className="div-center paddingTop" style={{ width: '60%' }}>
                            The world is obsessed with the word guessing game Wordle, but if vocabulary is not your thing and music is more of your speed, may we suggest our game, "Rankify"!
                        </p>
                        <br />
                        <img className='paddingTop' src="https://c.tenor.com/WOQ4NaiPiRwAAAAC/beats-art.gif" alt="search-page-pic" width="55%" height="220vh" />
                    </>

                    : ''
                }

                <div className="div-center paddingTop" >

                    <p>You play by trying to guess a particular song with only snippets of it.</p>
                    <p>Correct guesses = 1 point | Incorrect guesses = 0 point </p>
                    <p>If you trust your ears, search for an artist to get started!</p>
                </div>
            </div>

            {expired ?
                <div className="paddingTop">
                    <p><em>Your spotify access token has expired, please <button onClick={spotifyLogout}>log out</button> and log back in for a new token</em></p>
                </div>
                :
                ''
            }

            {spotifyToken ?
                <>
                    {/*search */}
                    <div className="form-group">
                        <form onSubmit={searchArtists}>
                            <label className="form-label mt-4" htmlFor="search">Search: </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="enter your search here"
                                onChange={e => setSearch(e.target.value)
                                }
                            />
                            <input className="btn btn-game-choices m-3 btn-sm btn-primary container-mini" type="submit" />
                        </form>
                        <br></br>

                        <div className="btn-group container-mini btn-game-choices btn-search" role="group" aria-label="Basic radio toggle button group"  >
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked="" value={'easy'} onClick={() => gameModes('easy')} />
                            <label className="btn btn-outline-primary btn-sm" for="btnradio1" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px', paddingLeft: '20px' }} >Easy</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked="" value={'medium'} onClick={() => gameModes('medium')} />
                            <label className="btn btn-outline-primary btn-sm" for="btnradio2" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px' }} >Medium</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked="" value={'hard'} onClick={() => gameModes('hard')} />
                            <label className="btn btn-outline-primary btn-sm" for="btnradio3" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px', paddingRight: '20px' }} >Hard</label>
                        </div>

                        <br />

                        {/* start btn */}
                        {artistName && difficulty !== '' ?
                            <Link to={`/game/${artistId}`}><input className="btn btn-game-choices m-3 btn-sm btn-primary container-mini" type="button" value={`Start Game ${artistName}`} /></Link>
                            : ''
                        }

                        {/* search results */}
                        {renderedArtists.length != 0 ?
                            <>
                                <br />
                                <h3 style={{ color: '#24CB4B' }}>Search Results</h3>
                                <div className="grid-container">
                                    {renderedArtists}
                                </div>
                            </>
                            : null}

                    </div>
                </>

                : <h1>You must be logged in to spotify</h1>
            }

            {
                !spotifyToken ?
                    <button><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a></button>
                    : ''
            }

        </div >
    )
}
