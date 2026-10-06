import json

with open('products-raw.json', encoding='utf-8') as f:
    raw = json.load(f)['data']['items']

products = []
for p in raw:
    colors = []
    seen = set()
    for v in p.get('variants', []):
        c = v.get('color')
        if c and c not in seen:
            seen.add(c)
            colors.append(c)
    pid = p['_id']
    products.append({
        "id": pid,
        "name": p['name'],
        "price": p['price'],
        "originalPrice": p.get('originalPrice'),
        "sold": p.get('sold', 0),
        "category": p.get('classifyId', {}).get('name', ''),
        "colors": colors,
        "image": f"/images/products/{pid}.jpg",
    })

with open('../data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

# also write a download list for images
with open('product-image-urls.txt', 'w', encoding='utf-8') as f:
    for p, prod in zip(raw, products):
        img = p['images'][0] if p.get('images') else ''
        f.write(f"{img}\t{prod['image']}\n")

print("Wrote", len(products), "products")
