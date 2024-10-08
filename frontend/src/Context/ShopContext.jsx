import React, { createContext, useEffect, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {

  const [all_product_online,setAll_Product]=useState([]);

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(()=>{
    fetch('https://e-commerce-back-end-vmli.onrender.com/allproducts')
    .then((response)=>response.json())
    .then((data)=>setAll_Product(data))

    if(localStorage.getItem('auth-token')){
      fetch('https://e-commerce-back-end-vmli.onrender.com/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=>response.json())
      .then((data)=>setCartItems(data));
    }
  },[])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('https://e-commerce-back-end-vmli.onrender.com/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('https://e-commerce-back-end-vmli.onrender.com/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // let itemInfo = all_product.find(
        //   (product) => product.id === Number(item)
        // );
        // if(!itemInfo){
        //   itemInfo = all_product_online.find(
        //     (product) => product.id === Number(item)
        //   );
        // }
        let itemInfo = all_product_online.find(
             (product) => product.id === Number(item)
           );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getCartItems = () => {
    let num = 0;
    for (const item in cartItems) {
      num += cartItems[item];
    }
    return num;
  };

  const contextValue = {
    getTotalCartAmount,
    all_product,
    all_product_online,
    cartItems,
    addToCart,
    removeFromCart,
    getCartItems,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
