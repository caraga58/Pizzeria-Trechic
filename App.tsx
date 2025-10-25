import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import PizzaOfTheDay from './components/PizzaOfTheDay';
import About from './components/About';
import MenuAdmin from './components/MenuAdmin';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import { verifyPassword } from './services/authService';
import type { Pizza, CartItem, Customer, Order, PizzaOfTheDayType, OrderStatus } from './types';
import { INITIAL_MENU_ITEMS, DEFAULT_PIZZERIA_EMAIL, DEFAULT_PIZZERIA_WHATSAPP_NUMBER, DEFAULT_ABOUT_IMAGE_URL } from './constants';

const App: React.FC = () => {
  // Menu State
  const [menuItems, setMenuItems] = useState<Pizza[]>([]);
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState<PizzaOfTheDayType | null>(null);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Order & Customer State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [lastCompletedCustomer, setLastCompletedCustomer] = useState<Customer | null>(null);

  // Settings State
  const [pizzeriaEmail, setPizzeriaEmail] = useState<string>(DEFAULT_PIZZERIA_EMAIL);
  const [pizzeriaWhatsapp, setPizzeriaWhatsapp] = useState<string>(DEFAULT_PIZZERIA_WHATSAPP_NUMBER);
  const [aboutImageUrl, setAboutImageUrl] = useState<string>(DEFAULT_ABOUT_IMAGE_URL);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);


  // UI State
  const [checkoutStep, setCheckoutStep] = useState<'closed' | 'cart' | 'checkout' | 'confirmation'>('closed');

  const loadData = useCallback((key: string, setter: Function, defaultValue: any) => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        setter(JSON.parse(savedData));
      } else {
        setter(defaultValue);
        if (key === 'pizzeriaMenu') {
           localStorage.setItem(key, JSON.stringify(defaultValue));
        }
      }
    } catch (error) {
      console.error(`Failed to load or parse ${key} from localStorage`, error);
      setter(defaultValue);
    }
  }, []);
  
  const setAndMigrateOrders = useCallback((loadedOrders: Order[] = []) => {
      const migratedOrders = loadedOrders.map(order => ({
          ...order,
          status: order.status || 'In preparazione'
      }));
      setOrders(migratedOrders);
  }, []);

  // Load data from localStorage on initial render
  useEffect(() => {
    loadData('pizzeriaMenu', setMenuItems, INITIAL_MENU_ITEMS);
    loadData('pizzeriaOrders', setAndMigrateOrders, []);
    loadData('pizzeriaCustomers', setCustomers, []);
    loadData('pizzeriaCart', setCart, []);
    loadData('pizzeriaPizzaOfTheDay', setPizzaOfTheDay, null);
    loadData('pizzeriaEmail', setPizzeriaEmail, DEFAULT_PIZZERIA_EMAIL);
    loadData('pizzeriaWhatsapp', setPizzeriaWhatsapp, DEFAULT_PIZZERIA_WHATSAPP_NUMBER);
    loadData('pizzeriaAboutImage', setAboutImageUrl, DEFAULT_ABOUT_IMAGE_URL);
    loadData('pizzeriaLogo', setLogoUrl, null);
    loadData('pizzeriaBackground', setBackgroundUrl, null);
  }, [loadData, setAndMigrateOrders]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('pizzeriaCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);
  
  const updateAndSave = useCallback((key: string, data: any, setter: Function) => {
    setter(data);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
    }
  }, []);

  // --- Data Refresh for Polling ---
  const refreshDataFromStorage = useCallback(() => {
    console.log('Polling for new orders...');
    loadData('pizzeriaOrders', setAndMigrateOrders, []);
    loadData('pizzeriaCustomers', setCustomers, []);
  }, [loadData, setAndMigrateOrders]);


  // --- Auth Management ---
  const handleAdminAccess = () => {
    if (isAuthenticated) {
        setShowAdminPanel(!showAdminPanel);
    } else {
        setShowAuthModal(true);
    }
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdminPanel(false);
  };

  // --- Menu Management ---
  const handleSavePizza = (pizzaToSave: Pizza) => {
    let updatedMenu;
    if (pizzaToSave.id) {
      updatedMenu = menuItems.map(p => p.id === pizzaToSave.id ? pizzaToSave : p);
    } else {
      const newPizza = { ...pizzaToSave, id: Date.now() };
      updatedMenu = [...menuItems, newPizza];
    }
    updateAndSave('pizzeriaMenu', updatedMenu, setMenuItems);
  };

  const handleDeletePizza = (pizzaId: number) => {
    const updatedMenu = menuItems.filter(p => p.id !== pizzaId);
    updateAndSave('pizzeriaMenu', updatedMenu, setMenuItems);
  };

  const handleSavePizzaOfTheDay = (pizza: PizzaOfTheDayType) => {
    updateAndSave('pizzeriaPizzaOfTheDay', pizza, setPizzaOfTheDay);
  };

  // --- Customer Management ---
  const handleSaveCustomer = (customerToSave: Customer) => {
    const updatedCustomers = customers.map(c => c.id === customerToSave.id ? customerToSave : c);
    updateAndSave('pizzeriaCustomers', updatedCustomers, setCustomers);
  };
  
  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata.")) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      updateAndSave('pizzeriaCustomers', updatedCustomers, setCustomers);
      
      // Optional: Handle orders of the deleted customer, e.g., anonymize or delete them.
      // For now, we'll leave them to maintain order history.
    }
  };

  // --- Settings Management ---
  const handleSaveSettings = (
    email: string, 
    whatsapp: string, 
    imageUrl: string,
    logo: string | null,
    background: string | null
  ) => {
    updateAndSave('pizzeriaEmail', email, setPizzeriaEmail);
    updateAndSave('pizzeriaWhatsapp', whatsapp, setPizzeriaWhatsapp);
    updateAndSave('pizzeriaAboutImage', imageUrl, setAboutImageUrl);
    updateAndSave('pizzeriaLogo', logo, setLogoUrl);
    updateAndSave('pizzeriaBackground', background, setBackgroundUrl);
  };

  // --- Cart Management ---
  const handleAddToCart = (pizza: Pizza) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === pizza.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...pizza, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (pizzaId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== pizzaId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === pizzaId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const handleCloseModal = () => {
    setCheckoutStep('closed');
  }

  // --- Order Placement ---
  const handlePlaceOrder = (customerData: Omit<Customer, 'id'>) => {
     let customer = customers.find(c => c.phone === customerData.phone);
     if (!customer) {
        customer = { ...customerData, id: Date.now() };
        const newCustomers = [...customers, customer];
        updateAndSave('pizzeriaCustomers', newCustomers, setCustomers);
     }

     const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
     const newOrder: Order = {
        id: Date.now(),
        customerId: customer.id,
        items: cart,
        total,
        date: new Date().toISOString(),
        status: 'In preparazione',
     };
     
     const newOrders = [...orders, newOrder];
     updateAndSave('pizzeriaOrders', newOrders, setOrders);
     
     setLastCompletedOrder(newOrder);
     setLastCompletedCustomer(customer);
     setCart([]); // Clear cart
     setCheckoutStep('confirmation');
  };

  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    updateAndSave('pizzeriaOrders', updatedOrders, setOrders);
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans bg-brand-light text-brand-dark"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header 
        onAdminClick={handleAdminAccess} 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCheckoutStep('cart')}
        isAdmin={isAuthenticated}
        onLogout={handleLogout}
        logoUrl={logoUrl}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {showAdminPanel && isAuthenticated && (
          <MenuAdmin
            menuItems={menuItems}
            onSavePizza={handleSavePizza}
            onDeletePizza={handleDeletePizza}
            orders={orders}
            customers={customers}
            onSaveCustomer={handleSaveCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onRefreshData={refreshDataFromStorage}
            pizzaOfTheDay={pizzaOfTheDay}
            onSavePizzaOfTheDay={handleSavePizzaOfTheDay}
            pizzeriaEmail={pizzeriaEmail}
            pizzeriaWhatsapp={pizzeriaWhatsapp}
            aboutImageUrl={aboutImageUrl}
            logoUrl={logoUrl}
            backgroundUrl={backgroundUrl}
            onSaveSettings={handleSaveSettings}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        <PizzaOfTheDay pizza={pizzaOfTheDay} />
        <Menu menuItems={menuItems} onAddToCart={handleAddToCart} />
        <About aboutImageUrl={aboutImageUrl} />
      </main>
      <Footer />

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {checkoutStep === 'cart' && (
        <Cart 
          cartItems={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onClose={handleCloseModal}
          onCheckout={() => setCheckoutStep('checkout')}
        />
      )}
       {checkoutStep === 'checkout' && (
        <Checkout
          onClose={handleCloseModal}
          onSubmit={handlePlaceOrder}
          cartItems={cart}
        />
      )}
      {checkoutStep === 'confirmation' && lastCompletedOrder && lastCompletedCustomer && (
        <Checkout.Confirmation
          order={lastCompletedOrder}
          customer={lastCompletedCustomer}
          onClose={handleCloseModal}
          pizzeriaEmail={pizzeriaEmail}
          pizzeriaWhatsapp={pizzeriaWhatsapp}
        />
      )}
    </div>
  );
};

export default App;