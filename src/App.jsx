import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Heart, RotateCcw } from 'lucide-react';

const SUPABASE_URL = 'https://ohznzuabosygqaevvpuu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oem56dWFib3N5Z3FhZXZ2cHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODk1MDQsImV4cCI6MjA4NTQ2NTUwNH0.yhCqZ9o6v9zW-wclLZibUO0Abn4_kcIKr6ZrgjeO32o';

const InlandFarmsDelivery = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryWindow, setDeliveryWindow] = useState('Today, 2PM - 4PM');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    ageVerified: false
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=*&limit=100`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  const categories = [
    { id: 'flower', name: 'Flower', description: 'Humboldt Grown' },
    { id: 'live-rosin', name: 'Live Rosin', description: 'Solventless extractions' },
    { id: 'concentrates', name: 'Concentrates', description: 'Refined extractions' },
    { id: 'pre-rolls', name: 'Pre-Rolls', description: 'Infused five-packs' },
    { id: 'edibles', name: 'Edibles', description: 'Precision-dosed gummies' }
  ];

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSelectedProduct(null);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = cartTotal >= 50 ? 0 : 5;
  const orderTotal = cartTotal + deliveryFee;

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const submitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all fields.');
      return;
    }
    if (!customerInfo.ageVerified) {
      alert('You must confirm you are 21 or older.');
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight
      }));
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          delivery_address: customerInfo.address,
          delivery_window: deliveryWindow,
          items: orderItems,
          total: orderTotal,
          age_verified: customerInfo.ageVerified,
          status: 'pending'
        })
      });
      if (response.ok || response.status === 201) {
        setOrderComplete(true);
        setCart([]);
        setShowCheckout(false);
        setCustomerInfo({ name: '', phone: '', address: '', ageVerified: false });
      } else {
        alert('There was an issue placing your order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('There was an issue placing your order. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <button onClick={() => { setSelectedCategory(null); setSelectedProduct(null); }}>
              <div className="text-3xl font-serif tracking-tight text-neutral-50">
                INLAND FARMS
              </div>
            </button>
            <button
              onClick={() => { setShowCart(!showCart); setShowCheckout(false); setOrderComplete(false); }}
              className="relative border border-neutral-800 bg-neutral-900 text-neutral-100 px-6 py-3 text-sm tracking-wider hover:bg-neutral-800 transition-colors duration-500"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-4 h-4" />
                <span className="font-light">${cartTotal.toFixed(2)}</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-neutral-100 text-neutral-950 w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!selectedCategory && !selectedProduct && (
        <section className="py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif text-neutral-100 mb-4 leading-tight">
              The Delivery
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-500 tracking-wide" style={{fontFamily: 'Edwardian Script ITC, cursive', fontStyle: 'italic'}}>
              Veni Vidi Vici
            </p>
          </div>

          {favoriteProducts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-24 border-t border-neutral-900 pt-16">
              <h2 className="text-xs tracking-widest uppercase text-neutral-600 mb-8">Your Favorites</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {favoriteProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="border border-neutral-900 p-6 text-left hover:border-neutral-700 transition-all duration-500 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-serif text-neutral-100 mb-1">{product.name}</h3>
                        <p className="text-xs text-neutral-600">{product.weight}</p>
                      </div>
                      <RotateCcw className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                    </div>
                    <p className="text-neutral-100 font-light text-sm">${product.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group border border-neutral-900 p-10 hover:border-neutral-700 transition-all duration-500 text-left relative"
              >
                <h3 className="text-xl font-serif text-neutral-100 mb-4">{cat.name}</h3>
                <p className="text-xs text-neutral-600 mb-8 font-light tracking-wide">{cat.description}</p>
                <div className="flex items-center text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span className="text-xs tracking-widest uppercase">View Selection</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      {selectedCategory && !selectedProduct && (
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-neutral-600 hover:text-neutral-400 mb-16 text-sm tracking-widest uppercase"
            >
              ← Back
            </button>

            {filteredProducts.length === 0 && (
              <p className="text-neutral-500 text-center py-20">Loading products...</p>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group text-left border-b border-neutral-900 pb-8 hover:border-neutral-700 transition-all duration-500"
                >
                  <div className="bg-neutral-900 h-80 mb-6 relative overflow-hidden">
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover object-center" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-20 h-20 text-neutral-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C12 2 8 4 8 8C8 10 9 11 10 12C9 13 8 14 8 16C8 20 12 22 12 22C12 22 16 20 16 16C16 14 15 13 14 12C15 11 16 10 16 8C16 4 12 2 12 2Z"/>
                          </svg>
                        </div>
                    }
                    <span className="absolute top-3 left-3 text-xs tracking-wider text-white font-light bg-black/60 px-2 py-1">
                      From Our Farm
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-neutral-100 mb-3">{product.name}</h3>
                  <p className="text-neutral-600 text-xs mb-4">{product.type}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-neutral-100 font-light">${product.price}</span>
                    <span className="text-neutral-600 text-xs tracking-widest uppercase">View Details</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Detail */}
      {selectedProduct && (
        <section className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-neutral-600 hover:text-neutral-400 mb-16 text-sm tracking-widest uppercase"
            >
              ← Back
            </button>

            <div className="grid md:grid-cols-2 gap-20">
              <div className="h-[600px] relative overflow-hidden">
                {selectedProduct.image_url
                  ? <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover object-center" />
                  : <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <svg className="w-32 h-32 text-neutral-800" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C12 2 8 4 8 8C8 10 9 11 10 12C9 13 8 14 8 16C8 20 12 22 12 22C12 22 16 20 16 16C16 14 15 13 14 12C15 11 16 10 16 8C16 4 12 2 12 2Z"/>
                      </svg>
                    </div>
                }
                <span className="absolute top-6 left-6 text-xs tracking-wider text-white font-light bg-black/60 px-2 py-1">
                  From Our Farm
                </span>
              </div>

              <div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-serif text-neutral-100 mb-2">{selectedProduct.name}</h1>
                    <p className="text-neutral-600 text-sm">{selectedProduct.type}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    <Heart className="w-6 h-6" fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="mb-12 pb-8 border-b border-neutral-900">
                  <h3 className="text-xs tracking-widest uppercase text-neutral-600 mb-4">Story</h3>
                  <p className="text-neutral-400 leading-relaxed font-light">{selectedProduct.story}</p>
                </div>

                <div className="mb-12 pb-8 border-b border-neutral-900">
                  <h3 className="text-xs tracking-widest uppercase text-neutral-600 mb-4">Effects</h3>
                  <p className="text-neutral-400 font-light">{selectedProduct.effects}</p>
                </div>

                <div className="mb-12 pb-8 border-b border-neutral-900">
                  <h3 className="text-xs tracking-widest uppercase text-neutral-600 mb-2">THC</h3>
                  <p className="text-neutral-500 text-sm font-light">{selectedProduct.thc}</p>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-neutral-600 tracking-widest uppercase mb-2">{selectedProduct.weight}</p>
                    <p className="text-3xl text-neutral-100 font-light">${selectedProduct.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="bg-neutral-100 text-neutral-950 px-10 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-500"
                  >
                    Add to Cart
                  </button>
                </div>

                <p className="text-xs text-neutral-700 tracking-wide">Limited release · From our farm</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cart / Checkout Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/90 z-50" onClick={() => { setShowCart(false); setShowCheckout(false); setOrderComplete(false); }}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-lg bg-neutral-950 border-l border-neutral-900 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-12">

              {/* Order Complete */}
              {orderComplete && (
                <div className="text-center py-24">
                  <p className="text-neutral-100 font-serif text-2xl mb-4">Order Placed</p>
                  <p className="text-neutral-500 font-light text-sm mb-8">Your order has been received. Expect discreet delivery within your selected window.</p>
                  <button
                    onClick={() => { setShowCart(false); setOrderComplete(false); }}
                    className="bg-neutral-100 text-neutral-950 px-8 py-3 text-xs tracking-widest uppercase hover:bg-white transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}

              {/* Checkout Form */}
              {showCheckout && !orderComplete && (
                <>
                  <div className="flex justify-between items-center mb-12 pb-8 border-b border-neutral-900">
                    <h2 className="text-2xl font-serif text-neutral-100">Checkout</h2>
                    <button onClick={() => setShowCheckout(false)} className="text-neutral-600 hover:text-neutral-400 text-xs tracking-widest uppercase">← Back</button>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-600 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-600 mb-2 block">Phone Number</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-600 mb-2 block">Delivery Address</label>
                      <input
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
                        placeholder="Full delivery address"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-600 mb-2 block">Delivery Window</label>
                      <select
                        value={deliveryWindow}
                        onChange={(e) => setDeliveryWindow(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
                      >
                        <option>Today, 2PM - 4PM</option>
                        <option>Today, 4PM - 6PM</option>
                        <option>Today, 6PM - 8PM</option>
                        <option>Tomorrow, 12PM - 2PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs tracking-widest uppercase text-neutral-600 mb-2 block">Payment Method</label>
                      <div className="w-full bg-neutral-900 border border-neutral-800 text-neutral-400 px-4 py-3 text-sm">
                        Cash on Delivery
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-4">
                      <input
                        type="checkbox"
                        id="ageVerify"
                        checked={customerInfo.ageVerified}
                        onChange={(e) => setCustomerInfo({...customerInfo, ageVerified: e.target.checked})}
                        className="mt-1"
                      />
                      <label htmlFor="ageVerify" className="text-xs text-neutral-500 leading-relaxed">
                        I confirm that I am 21 years of age or older and legally eligible to purchase cannabis products in my jurisdiction.
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-neutral-900 pt-8 mb-8">
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="text-neutral-300">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-6 text-sm">
                      <span className="text-neutral-600">Private Delivery</span>
                      <span className="text-neutral-300">{deliveryFee === 0 ? 'Complimentary' : '$5.00'}</span>
                    </div>
                    <div className="flex justify-between text-xl pt-4 border-t border-neutral-900">
                      <span className="text-neutral-100 font-light">Total</span>
                      <span className="text-neutral-100 font-light">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={submitOrder}
                    disabled={submitting}
                    className="w-full bg-neutral-100 text-neutral-950 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-500 disabled:opacity-50"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </>
              )}

              {/* Cart View */}
              {!showCheckout && !orderComplete && (
                <>
                  <div className="flex justify-between items-center mb-16 pb-8 border-b border-neutral-900">
                    <h2 className="text-2xl font-serif text-neutral-100">Cart</h2>
                    <button onClick={() => setShowCart(false)} className="text-neutral-600 hover:text-neutral-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-24">
                      <p className="text-neutral-600 font-light tracking-wide">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-8 mb-16">
                        {cart.map(item => (
                          <div key={item.id} className="pb-8 border-b border-neutral-900">
                            <div className="flex justify-between mb-4">
                              <div>
                                <h4 className="text-neutral-100 font-light mb-2">{item.name}</h4>
                                <p className="text-sm text-neutral-600">{item.weight}</p>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-neutral-700 hover:text-neutral-500">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 text-neutral-400">−</button>
                                <span className="text-neutral-300 font-light">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 text-neutral-400">+</button>
                              </div>
                              <span className="text-neutral-100 font-light">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-neutral-900 pt-8 mb-12">
                        <div className="flex justify-between mb-4">
                          <span className="text-neutral-600 text-sm tracking-wide">Subtotal</span>
                          <span className="text-neutral-300 font-light">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-neutral-600 text-sm tracking-wide">Private Delivery</span>
                          <span className="text-neutral-300 font-light">{deliveryFee === 0 ? 'Complimentary' : '$5.00'}</span>
                        </div>
                        <p className="text-xs text-neutral-700 mb-8">Discreet. Unbranded. Farm-direct.</p>
                        <div className="flex justify-between text-xl pt-8 border-t border-neutral-900">
                          <span className="text-neutral-100 font-light">Total</span>
                          <span className="text-neutral-100 font-light">${orderTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowCheckout(true)}
                        className="w-full bg-neutral-100 text-neutral-950 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-500"
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-neutral-900 py-8 text-center mt-32">
        <p className="text-xs text-neutral-700 tracking-widest uppercase font-light mb-2">Must be 21+</p>
        <p className="text-xs text-neutral-800 font-light">Discreet. Unbranded. Farm-direct.</p>
      </footer>
    </div>
  );
};

export default InlandFarmsDelivery;
