import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <div key={product._id} className="product-item">
          <Link to={`/product/${product._id}`} className="product-link">
            <img
              src={product.image}
              alt={product.name}
              className="product-item-image"
            />
            <h2 className="product-item-name">{product.name}</h2>
            {/* <p className="product-item-description">{product.description}</p> */}
            <p className="product-item-price">RS.{product.price}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;
