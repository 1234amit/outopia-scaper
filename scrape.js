// const { chromium } = require("playwright");
// const fs = require("fs");

// async function scrapeOutopia() {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   // Example collection URLs (replace with real Outopia URLs)
//   const collectionUrls = [
//     "https://outopia.com/collections/men",
//     "https://outopia.com/collections/women"
//   ];

//   let products = [];

//   for (const url of collectionUrls) {
//     console.log("Scraping collection:", url);

//     await page.goto(url, { waitUntil: "networkidle" });

//     // Scroll down to load more products
//     for (let i = 0; i < 5; i++) {
//       await page.mouse.wheel(0, 2000);
//       await page.waitForTimeout(2000);
//     }

//     // Collect product links
//     const links = await page.$$eval("a", (anchors) =>
//       anchors
//         .map((a) => a.href)
//         .filter((href) => href.includes("/products/"))
//     );

//     const uniqueLinks = [...new Set(links)];

//     console.log("Found product links:", uniqueLinks.length);

//     for (const productUrl of uniqueLinks) {
//       try {
//         await page.goto(productUrl, { waitUntil: "networkidle" });

//         // const product = await page.evaluate(() => {
//         //   const title = document.querySelector("h1")?.innerText?.trim() || "";
//         //   const price =
//         //     document.querySelector("[class*=price]")?.innerText?.trim() || "";

//         //   const description =
//         //     document.querySelector("[class*=description]")?.innerText?.trim() ||
//         //     "";

//         //   const image =
//         //     document.querySelector("img")?.src ||
//         //     document.querySelector("img")?.getAttribute("data-src") ||
//         //     "";

//         //   return {
//         //     title,
//         //     price,
//         //     description,
//         //     image,
//         //     url: window.location.href
//         //   };
//         // });

//         const product = await page.evaluate(() => {
//         // Title (try multiple selectors)
//         const title =
//             document.querySelector("h1.product__title")?.innerText?.trim() ||
//             document.querySelector("h1")?.innerText?.trim() ||
//             document.querySelector("[class*='product-title']")?.innerText?.trim() ||
//             "";

//         // Price (try multiple selectors)
//         const price =
//             document.querySelector(".price-item--regular")?.innerText?.trim() ||
//             document.querySelector("[class*='price']")?.innerText?.trim() ||
//             "";

//         // Description
//         const description =
//             document.querySelector(".product__description")?.innerText?.trim() ||
//             document.querySelector("[class*='description']")?.innerText?.trim() ||
//             "";

//         // Product Images (get all product images)
//         const images = Array.from(document.querySelectorAll("img"))
//             .map((img) => img.src || img.getAttribute("data-src") || "")
//             .filter((src) => src.includes("cdn/shop/files") || src.includes("cdn/shop/products"))
//             .filter((src) => !src.includes("logo"))
//             .slice(0, 5);

//         return {
//             title,
//             price,
//             description,
//             images,
//             url: window.location.href
//         };
//         });

//         console.log("Scraped:", product.title);

//         products.push(product);
//       } catch (err) {
//         console.log("Failed:", productUrl);
//       }
//     }
//   }

//   await browser.close();

//   fs.writeFileSync("outopia_products.json", JSON.stringify(products, null, 2));
//   console.log("Saved data to outopia_products.json");
// }

// scrapeOutopia();



const axios = require("axios");
const fs = require("fs");

const COLLECTIONS = [
  {
    name: "men",
    url: "https://outopia.com/collections/men/products.json?limit=250"
  },
  {
    name: "women",
    url: "https://outopia.com/collections/women/products.json?limit=250"
  }
];

async function fetchCollection(collection) {
  try {
    console.log(`Fetching ${collection.name}...`);

    const res = await axios.get(collection.url);
    const products = res.data.products;

    return products.map((p) => {
      return {
        id: `outopia_${p.id}`,
        title: p.title,
        description: cleanText(p.body_html),
        price: getPrice(p),
        currency: "USD",
        category: p.product_type || collection.name,
        tags: p.tags,
        images: p.images?.map((img) => img.src) || [],
        url: `https://outopia.com/products/${p.handle}`,
        variants: p.variants.map((v) => ({
          title: v.title,
          price: v.price,
          available: v.available
        })),
        metadata: {
          vendor: p.vendor,
          gender: collection.name
        }
      };
    });
  } catch (err) {
    console.log(`Failed collection ${collection.name}`, err.message);
    return [];
  }
}

// Convert HTML to text
function cleanText(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// Get lowest price
function getPrice(product) {
  const prices = product.variants.map((v) => parseFloat(v.price));
  return Math.min(...prices);
}

async function run() {
  let allProducts = [];

  for (const col of COLLECTIONS) {
    const data = await fetchCollection(col);
    allProducts = allProducts.concat(data);
  }

  // Remove duplicates
  const unique = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values()
  );

  fs.writeFileSync(
    "outopia_products.json",
    JSON.stringify(unique, null, 2)
  );

  console.log(`Done! Saved ${unique.length} products`);
}

run();