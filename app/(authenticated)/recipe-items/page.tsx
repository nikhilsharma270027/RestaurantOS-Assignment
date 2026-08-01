// app/(authenticated)/recipe-items/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";

export const metadata: Metadata = {
  title: "Recipe Items — RestaurantOS",
  description: "Manage ingredients used in each recipe.",
};

const recipeItemsResource = {
  table: "recipeItem",
  title: "Recipe Items",
  singular: "Recipe Item",
  description: "Add ingredients to recipes with quantities.",
  fields: [
    {
      name: "recipeId",
      label: "Recipe",
      type: "reference" as const,
      refTable: "recipe",
      refLabel: "name",
      required: true,
      inTable: true,
      inForm: true,
    },
    {
      name: "ingredientId",
      label: "Ingredient",
      type: "reference" as const,
      refTable: "ingredient",
      refLabel: "name",
      required: true,
      inTable: true,
      inForm: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number" as const,
      inTable: true,
      inForm: true,
      step: "0.001",
      placeholder: "Amount needed for this recipe",
    },
  ],
  searchKeys: ["recipeId", "ingredientId"],
};

export default function RecipeItemsPage() {
  return <ResourceView config={recipeItemsResource} />;
}