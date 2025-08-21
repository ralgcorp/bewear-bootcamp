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
  Filter,
  X,
} from "lucide-react";

import ProductItem from "@/components/common/product-item";
import { Button } from "@/components/ui/button";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";
import ButtonClose from "@/components/common/button-close";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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

  // Obter todas as cores únicas dos produtos
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.color) {
          colors.add(variant.color);
        }
      });
    });
    return Array.from(colors).sort();
  }, [products]);

  // Produtos filtrados e ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtro de cores
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants.some((variant) =>
          selectedColors.includes(variant.color || ""),
        ),
      );
    }

    // Aplicar ordenação
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "price") {
        comparison = getProductMinPrice(a) - getProductMinPrice(b);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, selectedColors, sortField, sortOrder]);

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
        return "sm:grid-cols-2";
      case 3:
        return "sm:grid-cols-3";
      case 4:
        return "sm:grid-cols-4";
      default:
        return "sm:grid-cols-2";
    }
  };

  // Função para alternar seleção de cor
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSelectedColors([]);
  };

  // Função para obter o nome da cor em português
  const getColorName = (color: string) => {
    const colorNames: Record<string, string> = {
      red: "Vermelho",
      blue: "Azul",
      green: "Verde",
      yellow: "Amarelo",
      black: "Preto",
      white: "Branco",
      gray: "Cinza",
      purple: "Roxo",
      orange: "Laranja",
      pink: "Rosa",
      brown: "Marrom",
      navy: "Azul Marinho",
      beige: "Bege",
      gold: "Dourado",
      silver: "Prateado",
    };
    return colorNames[color.toLowerCase()] || color;
  };

  return (
    <>
      <div className="flex gap-6">
        {/* Barra lateral com filtros */}
        <div
          className={`w-64 flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen
              ? "translate-x-0 rounded-4xl px-2 py-3"
              : "-translate-x-full"
          } fixed top-0 left-0 z-40 h-full overflow-y-auto bg-white px-5 py-2 sm:relative sm:translate-x-0`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Filter className="h-5 w-5" />
              Filtros
            </h3>
            <ButtonClose
              onClick={() => setIsSidebarOpen(false)}
              className="sm:hidden"
            />
          </div>

          {/* Filtro de Cores */}
          <div className="mb-8">
            <h4 className="mb-4 font-medium text-gray-900">Cor</h4>
            <div className="space-y-3">
              {availableColors.map((color) => (
                <label
                  key={color}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleColor(color)}
                    className="h-4 w-4 rounded-full border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">
                    {getColorName(color)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {selectedColors.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
              size="sm"
            >
              Limpar Filtros
            </Button>
          )}

          {/* Contador de produtos filtrados */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} de {products.length} produtos
            </p>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1">
          <div className="space-y-6 px-5">
            {/* Header com controles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{category.name}</h2>

                {/* Botão para abrir sidebar em mobile */}
                <Button
                  variant="outline"
                  onClick={() => setIsSidebarOpen(true)}
                  className="h-8 border-none bg-transparent px-1 shadow-none hover:bg-transparent has-[>svg]:px-1 sm:hidden"
                >
                  <Filter className="mr-2 h-4 w-4" />
                </Button>
              </div>

              {/* Controles de visualização e ordenação */}
              <div className="flex items-center gap-4">
                {/* Botões de alteração do grid */}
                <div className="hidden items-center gap-2 md:flex">
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
                <div className="hidden h-6 w-px bg-gray-300 md:block"></div>

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
                              sortField === "name"
                                ? "bg-gray-100 font-medium"
                                : ""
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
                              sortField === "price"
                                ? "bg-gray-100 font-medium"
                                : ""
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

            {/* Grid de produtos */}
            <div className={`grid gap-4 ${getGridClasses()}`}>
              {filteredAndSortedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  textContainerClassName="max-w-full"
                />
              ))}
            </div>

            {/* Mensagem quando não há produtos */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default CategoryPageClient;
