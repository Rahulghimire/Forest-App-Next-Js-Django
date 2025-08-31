export const metadata = {
  title: "Product Details",
};
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;
  return <div>Product{productId}</div>;
}
