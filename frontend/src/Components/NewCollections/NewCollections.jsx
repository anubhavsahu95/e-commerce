import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
import newcollection from '../Assets/new_collections'

const NewCollections = () => {

  
  const [newcollection_online,setNewcollection]=useState([]);

  useEffect(()=>{
    fetch('https://e-commerce-backend-xyu4.onrender.com/newcollection')
    .then((response)=>response.json())
    .then((data)=>setNewcollection(data));
  },[])

  

  return (
    <div className='new-collection'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newcollection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
        {newcollection_online.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default NewCollections
