import React from 'react'
import { Link } from 'react-router-dom'
import Cinema from './images/cinema.png'
import StarWarsBackground from './images/star-wars.jpg'

const Home = () => {
	return (
		<div className='home-container'>
			<Link
				to='/gra'
				className='home-link-container background-image actor-link'
				style={{ backgroundImage: `url(${Cinema})` }}>
				<h2>One Actor</h2>
			
			</Link>
			<Link
				to='/star-wars-management'
				className='home-link-container background-image star-wars-link'
				style={{ backgroundImage: `url(${StarWarsBackground})` }}>
				<h2 className='star-title'>Star Wars Management Tool</h2>
		
			</Link>
		</div>
	)
}

export default Home
