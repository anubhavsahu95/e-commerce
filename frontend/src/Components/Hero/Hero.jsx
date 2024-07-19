import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'
import { Link } from 'react-router-dom'
const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div className='main-heading'>
            <div className="hero-hand-icon">
                <p>NEW</p>
                <img src={hand_icon} alt="" />
            </div>
            <p>COLLECTIONS</p>
            <p>FOR EVERYONE</p>
        </div>
        <Link style={{textDecoration:'none'}} to='/men'><div id='latest-collection' className="hero-latest-btn">
            <div>Latest Collection</div>
            <img src={arrow_icon} alt="" />
        </div></Link>
      </div>
      <div className="hero-right">
            <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero
