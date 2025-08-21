"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  Columns2Icon,
  Columns4Icon,
  Columns3Icon,
  MoveUpIcon,
  MoveDownIcon,
  ArrowUpIcon,
} from "lucide-react";

import ProductItem from "@/components/common/product-item";
import { Button } from "@/components/ui/button";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";

type SortField = "name" | "price";
type SortOrder = "asc" | "desc";

interface CategoryPageClientProps {
  category: typeof categoryTable.$inferSelect;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const CategoryPageClient = ({
  category,
  products,
}: CategoryPageClientProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função para obter o preço mínimo de um produto
  const getProductMinPrice = (product: (typeof products)[0]) => {
    if (product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.priceInCents));
  };

  // Produtos ordenados
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "price") {
        comparison = getProductMinPrice(a) - getProductMinPrice(b);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, sortField, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortFieldLabel = (field: SortField) => {
    return field === "name" ? "Nome" : "Preço";
  };

  // Função para obter as classes do grid baseado no número de colunas
  const getGridClasses = () => {
    switch (gridColumns) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-2";
    }
  };

  return (
    <>
      <div className="space-y-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{category.name}</h2>

          {/* Controles de visualização e ordenação */}
          <div className="flex items-center gap-4">
            {/* Botões de alteração do grid */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridColumns(2)}
                className="h-8 border-none bg-transparent px-1 shadow-none hover:bg-transparent has-[>svg]:px-1"
                title="2 colunas"
              >
                <Columns2Icon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridColumns(3)}
                className="h-8 border-none bg-transparent px-1 shadow-none hover:bg-transparent has-[>svg]:px-1"
                title="3 colunas"
              >
                <Columns3Icon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridColumns(4)}
                className="h-8 border-none bg-transparent px-1 shadow-none hover:bg-transparent has-[>svg]:px-1"
                title="4 colunas"
              >
                <Columns4Icon />
              </Button>
            </div>

            {/* Separador visual */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Filtro de ordenação */}
            <div className="flex items-center gap-3">
              {/* Dropdown de campo de ordenação */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="min-w-[120px] justify-between"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {getSortFieldLabel(sortField)}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 z-10 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortField("name");
                          setIsDropdownOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                          sortField === "name" ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        Nome
                      </button>
                      <button
                        onClick={() => {
                          setSortField("price");
                          setIsDropdownOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                          sortField === "price" ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        Preço
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de ordem crescente/decrescente */}
              <Button
                variant="outline"
                onClick={toggleSortOrder}
                className="h-8 min-w-[40px] border-none bg-transparent px-3 shadow-none hover:bg-transparent has-[>svg]:px-1"
                title={`Ordenar em ordem ${sortOrder === "asc" ? "decrescente" : "crescente"}`}
                aria-label={`Ordenar em ordem ${sortOrder === "asc" ? "decrescente" : "crescente"}`}
              >
                <ArrowUpIcon
                  className={`h-4 w-4 transition-transform ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className={`grid gap-4 ${getGridClasses()}`}>
          {sortedProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassName="max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPageClient;
