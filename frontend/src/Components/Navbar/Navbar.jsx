import React, { useContext, useState, useRef } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.jpg'

const Navbar = () => {

    const [menu,setMenu]=useState("Shop");
    const {getCartItems}=useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle=(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
        console.log('Tapped');
    }
  return (
    <div className="navbar">
      <Link style={{textDecoration: 'none'}} to='/'><div onClick={()=>{setMenu("Shop")}} className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPIFY</p>
      </div></Link>
     
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>{setMenu("Shop")}}><Link style={{textDecoration: 'none',color:'#000'}} to='/'>Shop</Link> {menu==="Shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Men")}}><Link style={{textDecoration: 'none',color:'#000'}} to='/men'>Men</Link> {menu==="Men"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Women")}}><Link style={{textDecoration: 'none',color:'#000'}} to='/women'>Women</Link> {menu==="Women"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Kids")}}><Link style={{textDecoration: 'none',color:'#000'}} to='/kids'>Kids</Link> {menu==="Kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace("/");}}>Logout</button>:<button><Link style={{textDecoration: 'none',color:'#000'}} to='/login'>Login</Link></button>}
        <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getCartItems()}</div>
      </div>
      
    </div>
  )
}

export default Navbar
