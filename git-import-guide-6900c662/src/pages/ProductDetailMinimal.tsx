import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, Product } from "@/data/products";

const ProductDetailMinimal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [forceUpdate, setForceUpdate] = useState(0);
  const product = getProductById(id || "");

  // Force re-render when id changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1); // Force re-render
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Product not found</h1>
        <p>Try: /product-minimal/2026-daily-planner</p>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div key={`${id}-${forceUpdate}`} style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <p>Price: {product.priceDZD} DZD</p>
      <p>{product.description}</p>
      
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexDirection: "column" }}>
        <Link to="/shop" style={{ padding: "10px", background: "#007bff", color: "white", textDecoration: "none", width: "200px", textAlign: "center" }}>
          Back to Shop
        </Link>
        
        <Link to="/" style={{ padding: "10px", background: "#28a745", color: "white", textDecoration: "none", width: "200px", textAlign: "center" }}>
          Home
        </Link>
        
        <button 
          onClick={() => navigate("/product-minimal/weekly-planner")}
          style={{ padding: "10px", background: "#dc3545", color: "white", border: "none", width: "200px", textAlign: "center", cursor: "pointer" }}
        >
          Other Product (Weekly Planner)
        </button>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <p>This is a minimal ProductDetail to test navigation.</p>
        <p>If navigation works here but not on the full ProductDetail, the issue is in one of the subcomponents.</p>
        <p>Current product ID: {id}</p>
        <p>Product from state: {product.name}</p>
      </div>
    </div>
  );
};

export default ProductDetailMinimal;
