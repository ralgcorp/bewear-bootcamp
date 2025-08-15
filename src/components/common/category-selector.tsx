import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";
import Link from "next/link";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className="pointer-events-auto rounded-full bg-white text-sm font-semibold"
        >
          <Link href={`/category/${category.slug}`}>{category.name}</Link>
        </Button>
      ))}
    </>
  );
};

export default CategorySelector;
