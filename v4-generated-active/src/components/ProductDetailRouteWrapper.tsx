import { useParams } from "react-router-dom";
import { LazyProductDetail } from "@/components/LazyRoutes";

export default function ProductDetailRouteWrapper() {
  const { id } = useParams<{ id: string }>();
  return <LazyProductDetail key={id} />;
}
