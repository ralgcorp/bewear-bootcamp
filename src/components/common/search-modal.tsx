"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSearchProducts } from "@/hooks/queries/use-search-products";
import { formatCentsToBRL } from "@/helpers/money";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import ButtonClose from "./button-close";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Usar o hook de busca real
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchProducts(debouncedSearchTerm, isOpen);

  // Debug: verificar os resultados da busca
  console.log("Resultados da busca:", { searchResults, isLoading, error });

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Focar no input quando abrir
      setTimeout(() => {
        const input = document.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é automática através do hook
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex min-h-screen flex-col items-center justify-start pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do modal */}
        <div className="flex w-full max-w-4xl items-center justify-between px-6">
          <h2 className="text-4xl font-bold text-black">Buscar produtos</h2>
          <ButtonClose onClick={onClose} />
        </div>

        {/* Barra de busca centralizada */}
        <div className="mt-8 w-full max-w-2xl px-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite o que você procura . . ."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 rounded-full border-2 border-black/30 px-6 pr-16 text-lg text-black placeholder:text-black/60 focus:outline-none focus-visible:ring-[0px]"
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-2 right-2 h-10 w-10 rounded-full border-black/90 bg-black/10 text-black hover:bg-black/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Resultados da busca */}
        {searchTerm && (
          <div className="container mt-8 w-full px-6">
            {error ? (
              <div className="py-8 text-center">
                <p className="text-red-400">
                  Erro ao buscar produtos. Tente novamente.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
                <span className="ml-2 text-black">Buscando...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="px-5 text-lg font-semibold text-black">
                  {searchResults.length} resultado
                  {searchResults.length !== 1 ? "s" : ""} para "{searchTerm}"
                </h3>

                {/* ScrollArea com altura máxima fixa */}
                <ScrollArea className="h-[600px] w-full rounded-md px-5 [&_[data-radix-scroll-area-viewport]]:!block">
                  <div className="grid gap-4 pr-2 md:grid-cols-2 lg:grid-cols-4">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/product-variant/${result.variants[0]?.slug || result.slug}`}
                        className="group rounded-lg border border-black/10 p-4 backdrop-blur-sm transition-colors hover:bg-gray-50"
                        onClick={() => onClose()}
                      >
                        <div className="flex flex-col">
                          {/* Imagem do produto */}
                          <div className="mb-3 aspect-square w-full overflow-hidden rounded-lg">
                            <img
                              src={result.variants[0]?.imageUrl || ""}
                              alt={result.name}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>

                          {/* Informações do produto */}
                          <div className="flex-1">
                            <h4 className="font-medium text-black group-hover:text-black/90">
                              {result.name}
                            </h4>
                            <p className="text-sm text-black/70">
                              {result.category}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <p className="text-sm font-semibold text-black">
                                {formatCentsToBRL(result.minPriceInCents)}
                              </p>
                              {result.minPriceInCents !==
                                result.maxPriceInCents && (
                                <span className="text-xs text-black/60">
                                  - {formatCentsToBRL(result.maxPriceInCents)}
                                </span>
                              )}
                            </div>
                            {result.variants.length > 1 && (
                              <p className="mt-1 text-xs text-black/50">
                                {result.variants.length} cores disponíveis
                              </p>
                            )}
                          </div>

                          {/* Ícone de link externo */}
                          <div className="mt-2 flex justify-end">
                            <ExternalLink className="h-4 w-4 text-black/40 group-hover:text-black/60" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-black/70">
                  Nenhum resultado encontrado para "{searchTerm}"
                </p>
                <p className="mt-2 text-sm text-black/50">
                  Tente usar termos diferentes ou verificar a ortografia
                </p>
              </div>
            )}
          </div>
        )}

        {/* Dicas de busca */}
        {!searchTerm && (
          <div className="mt-12 w-full max-w-2xl px-6 text-center">
            <p className="text-black/60">
              Digite para começar a buscar produtos, categorias ou marcas
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-/black80 rounded-full bg-black/10 px-3 py-1 text-sm">
                Camisetas
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-sm text-black/80">
                Calças
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-sm text-black/80">
                Tênis
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-sm text-black/80">
                Acessórios
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-sm text-black/80">
                Jaquetas
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-sm text-black/80">
                Shorts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
