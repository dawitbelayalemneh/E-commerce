import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addToCart} = useCart();

    const getImageUrl = (image) => {
        if (!image) {
            return "https://placehold.co/600x400?text=No+Image";
        }

        if (/^https?:\/\//i.test(image)) {
            return image;
        }

        const normalizedPath = image.replace(/^\/+/, "");
        return `${BASE_URL}/${normalizedPath}`;
    };

    useEffect(() => {
        fetch(`${BASE_URL}/api/products/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Unable to load product details");
                setLoading(false);
            });
    }, [id, BASE_URL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    const priceValue = Number(product?.price ?? 0);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={getImageUrl(product?.image)}
                        alt={product?.name || "Product image"}
                        className="w-full md:w-1/2 h-auto object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product?.name || "Unnamed product"}</h1>
                        <p className="text-xl text-gray-600 font-semibold mb-4">{product?.description || "No description available."}</p>
                        <p className="text-2xl font-semibold text-gray-600 mb-6">${Number.isFinite(priceValue) ? priceValue.toFixed(2) : "0.00"}</p>
                        <button 
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                        {/* Home Button */}
                        <div className="mt-4">
                            <a href="/" className="text-blue-600 hover:underline">
                                &larr; Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;