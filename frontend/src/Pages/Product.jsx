import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import all_product from '../Components/Assets/all_product'
import './CSS/Product.css'

const Product = () => {
  const {all_product_online}=useContext(ShopContext);
  const {productId}=useParams();
  // let product=all_product.find((e)=> e.id===Number(productId))
  // if(!product)product=all_product_online.find((e)=> e.id===Number(productId))
  let product=all_product_online.find((e)=> e.id===Number(productId));
  if (!product) {
    return <div>

     <div className='loading'></div>

     </div>
  }
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product
