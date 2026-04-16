const express = require("express");
const supabase = require("./supabaseClient");
const { embed } = require("./embed");

const app = express();
app.use(express.json());


// app.post("/search", async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query) {
//       return res.status(400).json({ error: "Query is required" });
//     }

//     // 1. Create embedding (LOCAL - FREE)
//     const vector = await embed(query);

//     // 2. Search in Supabase using pgvector
//     const { data, error } = await supabase.rpc("match_products", {
//       query_embedding: vector,
//       match_threshold: 0.2,
//       match_count: 10
//     });

//     if (error) {
//       console.error("Supabase error:", error);
//       return res.status(500).json({ error: "Database search failed" });
//     }

//     // 3. Return results safely
//     return res.json(data || []);
//   } catch (err) {
//     console.error("Server error:", err);
//     return res.status(500).json({ error: "Search failed" });
//   }
// });

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1. Extract price filter from query
    let maxPrice = null;

    const priceMatch = query.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|cheaper\s*than\s*\$?(\d+)/i);

    if (priceMatch) {
      maxPrice = Number(priceMatch[1] || priceMatch[2] || priceMatch[3]);
    }

    // 2. Clean query (remove price words for embedding)
    const cleanedQuery = query
      .replace(/under\s*\$?\d+/i, "")
      .replace(/below\s*\$?\d+/i, "")
      .replace(/cheaper\s*than\s*\$?\d+/i, "")
      .trim();

    // 3. Create embedding
    const vector = await embed(cleanedQuery);

    // 4. Call Supabase RPC with filter
    const { data, error } = await supabase.rpc("match_products", {
      query_embedding: vector,
      match_threshold: 0.2,
      match_count: 20
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database search failed" });
    }

    let results = data || [];

    // 5. Apply PRICE FILTER (IMPORTANT)
    if (maxPrice !== null) {
      results = results.filter((p) => Number(p.price) <= maxPrice);
    }

    return res.json(results);
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