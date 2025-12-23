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

  const content = result.data;

  return (
    <main className="container mx-auto py-8">
      {content.blocks.map((block, index) => (
        <section key={index} className="mb-8">
          <div className="text-xs text-gray-500 mb-2">Block type: {block.type}</div>
          {block.content.headline && (
            <h2 className="text-2xl font-bold mb-2">{block.content.headline}</h2>
          )}
          {block.content.subheadline && (
            <h3 className="text-xl mb-2">{block.content.subheadline}</h3>
          )}
          {block.content.body && (
            <div className="prose">
              {typeof block.content.body === "string"
                ? block.content.body
                : block.content.body.value}
            </div>
          )}
          {block.content.bullets && (
            <ul className="list-disc pl-5">
              {block.content.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
          {block.content.ctas && block.content.ctas.length > 0 && (
            <div className="mt-4">
              {block.content.ctas.map((cta, i) => (
                <button key={i} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  {cta.label}
                </button>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
