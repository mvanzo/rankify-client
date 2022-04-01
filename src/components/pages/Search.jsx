import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Search({ spotifyToken, setSpotifyToken, setDifficulty, difficulty }) {
    // spotify auth details
    const REDIRECT_URI = "https://grand-speculoos-8540ce.netlify.app/search"
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
            // if spotify token is expired, change state to display message for log out/log back in
            if (err.response.status === 401) {
                console.log(err.response.data)
                setExpired(true)
            }
        }
    }

    const handleArtistClick = (id, name) => {
        setArtistId(id)
        setArtistName(name)
        setSelected(true)
    }

    const renderedArtists = artists.map((artist, idx) => {
        return (
                <div key={`artist index: ${idx}`} className="grid-item" onClick={() => handleArtistClick(artist.id, artist.name)}>
                    {artist.images.length ? <img className={`img-container ${selected && artist.id === artistId ? 'image-select' : ''}`} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                    <br />
                    {artist.name}
                </div>
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
            <div>
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
                    <p><em>Your spotify access token has expired, please <button className="btn btn-game-choices m-3 btn-sm btn-primary container-mini" onClick={spotifyLogout}>log out</button> and log back in for a new token</em></p>
                </div>
                :
                ''
            }

            {spotifyToken ?
                <>
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
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked="" readOnly value={'easy'} onClick={() => gameModes('easy')} />
                            <label className="btn btn-outline-primary btn-sm" htmlFor="btnradio1" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px', paddingLeft: '20px' }} >Easy</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked="" readOnly value={'medium'} onClick={() => gameModes('medium')} />
                            <label className="btn btn-outline-primary btn-sm" htmlFor="btnradio2" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px' }} >Medium</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" checked="" readOnly value={'hard'} onClick={() => gameModes('hard')} />
                            <label className="btn btn-outline-primary btn-sm" htmlFor="btnradio3" style={{ backgroundColor: 'transparent', color: 'white', fontSize: '16px', paddingRight: '20px' }} >Hard</label>
                        </div>

                        <br />
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
                    <button className="btn btn-game-choices m-3 btn-sm btn-primary container-mini"><a href={`${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`} style={{ textDecoration: 'none', color: 'white' }} >Log in
                        to Spotify</a></button>
                    : ''
            }
        </div >
    )
}
