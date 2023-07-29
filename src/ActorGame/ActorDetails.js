import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ActorDetails.css'

const ActorDetails = () => {
	const [actor, setActor] = useState(null)
	const [actorMovie, setActorMovie] = useState(null)
	const [randomMovies, setRandomMovies] = useState([])
	const [points, setPoints] = useState(0)
	const [correctAnswers, setCorrectAnswers] = useState(0)
	const [wrongAnswers, setWrongAnswers] = useState(0)

	useEffect(() => {
		fetchRandomActorAndMovies()
	}, [])

	const shuffleArray = array => {
		const shuffled = array.slice()
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
		}
		return shuffled
	}

	const fetchRandomActorAndMovies = async () => {
		try {
			const apiKey = '90256fcf24af1a7b3bdbe7aed9c3798c'
			const actorsResponse = await axios.get(
				`https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US`
			)
			const actors = actorsResponse.data.results
			const randomActor = actors[Math.floor(Math.random() * actors.length)]
			setActor(randomActor)

			if (randomActor.known_for && randomActor.known_for.length > 0) {
				const randomMovie = randomActor.known_for[Math.floor(Math.random() * randomActor.known_for.length)]
				setActorMovie(randomMovie)
			} else {
				setActorMovie(null)
			}

			const randomMoviesResponse = await axios.get(
				`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1`
			)
			const movies = randomMoviesResponse.data.results
			const shuffledMovies = shuffleArray(movies.slice())
			setRandomMovies(shuffledMovies.slice(0, 2))
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}

	const handleMovieClick = movie => {

		const isActorInMovie = actor.known_for.some(knownMovie => knownMovie.id === movie.id)
		const pointsToAdd = isActorInMovie ? 1 : -1


		fetchRandomActorAndMovies()

		setPoints(prevPoints => prevPoints + pointsToAdd)
		if (pointsToAdd > 0) {
			setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1)
		} else {
			setWrongAnswers(prevWrongAnswers => prevWrongAnswers + 1)
		}
	}

	if (!actor || randomMovies.length !== 2) {
		return <div>Loading...</div>
	}


	const allMovies = [actorMovie, ...randomMovies]
	const shuffledMovies = shuffleArray(allMovies)

	return (
		<div className='actor-details-container'>
			<h3>Match the film to the actor</h3>
			<div className='actor-details'>
				<h2 className='actor-name'>{actor.name}</h2>
				<div className='actor-info'>
					<img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} className='actor-image' />
					<div className='points-container'>
						<h3>Points: {points}</h3>
						<div>
							<span>Correct answers: {correctAnswers}</span>
							<span>Wrong Answers: {wrongAnswers}</span>
						</div>
					</div>
				</div>
				<div className='movies-container'>
					{shuffledMovies.map(movie => (
						<div key={movie.id} onClick={() => handleMovieClick(movie)} className='movie-item'>
							<img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
								className='movie-image'
							/>
							<h4 className='movie-title'>{movie.title}</h4>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ActorDetails
