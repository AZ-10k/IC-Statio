import { LazyProductDetail } from "@/components/LazyRoutes";
import { useParams } from "react-router-dom";

export default function LazyProductDetailWrapper() {
  const { id } = useParams();
  return <LazyProductDetail key={id} />;
}
