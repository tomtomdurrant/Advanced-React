import { useContext, createContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // Custom provider to store cart state
  // and updaters
  const [cartOpen, setCartOpen] = useState(false);
  function closeCart() {
    setCartOpen(false);
  }
  function openCart() {
    setCartOpen(true);
  }
  return (
    <LocalStateProvider value={{ cartOpen, setCartOpen, closeCart, openCart }}>
      {children}
    </LocalStateProvider>
  );
}

// Custom hook to access the cart from local state
function useCart(params) {
  // This is the consumer
  const allContextFunctions = useContext(LocalStateContext);
  return allContextFunctions;
}

export { CartStateProvider, useCart };
