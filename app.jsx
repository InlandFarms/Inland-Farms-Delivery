import React, { useState } from 'react';
import { ShoppingCart, X, Heart, RotateCcw } from 'lucide-react';

const InlandFarmsDelivery = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'flower', name: 'Flower', description: 'Estate-grown cultivars' },
    { id: 'concentrates', name: 'Concentrates', description: 'Refined extractions' },
    { id: 'curated', name: 'Limited Release', description: 'Limited estate release', badge: 'Limited' }
  ];

  const products = [
    { 
      id: 1, 
      name: 'Blue Dream', 
      category: 'flower', 
      story: 'A balanced hybrid born in California, known for its gentle euphoria and creative energy.',
      effects: 'Uplifting, Creative, Focused',
      thc: '22%', 
      price: 45, 
      weight: '3.5g',
      farmDirect: true
    },
    { 
      id: 2, 
      name: 'OG Kush', 
      category: 'flower', 
      story: 'The legendary strain that defined West Coast cannabis culture. Deep relaxation with clarity.',
      effects: 'Relaxed, Euphoric, Happy',
      thc: '24%', 
      price: 50, 
      weight: '3.5g',
      farmDirect: true
    },
    { 
      id: 3, 
      name: 'Gelato', 
      category: 'flower', 
      story: 'Italian heritage meets California craft. Sweet, balanced, and undeniably smooth.',
      effects: 'Balanced, Calm, Uplifted',
      thc: '20%', 
      price: 48, 
      weight: '3.5g',
      farmDirect: false
    },
    { 
      id: 4, 
      name: 'Diamond Sauce', 
      category: 'concentrates', 
      story: 'Live resin crystallization at its finest. Pure terpene preservation.',
      effects: 'Potent, Clear, Energizing',
      thc: '88%', 
      price: 65, 
      weight: '1g',
      farmDirect: true
    },
    { 
      id: 5, 
      name: 'Purple Sunset', 
      category: 'curated', 
      story: 'This week\'s limited harvest. A rare phenotype with deep purple hues and notes of lavender and earth. Only 12 units available.',
      effects: 'Deeply Relaxing, Dreamy, Peaceful',
      thc: '26%', 
      price: 75, 
      weight: '3.5g',
      farmDirect: true,
      limited: true,
      remaining: 8
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const reorderProduct = (product) => {
    addToCart(product);
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

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

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
              onClick={() => setShowCart(!showCart)}
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

          {/* Favorites Quick Reorder */}
          {favoriteProducts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-24 border-t border-neutral-900 pt-16">
              <h2 className="text-xs tracking-widest uppercase text-neutral-600 mb-8">Your Favorites</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {favoriteProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => reorderProduct(product)}
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

          {/* Category Selection */}
          <div className="max-w-5xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group border border-neutral-900 p-12 hover:border-neutral-700 transition-all duration-500 text-left relative"
              >
                {cat.badge && (
                  <span className="absolute top-4 right-4 text-xs tracking-wider text-neutral-700 font-light">
                    {cat.badge}
                  </span>
                )}
                <h3 className="text-2xl font-serif text-neutral-100 mb-4">{cat.name}</h3>
                <p className="text-sm text-neutral-600 mb-8 font-light tracking-wide">{cat.description}</p>
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

            <div className="grid md:grid-cols-2 gap-16">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group text-left border-b border-neutral-900 pb-8 hover:border-neutral-700 transition-all duration-500"
                >
                  <div className="bg-neutral-900 h-96 mb-8 flex items-center justify-center relative">
                    <div className="w-32 h-32 border border-neutral-800 flex items-center justify-center">
                      <svg className="w-20 h-20 text-neutral-800" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C12 2 8 4 8 8C8 10 9 11 10 12C9 13 8 14 8 16C8 20 12 22 12 22C12 22 16 20 16 16C16 14 15 13 14 12C15 11 16 10 16 8C16 4 12 2 12 2Z"/>
                      </svg>
                    </div>
                    {product.farmDirect && (
                      <span className="absolute top-4 left-4 text-xs tracking-widest uppercase text-neutral-600 border border-neutral-800 px-3 py-1 bg-neutral-950">
                        From Our Farm
                      </span>
                    )}
                    {product.limited && (
                      <span className="absolute top-4 right-4 text-xs tracking-widest uppercase text-neutral-400 border border-neutral-700 px-3 py-1 bg-neutral-950">
                        {product.remaining} Remaining
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-neutral-100 mb-4">{product.name}</h3>
                  <p className="text-neutral-500 text-sm mb-6 font-light leading-relaxed">{product.story}</p>
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
              <div className="bg-neutral-900 h-[600px] flex items-center justify-center relative">
                <div className="w-48 h-48 border border-neutral-800 flex items-center justify-center">
                  <svg className="w-32 h-32 text-neutral-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C12 2 8 4 8 8C8 10 9 11 10 12C9 13 8 14 8 16C8 20 12 22 12 22C12 22 16 20 16 16C16 14 15 13 14 12C15 11 16 10 16 8C16 4 12 2 12 2Z"/>
                  </svg>
                </div>
                {selectedProduct.farmDirect && (
                  <span className="absolute top-6 left-6 text-xs tracking-widest uppercase text-neutral-600 border border-neutral-800 px-4 py-2 bg-neutral-950">
                    From Our Farm
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-start justify-between mb-8">
                  <h1 className="text-4xl font-serif text-neutral-100">{selectedProduct.name}</h1>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    <Heart 
                      className="w-6 h-6" 
                      fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"}
                    />
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
                  <h3 className="text-xs tracking-widest uppercase text-neutral-600 mb-2">THC Content</h3>
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

                {selectedProduct.limited && (
                  <p className="text-xs text-neutral-600 tracking-wide">
                    Limited release · Only {selectedProduct.remaining} units remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/90 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-lg bg-neutral-950 border-l border-neutral-900 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-12">
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
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-700 hover:text-neutral-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 text-neutral-400"
                            >
                              −
                            </button>
                            <span className="text-neutral-300 font-light">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 text-neutral-400"
                            >
                              +
                            </button>
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
                      <span className="text-neutral-300 font-light">{cartTotal >= 50 ? 'Complimentary' : '$5.00'}</span>
                    </div>
                    <p className="text-xs text-neutral-700 mb-8">Discreet. Unbranded. Farm-direct.</p>
                    <div className="flex justify-between text-xl pt-8 border-t border-neutral-900">
                      <span className="text-neutral-100 font-light">Total</span>
                      <span className="text-neutral-100 font-light">
                        ${(cartTotal + (cartTotal >= 50 ? 0 : 5)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-xs tracking-widest uppercase text-neutral-600 mb-3 block">
                      Delivery Window
                    </label>
                    <select className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-700">
                      <option>Today, 2PM - 4PM</option>
                      <option>Today, 4PM - 6PM</option>
                      <option>Today, 6PM - 8PM</option>
                      <option>Tomorrow, 12PM - 2PM</option>
                    </select>
                  </div>

                  <button className="w-full bg-neutral-100 text-neutral-950 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors duration-500">
                    Complete Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 text-center mt-32">
        <p className="text-xs text-neutral-700 tracking-widest uppercase font-light mb-2">
          Must be 21+
        </p>
        <p className="text-xs text-neutral-800 font-light">
          Discreet. Unbranded. Farm-direct.
        </p>
      </footer>
    </div>
  );
};

export default InlandFarmsDelivery;
