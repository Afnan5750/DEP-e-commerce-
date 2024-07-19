// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    };

    updateCartItemCount(); // Initial update

    window.addEventListener("storage", updateCartItemCount);

    return () => {
      window.removeEventListener("storage", updateCartItemCount);
    };
  }, []);

  return (
    <header className="header">
      <h1>M Afnan Khadim</h1>
      <div className="header-buttons">
        <Link to="/" className="button product-button">
          Products
        </Link>
        <div className="cart-icon-container">
          <Link to="/cart">
            <i className="fas fa-shopping-cart cart-icon"></i>
          </Link>
          <span className="cart-item-count">{cartItemCount}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
