import React, { useState, useEffect } from "react";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = [...cart];
    if (newQuantity <= 0) {
      updatedCart.splice(index, 1); // Remove item if quantity is zero or less
    } else {
      updatedCart[index].quantity = newQuantity;
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    // Trigger a localStorage event to update the Header component
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQuantity = (index) => {
    handleQuantityChange(index, cart[index].quantity + 1);
  };

  const decreaseQuantity = (index) => {
    handleQuantityChange(index, cart[index].quantity - 1);
  };

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); // Remove selected item
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    // Trigger a localStorage event to update the Header component
    window.dispatchEvent(new Event("storage"));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>RS.{item.price}</p>
              <div className="quantity-controls">
                <button
                  className="quantity-button"
                  onClick={() => decreaseQuantity(index)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  readOnly
                  className="quantity-input"
                />
                <button
                  className="quantity-button"
                  onClick={() => increaseQuantity(index)}
                >
                  +
                </button>
              </div>
            </div>
            <button className="remove-button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))
      )}
      <h3>Total: RS.{totalPrice.toFixed(2)}</h3>
    </div>
  );
};

export default Cart;
