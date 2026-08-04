import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        fetch(`${BASE_URL}/api/products/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Unable to load products");
                setLoading(false);
            });
    }, [BASE_URL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div role="alert">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-6 bg-white shadow-md">Product List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">No products available.</p>
                )}
            </div>
        </div>
    )
}  

export default ProductList;