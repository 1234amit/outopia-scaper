const fs = require("fs");

const raw = JSON.parse(fs.readFileSync("outopia_products.json", "utf-8"));

const converted = raw.map((p) => ({
  id: p.id,
  name: p.title,
  description: p.description,
  price: p.price,
  currency: p.currency,
  category: p.category,
  images: p.images,
  url: p.url,

  metadata: {
    tags: p.tags,
    vendor: "Outopia",
    gender: p.category
  },

  text_for_embedding: `
    ${p.title}
    ${p.description}
    ${p.category}
    ${p.tags?.join(" ")}
  `
}));

fs.writeFileSync("openai_products.json", JSON.stringify(converted, null, 2));

console.log("Converted to OpenAI Commerce format");