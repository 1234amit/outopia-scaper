// const fs = require("fs");
// const OpenAI = require("openai");
// const supabase = require("./supabaseClient");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// async function embed(text) {
//   const res = await client.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text
//   });

//   return res.data[0].embedding;
// }

// async function run() {
//   const products = JSON.parse(fs.readFileSync("openai_products.json"));

//   for (const p of products) {
//     const vector = await embed(p.text_for_embedding);

//     await supabase.from("products").upsert({
//       id: p.id,
//       name: p.name,
//       description: p.description,
//       price: p.price,
//       currency: p.currency,
//       category: p.category,
//       images: p.images,
//       url: p.url,
//       metadata: p.metadata,
//       embedding: vector
//     });

//     console.log("Inserted:", p.name);
//   }
// }

// run();


const fs = require("fs");
const supabase = require("./supabaseClient");
const { embed } = require("./embed"); // LOCAL EMBEDDING

async function run() {
  const products = JSON.parse(
    fs.readFileSync("openai_products.json")
  );

  for (const p of products) {
    try {
      const vector = await embed(p.text_for_embedding);

      await supabase.from("products").upsert({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        category: p.category,
        images: p.images,
        url: p.url,
        metadata: p.metadata,
        embedding: vector
      });

      console.log("Inserted:", p.name);
    } catch (err) {
      console.log("Failed:", p.name);
      console.error(err.message);
    }
  }

  console.log("DONE UPLOADING PRODUCTS 🚀");
}

run();