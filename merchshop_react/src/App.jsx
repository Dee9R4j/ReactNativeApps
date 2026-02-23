import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './Context/ShopContext';
import Layout from './components/Layout';
import Home from './components/Home';
import ShoppingCart from './components/ShoppingCart';
import Wishlist from './components/Wishlist';
import Orders from './components/Orders';

const App = () => {
  return (
    <ShopProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<ShoppingCart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </Router>
    </ShopProvider>
  );
};

export default App;