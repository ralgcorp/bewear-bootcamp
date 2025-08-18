import { db } from "@/db";
import CategorySelector from "@/components/common/category-selector";

const Menu = async () => {
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <div className="mb-6 w-full border-b-2 py-3">
        <div className="container mx-auto mb-5 hidden md:block">
          <div className="space-y-6">
            <div className="flex justify-around px-5">
              <CategorySelector categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
