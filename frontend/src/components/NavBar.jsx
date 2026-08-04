import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function NavBar() {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
                E Cart
            </Link>
            <Link to="/cart" className="relative text-gray-800 hover:text-gray-600 font-medium">
                Cart
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2">
                        {cartCount}
                    </span>
                )}
            </Link>
        </nav>
    );
}

export default NavBar;