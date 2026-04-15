const supabase = require("./supabaseClient");

async function test() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(5);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test();