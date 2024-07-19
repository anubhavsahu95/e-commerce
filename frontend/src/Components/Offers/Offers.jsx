import React from 'react'
import './Offers.css'
import exclusive from '../Assets/exclusive_image.png'
import { Link } from 'react-router-dom'
const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <Link to="/women"><button>Check Now</button></Link>
      </div>
      <div className="offers-right">
        <img src={exclusive} alt="" />
      </div>
    </div>
  )
}

export default Offers
