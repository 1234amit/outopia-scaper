const supabase = require("./supabaseClient");

async function insertProduct() {
  const { data, error } = await supabase.from("products").insert([
    {
      id: "p1",
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      currency: "USD",
      category: "test",
      images: ["img1.jpg"],
      url: "https://example.com",
      metadata: { source: "manual" },
      embedding: Array(1536).fill(0) // dummy embedding
    }
  ]);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

insertProduct();