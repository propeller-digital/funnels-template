import { fetchCmsSpec } from "@/lib/cms";

export default async function Home() {
  const result = await fetchCmsSpec();

  if (!result.success) {
    return (
      <main>
        <p>Error loading content: {result.error}</p>
      </main>
    );
  }

  const spec = result.data;

  return <main className="">{/* Render sections based on spec.components */}</main>;
}
