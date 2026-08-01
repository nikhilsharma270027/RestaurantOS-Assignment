// prisma/seed.ts
import { prisma } from "@/app/lib/prisma";

async function main() {
  console.log("🌱 Seeding Recipes & Ingredients...\n");

  // ==========================================
  // 1. GET EXISTING MENU ITEMS & SUPPLIERS
  // ==========================================
  const menuItems = await prisma.menuItem.findMany({
    select: { id: true, name: true, categoryId: true },
  });

  // Get or create a default supplier
  let supplier = await prisma.supplier.findFirst();
  
  if (!supplier) {
    console.log("📦 Creating default supplier...");
    supplier = await prisma.supplier.create({
      data: {
        name: "Fresh Foods Wholesale",
        contactName: "John Supplier",
        email: "john@freshfoods.com",
        phone: "+91 98765 43210",
        address: "123 Market Street, Food District",
        paymentTerms: "Net 30",
        isActive: true,
      },
    });
    console.log("✅ Default supplier created\n");
  }

  console.log(`📋 Found ${menuItems.length} menu items\n`);

  // ==========================================
  // 2. CREATE INGREDIENTS (20 ingredients)
  // ==========================================
  console.log("🥬 Creating ingredients...");

  const ingredientsData = [
    {
      name: "All-Purpose Flour",
      unit: "kg",
      costPerUnit: 45.00,
      currentStock: 25.5,
      reorderLevel: 5.0,
      wasteQty: 0.5,
      supplierId: supplier.id,
    },
    {
      name: "Fresh Tomatoes",
      unit: "kg",
      costPerUnit: 40.00,
      currentStock: 12.0,
      reorderLevel: 3.0,
      wasteQty: 1.0,
      supplierId: supplier.id,
    },
    {
      name: "Mozzarella Cheese",
      unit: "kg",
      costPerUnit: 450.00,
      currentStock: 8.5,
      reorderLevel: 2.0,
      wasteQty: 0.2,
      supplierId: supplier.id,
    },
    {
      name: "Chicken Breast",
      unit: "kg",
      costPerUnit: 320.00,
      currentStock: 15.0,
      reorderLevel: 5.0,
      wasteQty: 0.8,
      supplierId: supplier.id,
    },
    {
      name: "Basmati Rice",
      unit: "kg",
      costPerUnit: 120.00,
      currentStock: 30.0,
      reorderLevel: 10.0,
      wasteQty: 0.3,
      supplierId: supplier.id,
    },
    {
      name: "Olive Oil",
      unit: "l",
      costPerUnit: 650.00,
      currentStock: 4.5,
      reorderLevel: 1.0,
      wasteQty: 0.1,
      supplierId: supplier.id,
    },
    {
      name: "Garlic",
      unit: "kg",
      costPerUnit: 180.00,
      currentStock: 3.2,
      reorderLevel: 1.0,
      wasteQty: 0.3,
      supplierId: supplier.id,
    },
    {
      name: "Fresh Basil",
      unit: "g",
      costPerUnit: 2.50,
      currentStock: 450.0,
      reorderLevel: 100.0,
      wasteQty: 50.0,
      supplierId: supplier.id,
    },
    {
      name: "Butter",
      unit: "kg",
      costPerUnit: 500.00,
      currentStock: 6.0,
      reorderLevel: 2.0,
      wasteQty: 0.2,
      supplierId: supplier.id,
    },
    {
      name: "Heavy Cream",
      unit: "l",
      costPerUnit: 280.00,
      currentStock: 3.0,
      reorderLevel: 1.5,
      wasteQty: 0.2,
      supplierId: supplier.id,
    },
    {
      name: "Parmesan Cheese",
      unit: "kg",
      costPerUnit: 850.00,
      currentStock: 2.5,
      reorderLevel: 1.0,
      wasteQty: 0.1,
      supplierId: supplier.id,
    },
    {
      name: "Eggs",
      unit: "dozen",
      costPerUnit: 90.00,
      currentStock: 12.0,
      reorderLevel: 3.0,
      wasteQty: 1.0,
      supplierId: supplier.id,
    },
    {
      name: "Romaine Lettuce",
      unit: "kg",
      costPerUnit: 80.00,
      currentStock: 2.0,
      reorderLevel: 1.5,
      wasteQty: 0.5,
      supplierId: supplier.id,
    },
    {
      name: "Beef Steak (Ribeye)",
      unit: "kg",
      costPerUnit: 1200.00,
      currentStock: 4.0,
      reorderLevel: 2.0,
      wasteQty: 0.3,
      supplierId: supplier.id,
    },
    {
      name: "Atlantic Salmon",
      unit: "kg",
      costPerUnit: 1500.00,
      currentStock: 3.5,
      reorderLevel: 1.5,
      wasteQty: 0.2,
      supplierId: supplier.id,
    },
    {
      name: "Coffee Beans",
      unit: "kg",
      costPerUnit: 800.00,
      currentStock: 5.0,
      reorderLevel: 2.0,
      wasteQty: 0.1,
      supplierId: supplier.id,
    },
    {
      name: "Fresh Oranges",
      unit: "kg",
      costPerUnit: 90.00,
      currentStock: 8.0,
      reorderLevel: 3.0,
      wasteQty: 1.0,
      supplierId: supplier.id,
    },
    {
      name: "Mango Pulp",
      unit: "kg",
      costPerUnit: 200.00,
      currentStock: 3.0,
      reorderLevel: 1.5,
      wasteQty: 0.2,
      supplierId: supplier.id,
    },
    {
      name: "Dark Chocolate",
      unit: "kg",
      costPerUnit: 600.00,
      currentStock: 2.5,
      reorderLevel: 1.0,
      wasteQty: 0.1,
      supplierId: supplier.id,
    },
    {
      name: "Fresh Mint",
      unit: "g",
      costPerUnit: 1.50,
      currentStock: 300.0,
      reorderLevel: 100.0,
      wasteQty: 40.0,
      supplierId: supplier.id,
    },
  ];

  const ingredients = [];
  for (const ingredientData of ingredientsData) {
    const ingredient = await prisma.ingredient.create({ data: ingredientData });
    ingredients.push(ingredient);
  }

  console.log(`✅ ${ingredients.length} ingredients created\n`);

  // ==========================================
  // 3. CREATE RECIPES (10 recipes)
  // ==========================================
  console.log("📖 Creating recipes...");

  // Helper function to find menu item by name
  const findMenuItem = (name: string) => {
    const item = menuItems.find(mi => mi.name.toLowerCase().includes(name.toLowerCase()));
    if (!item) console.warn(`   ⚠️  Menu item not found: ${name}`);
    return item;
  };

  // Helper function to find ingredient by name
  const findIngredient = (name: string) => {
    const ingredient = ingredients.find(i => i.name.toLowerCase().includes(name.toLowerCase()));
    if (!ingredient) console.warn(`   ⚠️  Ingredient not found: ${name}`);
    return ingredient;
  };

  // Recipe 1: Margherita Pizza
  const pizzaItem = findMenuItem("Margherita");
  if (pizzaItem) {
    const recipe1 = await prisma.recipe.create({
      data: {
        name: "Classic Margherita Pizza",
        instructions: "1. Preheat oven to 250°C. 2. Roll out pizza dough to 12-inch circle. 3. Spread crushed tomatoes evenly. 4. Tear fresh mozzarella and distribute. 5. Drizzle olive oil and add basil leaves. 6. Bake for 10-12 minutes until crust is golden. 7. Slice and serve hot.",
        yieldQty: 1,
        prepTimeMinutes: 15,
        menuItemId: pizzaItem.id,
      },
    });

    // Add recipe items
    const flour = findIngredient("All-Purpose Flour");
    const tomato = findIngredient("Fresh Tomatoes");
    const mozzarella = findIngredient("Mozzarella Cheese");
    const oliveOil = findIngredient("Olive Oil");
    const basil = findIngredient("Fresh Basil");

    if (flour && tomato && mozzarella && oliveOil && basil) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe1.id, ingredientId: flour.id, quantity: 0.250 },
          { recipeId: recipe1.id, ingredientId: tomato.id, quantity: 0.150 },
          { recipeId: recipe1.id, ingredientId: mozzarella.id, quantity: 0.125 },
          { recipeId: recipe1.id, ingredientId: oliveOil.id, quantity: 0.015 },
          { recipeId: recipe1.id, ingredientId: basil.id, quantity: 10 },
        ],
      });
    }
    console.log("   ✅ Margherita Pizza recipe created");
  }

  // Recipe 2: Grilled Chicken Breast
  const chickenItem = findMenuItem("Grilled Chicken");
  if (chickenItem) {
    const recipe2 = await prisma.recipe.create({
      data: {
        name: "Herb-Marinated Grilled Chicken",
        instructions: "1. Marinate chicken breast with olive oil, garlic, and herbs for 2 hours. 2. Preheat grill to medium-high heat. 3. Grill chicken for 6-7 minutes per side. 4. Let rest for 5 minutes before slicing. 5. Serve with mashed potatoes and steamed vegetables.",
        yieldQty: 1,
        prepTimeMinutes: 25,
        menuItemId: chickenItem.id,
      },
    });

    const chicken = findIngredient("Chicken Breast");
    const oil = findIngredient("Olive Oil");
    const garlic = findIngredient("Garlic");
    const butter = findIngredient("Butter");

    if (chicken && oil && garlic && butter) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe2.id, ingredientId: chicken.id, quantity: 0.250 },
          { recipeId: recipe2.id, ingredientId: oil.id, quantity: 0.030 },
          { recipeId: recipe2.id, ingredientId: garlic.id, quantity: 0.015 },
          { recipeId: recipe2.id, ingredientId: butter.id, quantity: 0.020 },
        ],
      });
    }
    console.log("   ✅ Grilled Chicken Breast recipe created");
  }

  // Recipe 3: Caesar Salad
  const saladItem = findMenuItem("Caesar");
  if (saladItem) {
    const recipe3 = await prisma.recipe.create({
      data: {
        name: "Classic Caesar Salad",
        instructions: "1. Wash and chop romaine lettuce. 2. Prepare Caesar dressing with anchovy paste, garlic, lemon, and parmesan. 3. Toss lettuce with dressing. 4. Top with croutons and shaved parmesan. 5. Add grilled chicken if desired.",
        yieldQty: 1,
        prepTimeMinutes: 8,
        menuItemId: saladItem.id,
      },
    });

    const lettuce = findIngredient("Romaine Lettuce");
    const parmesan = findIngredient("Parmesan Cheese");
    const eggs = findIngredient("Eggs");
    const g = findIngredient("Garlic");

    if (lettuce && parmesan && eggs && g) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe3.id, ingredientId: lettuce.id, quantity: 0.150 },
          { recipeId: recipe3.id, ingredientId: parmesan.id, quantity: 0.030 },
          { recipeId: recipe3.id, ingredientId: eggs.id, quantity: 1 },
          { recipeId: recipe3.id, ingredientId: g.id, quantity: 0.005 },
        ],
      });
    }
    console.log("   ✅ Caesar Salad recipe created");
  }

  // Recipe 4: Pasta Alfredo
  const pastaItem = findMenuItem("Pasta Alfredo");
  if (pastaItem) {
    const recipe4 = await prisma.recipe.create({
      data: {
        name: "Creamy Fettuccine Alfredo",
        instructions: "1. Cook fettuccine pasta in salted boiling water until al dente. 2. In a pan, melt butter and sauté minced garlic. 3. Add heavy cream and simmer for 3 minutes. 4. Stir in grated parmesan cheese until melted. 5. Toss cooked pasta in the sauce. 6. Season with salt, pepper, and garnish with parsley.",
        yieldQty: 1,
        prepTimeMinutes: 20,
        menuItemId: pastaItem.id,
      },
    });

    const flour = findIngredient("All-Purpose Flour");
    const cream = findIngredient("Heavy Cream");
    const parmesan = findIngredient("Parmesan Cheese");
    const butter = findIngredient("Butter");
    const garlic = findIngredient("Garlic");

    if (flour && cream && parmesan && butter && garlic) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe4.id, ingredientId: flour.id, quantity: 0.200 },
          { recipeId: recipe4.id, ingredientId: cream.id, quantity: 0.150 },
          { recipeId: recipe4.id, ingredientId: parmesan.id, quantity: 0.050 },
          { recipeId: recipe4.id, ingredientId: butter.id, quantity: 0.030 },
          { recipeId: recipe4.id, ingredientId: garlic.id, quantity: 0.010 },
        ],
      });
    }
    console.log("   ✅ Pasta Alfredo recipe created");
  }

  // Recipe 5: Beef Steak
  const steakItem = findMenuItem("Beef Steak");
  if (steakItem) {
    const recipe5 = await prisma.recipe.create({
      data: {
        name: "Perfect Ribeye Steak",
        instructions: "1. Remove steak from fridge 30 minutes before cooking. 2. Season generously with salt and pepper. 3. Heat cast iron pan until smoking hot. 4. Add butter and garlic to pan. 5. Sear steak 4-5 minutes per side for medium-rare. 6. Baste with butter while cooking. 7. Rest for 5 minutes before serving.",
        yieldQty: 1,
        prepTimeMinutes: 30,
        menuItemId: steakItem.id,
      },
    });

    const beef = findIngredient("Beef Steak");
    const butter = findIngredient("Butter");
    const garlic = findIngredient("Garlic");

    if (beef && butter && garlic) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe5.id, ingredientId: beef.id, quantity: 0.250 },
          { recipeId: recipe5.id, ingredientId: butter.id, quantity: 0.030 },
          { recipeId: recipe5.id, ingredientId: garlic.id, quantity: 0.010 },
        ],
      });
    }
    console.log("   ✅ Beef Steak recipe created");
  }

  // Recipe 6: Butter Chicken
  const butterChickenItem = findMenuItem("Butter Chicken");
  if (butterChickenItem) {
    const recipe6 = await prisma.recipe.create({
      data: {
        name: "Rich Butter Chicken",
        instructions: "1. Marinate chicken in yogurt and spices for 4 hours. 2. Grill or bake chicken until charred. 3. In a pan, melt butter and sauté onions, garlic, and ginger. 4. Add tomato puree, cream, and spices. 5. Simmer for 20 minutes. 6. Add grilled chicken pieces. 7. Finish with cream and serve with naan.",
        yieldQty: 2,
        prepTimeMinutes: 25,
        menuItemId: butterChickenItem.id,
      },
    });

    const chicken = findIngredient("Chicken Breast");
    const tomato = findIngredient("Fresh Tomatoes");
    const butter = findIngredient("Butter");
    const cream = findIngredient("Heavy Cream");
    const garlic = findIngredient("Garlic");

    if (chicken && tomato && butter && cream && garlic) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe6.id, ingredientId: chicken.id, quantity: 0.400 },
          { recipeId: recipe6.id, ingredientId: tomato.id, quantity: 0.300 },
          { recipeId: recipe6.id, ingredientId: butter.id, quantity: 0.050 },
          { recipeId: recipe6.id, ingredientId: cream.id, quantity: 0.100 },
          { recipeId: recipe6.id, ingredientId: garlic.id, quantity: 0.020 },
        ],
      });
    }
    console.log("   ✅ Butter Chicken recipe created");
  }

  // Recipe 7: Chocolate Lava Cake
  const lavaCakeItem = findMenuItem("Chocolate Lava");
  if (lavaCakeItem) {
    const recipe7 = await prisma.recipe.create({
      data: {
        name: "Molten Chocolate Lava Cake",
        instructions: "1. Melt dark chocolate and butter together. 2. Whisk eggs and sugar until fluffy. 3. Fold chocolate mixture into eggs. 4. Add flour and mix gently. 5. Pour into greased ramekins. 6. Bake at 200°C for 12-14 minutes. 7. Center should be soft. Serve immediately with ice cream.",
        yieldQty: 2,
        prepTimeMinutes: 10,
        menuItemId: lavaCakeItem.id,
      },
    });

    const chocolate = findIngredient("Dark Chocolate");
    const butter = findIngredient("Butter");
    const eggs = findIngredient("Eggs");
    const flour = findIngredient("All-Purpose Flour");

    if (chocolate && butter && eggs && flour) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe7.id, ingredientId: chocolate.id, quantity: 0.100 },
          { recipeId: recipe7.id, ingredientId: butter.id, quantity: 0.050 },
          { recipeId: recipe7.id, ingredientId: eggs.id, quantity: 2 },
          { recipeId: recipe7.id, ingredientId: flour.id, quantity: 0.030 },
        ],
      });
    }
    console.log("   ✅ Chocolate Lava Cake recipe created");
  }

  // Recipe 8: Mango Lassi
  const lassiItem = findMenuItem("Mango Lassi");
  if (lassiItem) {
    const recipe8 = await prisma.recipe.create({
      data: {
        name: "Creamy Mango Lassi",
        instructions: "1. Combine mango pulp, yogurt, milk, and sugar in a blender. 2. Add a pinch of cardamom powder. 3. Blend until smooth and creamy. 4. Pour into glasses over ice. 5. Garnish with chopped pistachios and saffron strands.",
        yieldQty: 2,
        prepTimeMinutes: 5,
        menuItemId: lassiItem.id,
      },
    });

    const mango = findIngredient("Mango Pulp");
    const cream = findIngredient("Heavy Cream");

    if (mango && cream) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe8.id, ingredientId: mango.id, quantity: 0.200 },
          { recipeId: recipe8.id, ingredientId: cream.id, quantity: 0.100 },
        ],
      });
    }
    console.log("   ✅ Mango Lassi recipe created");
  }

  // Recipe 9: Grilled Salmon
  const salmonItem = findMenuItem("Grilled Salmon");
  if (salmonItem) {
    const recipe9 = await prisma.recipe.create({
      data: {
        name: "Lemon Butter Grilled Salmon",
        instructions: "1. Season salmon fillet with salt, pepper, and lemon zest. 2. Heat grill to medium-high. 3. Place salmon skin-side down on oiled grates. 4. Cook for 4-5 minutes per side. 5. Melt butter with lemon juice and garlic for sauce. 6. Drizzle sauce over salmon. 7. Serve with asparagus and baby potatoes.",
        yieldQty: 1,
        prepTimeMinutes: 20,
        menuItemId: salmonItem.id,
      },
    });

    const salmon = findIngredient("Atlantic Salmon");
    const butter = findIngredient("Butter");
    const garlic = findIngredient("Garlic");

    if (salmon && butter && garlic) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe9.id, ingredientId: salmon.id, quantity: 0.200 },
          { recipeId: recipe9.id, ingredientId: butter.id, quantity: 0.030 },
          { recipeId: recipe9.id, ingredientId: garlic.id, quantity: 0.010 },
        ],
      });
    }
    console.log("   ✅ Grilled Salmon recipe created");
  }

  // Recipe 10: Fresh Orange Juice
  const juiceItem = findMenuItem("Orange Juice");
  if (juiceItem) {
    const recipe10 = await prisma.recipe.create({
      data: {
        name: "Fresh Squeezed Orange Juice",
        instructions: "1. Select ripe, sweet oranges. 2. Roll oranges on counter to loosen juice. 3. Cut oranges in half. 4. Use citrus juicer to extract juice. 5. Strain to remove pulp if desired. 6. Pour over ice and serve immediately. 7. Optional: add a pinch of black salt for enhanced flavor.",
        yieldQty: 1,
        prepTimeMinutes: 3,
        menuItemId: juiceItem.id,
      },
    });

    const oranges = findIngredient("Fresh Oranges");

    if (oranges) {
      await prisma.recipeItem.createMany({
        data: [
          { recipeId: recipe10.id, ingredientId: oranges.id, quantity: 0.300 },
        ],
      });
    }
    console.log("   ✅ Fresh Orange Juice recipe created");
  }

  console.log(`\n✅ 10 recipes created\n`);

  // ==========================================
  // 4. SUMMARY
  // ==========================================
  const ingredientCount = await prisma.ingredient.count();
  const recipeCount = await prisma.recipe.count();
  const recipeItemCount = await prisma.recipeItem.count();

  console.log("═══════════════════════════════════");
  console.log("🎉 SEEDING COMPLETE!");
  console.log("═══════════════════════════════════");
  console.log(`🥬  Ingredients:      ${ingredientCount}`);
  console.log(`📖  Recipes:           ${recipeCount}`);
  console.log(`📋  Recipe Items:      ${recipeItemCount}`);
  console.log("");
  console.log("Stock Status:");
  const lowStock = ingredients.filter(i => i.currentStock <= i.reorderLevel);
  console.log(`   ⚠️  Low Stock:      ${lowStock.length} items`);
  if (lowStock.length > 0) {
    lowStock.forEach(i => {
      console.log(`      - ${i.name}: ${i.currentStock} ${i.unit} (reorder at ${i.reorderLevel})`);
    });
  }
  console.log("═══════════════════════════════════\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });