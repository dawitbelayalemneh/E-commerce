import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

    const getImageUrl = () => {
        if (!product?.image) {
            return "https://placehold.co/600x400?text=No+Image";
        }

        if (/^https?:\/\//i.test(product.image)) {
            return product.image;
        }

        const normalizedPath = product.image.replace(/^\/+/, "");
        return `${BASE_URL}/${normalizedPath}`;
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300 rounded-xl transition-transform p-4 cursor-pointer">
                <img
                    src={getImageUrl()}
                    alt={product.name} 
                    className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
                <p className="text-gray-600 font-medium">${product.price}</p>
            </div>
        </Link>
    );
}

export default ProductCard;