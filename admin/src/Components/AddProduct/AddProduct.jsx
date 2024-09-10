import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image,setImage]=useState(false);
    const [productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        category:"men",
        new_price:"",
        old_price:"",
    })

    const imageHandler = (e)=>{
        setImage(e.target.files[0]);
    }

    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_Product = async () => {
      console.log(productDetails);
      let responseData;
      let product = productDetails;
  
      // Prepare form data for Cloudinary upload
      let formData = new FormData();
      const imageInput = document.querySelector('#file-input');
      const image = imageInput.files[0];

      formData.append('file', image); // The file object from your input
      formData.append('upload_preset', 'boogie'); // Replace with your Cloudinary preset
  
      // Upload the image to Cloudinary
      await fetch('https://api.cloudinary.com/v1_1/dycm95cjc/image/upload', {
          method: 'POST',
          body: formData,
      })
      .then((resp) => resp.json())
      .then((data) => {
          if (data.secure_url) {
              product.image = data.secure_url; // Use the Cloudinary image URL
          } else {
              throw new Error("Image upload failed");
          }
      })
      .catch((err) => {
          console.error("Error uploading image:", err);
      });
  
      // Proceed to add the product to your backend
      if (product.image) {
        console.log("Adding product:", product); // Log product object before sending

        await fetch('https://e-commerce-back-end-vmli.onrender.com/addproduct', {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set correct headers
            },
            body: JSON.stringify(product), // Convert product object to JSON
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log("Response from addproduct endpoint:", data); // Log the response from backend
            alert("Product Added Successfully");
        })
        .catch((err) => {
            console.error("Error adding product:", err); // Log any error that occurs during the request
        });
    } else {
        console.error("No image URL found, product not added");
    }
};

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input name="name" value={productDetails.name} onChange={changeHandler} type="text" placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input name="old_price" value={productDetails.old_price} onChange={changeHandler} type="text" placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input name="new_price" value={productDetails.new_price} onChange={changeHandler} type="text" placeholder='Type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className="addproduct-selector">
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img'/>
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
