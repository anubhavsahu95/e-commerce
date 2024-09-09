import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'


const Popular = () => {

  
  const [data_product_women,setData_Product_Women]=useState([]);

  useEffect(()=>{
    fetch('https://e-commerce-backend-xyu4.onrender.com/popularinwomen')
    .then((response)=>response.json())
    .then((data)=>setData_Product_Women(data));
  },[])

  const [data_product_men,setData_Product_Men]=useState([]);

  useEffect(()=>{
    fetch('https://e-commerce-backend-xyu4.onrender.com/popularinmen')
    .then((response)=>response.json())
    .then((data)=>setData_Product_Men(data));
  },[])
  

  return (
    <>

    <div className='popular'>
      <h1>POPULAR IN MEN</h1>
      <hr />
      <div className="popular-item">
        {data_product_men.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product_women.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
    </>
  )
}

export default Popular
