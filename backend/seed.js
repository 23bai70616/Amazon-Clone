import pool from './src/config/db.js';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database and dropping existing tables...');

    // Drop tables if they exist
    await pool.query(`
      DROP TABLE IF EXISTS otps;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS users;
    `);

    console.log('Creating tables...');

    // Create OTPs Table
    await pool.query(`
      CREATE TABLE otps (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Users Table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        mobile VARCHAR(20) UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Categories Table
    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );
    `);

    // Create Products Table
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Orders Table
    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Order Items Table
    await pool.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price_at_time DECIMAL(10, 2) NOT NULL
      );
    `);

    console.log('Inserting seed data...');

    // Seed Data
    await pool.query(`
      INSERT INTO users (name, email, password) VALUES 
      ('Guest User', 'guest@example.com', '$2b$10$6pptx9xAyOAT8ZkC3lPpceIrOnzEBLG0nZd/rsX4yyKCanI6sOpEu')
    `);

    const electronicsCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Electronics', 'Gadgets and devices') RETURNING id");
    const homeCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Home & Kitchen', 'Home appliances and decor') RETURNING id");
    const mobileCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Mobiles', 'Smartphones and accessories') RETURNING id");
    const fashionCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Fashion', 'Clothing, shoes and jewelry') RETURNING id");
    const beautyCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Beauty', 'Personal care and makeup') RETURNING id");
    const pantryCategory = await pool.query("INSERT INTO categories (name, description) VALUES ('Pantry', 'Groceries and daily essentials') RETURNING id");

    const elecId = electronicsCategory.rows[0].id;
    const homeId = homeCategory.rows[0].id;
    const mobId = mobileCategory.rows[0].id;
    const fasId = fashionCategory.rows[0].id;
    const btyId = beautyCategory.rows[0].id;
    const panId = pantryCategory.rows[0].id;

    // Helper for optimized unsplash URLs
    const opt = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

    await pool.query(`
      INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES 
      -- Electronics (6 items)
      ('Sony WH-1000XM5 Wireless Headphones', 'Silver, Noise Canceling by Sony.', 29990.00, 50, $1, $7),
      ('Apple Watch Series 8 GPS', 'Midnight Aluminum Case with Sport Band.', 45900.00, 30, $2, $7),
      ('Samsung 55" 4K Crystal UHD TV', 'Titan Grey, Smart TV by Samsung.', 52990.00, 15, $3, $7),
      ('JBL Flip 6 Waterproof Speaker', 'Ocean Blue, Portable by JBL.', 9999.00, 200, $4, $7),
      ('Dell XPS 13 Laptop', '13.4-inch FHD+, Intel Core i7, 16GB RAM.', 114990.00, 10, $5, $7),
      ('Logitech MX Master 3S Mouse', 'Wireless Performance Mouse by Logitech.', 10995.00, 100, $6, $7),
      
      -- Home & Kitchen (6 items)
      ('Nespresso Vertuo Coffee Machine', 'Piano Black, Coffee Maker by Nespresso.', 15499.00, 100, $8, $14),
      ('Black+Decker Robotic Vacuum', '3-in-1 Robot Vacuum by Black+Decker.', 24999.00, 40, $9, $14),
      ('Dyson V11 Absolute Pro', 'Cord-free Power by Dyson.', 52900.00, 25, $10, $14),
      ('Philips Air Fryer XL', '4.1L capacity with Rapid Air Technology.', 9999.00, 80, $11, $14),
      ('Instant Pot Duo 7-in-1', 'Multi-Use Pressure Cooker, 6 Quart.', 12499.00, 60, $12, $14),
      ('Kent Grand RO Water Purifier', 'Advanced RO+UV+UF purification.', 18500.00, 35, $13, $14),
      
      -- Mobiles (8 items)
      ('iPhone 15 Pro, 256GB', 'Natural Titanium, 5G by Apple.', 134900.00, 20, $15, $23),
      ('Samsung Galaxy S24 Ultra', 'Titanium Yellow, AI Camera by Samsung.', 129999.00, 15, $16, $23),
      ('OnePlus 12 5G', 'Flowy Emerald, Hasselblad Camera by OnePlus.', 64999.00, 40, $17, $23),
      ('Google Pixel 8 Pro', 'Obsidian, Google AI by Google.', 106999.00, 25, $18, $23),
      ('Realme Narzo 60 5G', 'Mars Orange, Ultra Smooth display.', 17999.00, 100, $19, $23),
      ('Redmi Note 13 Pro+ 5G', 'Fusion Purple, 200MP Camera.', 31999.00, 150, $20, $23),
      ('Nothing Phone (2)', 'Dark Grey, Glyph Interface.', 44999.00, 60, $21, $23),
      ('Samsung Galaxy Z Fold 5', 'Phantom Black, Foldable display.', 154999.00, 10, $22, $23),
      
      -- Fashion (8 items)
      ('Nike Air Max 270', 'Black/White Casual Shoes by Nike.', 12995.00, 60, $24, $32),
      ('Levis 511 Slim Fit Jeans', 'Dark Wash Stretch Denim by Levis.', 3499.00, 120, $25, $32),
      ('Ray-Ban Wayfarer Classic', 'Black Gloss Sunglasses by Ray-Ban.', 8990.00, 45, $26, $32),
      ('Adidas Ultraboost Light', 'Cloud White Running Shoes by Adidas.', 18999.00, 50, $27, $32),
      ('Puma T7 Track Jacket', 'Classic Sportswear by Puma.', 4999.00, 80, $28, $32),
      ('H&M Cotton Shirt', 'Regular Fit White Shirt by H&M.', 1499.00, 200, $29, $32),
      ('ZARA Floral Print Dress', 'Comfortable summer wear.', 2990.00, 45, $30, $32),
      ('Titan Neo Men Watch', 'Classic Analog Leather Strap.', 5495.00, 30, $31, $32),
      
      -- Beauty (5 items)
      ('LOreal Paris Revitalift Serum', '1.5% Hyaluronic Acid Serum by LOreal.', 1299.00, 150, $33, $38),
      ('Philips HP8100/46 Hair Dryer', '1000W Gentle Drying by Philips.', 849.00, 300, $34, $38),
      ('The Body Shop Tea Tree Oil', 'Community Fair Trade Tea Tree by The Body Shop.', 695.00, 200, $35, $38),
      ('Maybelline Fit Me Foundation', 'Matte + Poreless 30ml by Maybelline.', 599.00, 400, $36, $38),
      ('Forest Essentials Body Mist', 'Nargis Fragrance 130ml by Forest Essentials.', 2475.00, 60, $37, $38),
      
      -- Pantry (9 items)
      ('Nescafe Classic Coffee, 200g', 'Signature Pure Coffee by Nescafe.', 575.00, 400, $39, $48),
      ('Fortune Sunlite Oil, 5L', 'Refined Sunflower Oil by Fortune.', 899.00, 100, $40, $48),
      ('Kelloggs Corn Flakes, 1.2kg', 'Real Almond and Honey by Kelloggs.', 450.00, 150, $41, $48),
      ('Amul Pure Ghee, 1L', 'Special Grade Desi Ghee by Amul.', 680.00, 250, $42, $48),
      ('Daawat Rozana Basmati Rice, 5kg', 'Pure Basmati Rice for everyday use.', 499.00, 300, $43, $48),
      ('Aashirvaad Select Atta, 10kg', 'Premium Sharbati Wheat Flour.', 520.00, 200, $44, $48),
      ('Maggi Noodles, 70g (Pack of 12)', 'Your favorite 2-minute noodles.', 168.00, 1000, $45, $48),
      ('Surf Excel Matic Liquid, 2L', 'Top Load Detergent with advanced formula.', 399.00, 150, $46, $48),
      ('Dettol Original Liquid Handwash', 'PH Balanced germ protection.', 150.00, 400, $47, $48)
    `, [
      opt('photo-1546435770-a3e426bf472b'), "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRigmyML5LmpKTb6gN6L3-n_4fKu17ZZGRR_g&s", opt('photo-1593359677879-a4bb92f829d1'), opt('photo-1608043152269-423dbba4e7e1'), opt('photo-1593642632823-8f785ba67e45'), opt('photo-1527864550417-7fd91fc51a46'), elecId,
      opt('photo-1517668808822-9ebb02f2a0e6'), opt('photo-1518413151772-88f158eccba3'), opt('photo-1558317374-067fb5f30001'), opt('photo-1626082896492-766af4eb6501'), "https://m.media-amazon.com/images/I/71Z401LjFFL.jpg", "https://shop.kent.co.in/cdn/shop/files/A_Info_KENT_Grand__N_1024x1024@2x.png?v=1759237259", homeId,
      opt('photo-1696446701796-da61225697cc'), opt('photo-1610945265064-0e34e5519bbf'), opt('photo-1598327105666-5b89351aff97'), opt('photo-1616348436168-de43ad0db179'), opt('photo-1511707171634-5f897ff02aa9'), opt('photo-1598327105854-c8674f10ff6c'), opt('photo-1611707171634-5f897ff02aa9'), opt('photo-1610945265064-0e34e5519bbf'), mobId,
      opt('photo-1542291026-7eec264c274d'), opt('photo-1542272604-787c3835535d'), opt('photo-1572635196237-14b3f281503f'), opt('photo-1587563871167-1ee9c731aefb'), opt('photo-1591047139829-d91aecb6caea'), opt('photo-1596755094514-f87034a26cc1'), opt('photo-1539008835270-18eb648fc9bf'), opt('photo-1524386121903-8822501a357f'), fasId,
      opt('photo-1556228720-195a672e8a03'), opt('photo-1522338242992-e1a54906a8da'), opt('photo-1608248597279-f99d160bfcbc'), opt('photo-1594465919760-441fe5908ab0'), opt('photo-1547887538-e3a2f32cb1cc'), btyId,
      opt('photo-1514432324607-a09d9b4aefdd'), opt('photo-1474979266404-7eaacbcd87c5'), opt('photo-1584473457406-6240486418e9'), opt('photo-1627308595229-7830a5c91f9f'), opt('photo-1586201375761-83865001e31c'), opt('photo-1509440159596-0249088772ff'), opt('photo-1569718212165-3a8278d5f624'), opt('photo-1567113463300-102a7eb3cb26'), opt('photo-1559839734-2b71f1e3c770'), panId
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
