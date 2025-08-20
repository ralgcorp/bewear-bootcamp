import { db } from "@/db";
import CategorySelector from "@/components/common/category-selector";

type MenuProps = {
  isBorder?: boolean;
};

const Menu = async ({ isBorder = true }: MenuProps) => {
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <div className={`mb-6 w-full ${isBorder && "border-b-2 py-3"}`}>
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
