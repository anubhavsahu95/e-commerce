import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import data_product_women from '../Assets/data'
const RelatedProducts = () => {

  /*
  const [data_product_women,setData_Product_Women]=useState([]);

  useEffect(()=>{
    fetch('https://e-commerce-backend-xyu4.onrender.com/popularinwomen')
    .then((response)=>response.json())
    .then((data)=>setData_Product_Women(data));
  },[])
  */

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {data_product_women.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default RelatedProducts
