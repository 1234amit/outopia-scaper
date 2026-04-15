// const express = require("express");
// const OpenAI = require("openai");
// const supabase = require("./supabaseClient");

// const app = express();
// app.use(express.json());

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

// // app.post("/search", async (req, res) => {
// //   const { query } = req.body;

// //   const vector = await embed(query);

// //   const { data } = await supabase.rpc("match_products", {
// //     query_embedding: vector,
// //     match_threshold: 0.2,
// //     match_count: 10
// //   });

// //   res.json(data);
// // });

// app.post("/search", async (req, res) => {
//   try {
//     const { query } = req.body;

//     const vector = await embed(query);

//     const { data, error } = await supabase.rpc("match_products", {
//       query_embedding: vector,
//       match_threshold: 0.2,
//       match_count: 10
//     });

//     if (error) return res.status(500).json(error);

//     res.json(data || []);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Search failed" });
//   }
// });

// app.listen(3000, () => {
//   console.log("API running on http://localhost:3000");
// });


const express = require("express");
const supabase = require("./supabaseClient");
const { embed } = require("./embed");

const app = express();
app.use(express.json());

/**
 * POST /search
 * Body: { query: "men shoes" }
 */
app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1. Create embedding (LOCAL - FREE)
    const vector = await embed(query);

    // 2. Search in Supabase using pgvector
    const { data, error } = await supabase.rpc("match_products", {
      query_embedding: vector,
      match_threshold: 0.2,
      match_count: 10
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database search failed" });
    }

    // 3. Return results safely
    return res.json(data || []);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
});

/**
 * Health check route (VERY IMPORTANT for testing)
 */
app.get("/", (req, res) => {
  res.send("🚀 AI Commerce Search API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});