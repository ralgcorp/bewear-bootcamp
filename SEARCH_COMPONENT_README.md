# Componente de Busca - SearchModal

## Descrição

O `SearchModal` é um componente de busca de tela inteira que oferece uma experiência de usuário moderna e responsiva para buscar produtos na aplicação BEWEAR.

## Funcionalidades

### ✨ Características Principais

- **Modal de tela inteira** com overlay escuro e backdrop blur
- **Barra de busca centralizada** com design moderno
- **Busca em tempo real** com debounce de 300ms
- **Resultados dinâmicos** que se atualizam conforme o usuário digita
- **Interface responsiva** que funciona em todos os dispositivos

### 🎯 Funcionalidades de UX

- **Auto-focus** no input quando o modal abre
- **Fechamento com ESC** ou clicando fora do modal
- **Indicador de loading** durante a busca
- **Sugestões de busca** com tags de categorias populares
- **Animações suaves** e transições hover

### 🔍 Sistema de Busca

- **Debounce inteligente** para evitar requisições excessivas
- **Busca por nome** e categoria de produtos
- **Resultados filtrados** em tempo real
- **Estado de loading** com spinner animado
- **Mensagens informativas** para resultados vazios

## Como Usar

### 1. Importar o Componente

```tsx
import { SearchModal } from "@/components/common/search-modal";
```

### 2. Adicionar Estado no Componente Pai

```tsx
const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
```

### 3. Renderizar o Modal

```tsx
<SearchModal
  isOpen={isSearchModalOpen}
  onClose={() => setIsSearchModalOpen(false)}
/>
```

### 4. Abrir o Modal

```tsx
<Button onClick={() => setIsSearchModalOpen(true)}>
  <Search />
</Button>
```

## Estrutura do Componente

### Props

```tsx
interface SearchModalProps {
  isOpen: boolean; // Controla se o modal está visível
  onClose: () => void; // Função para fechar o modal
}
```

### Estados Internos

- `searchTerm`: Termo atual da busca
- `searchResults`: Array de resultados da busca
- `isLoading`: Estado de carregamento
- `debouncedSearchTerm`: Termo com debounce para busca

### Interface dos Resultados

```tsx
interface SearchResult {
  id: number;
  name: string;
  category: string;
  price?: string;
  image?: string;
}
```

## Personalização

### Estilos CSS

O componente usa Tailwind CSS com classes customizáveis:

- **Overlay**: `bg-black/80 backdrop-blur-sm`
- **Input**: `bg-white/10 border-white/30`
- **Resultados**: `bg-white/10 backdrop-blur-sm`

### Integração com API

Para integrar com uma API real, modifique a função `performSearch`:

```tsx
const performSearch = useCallback(async (term: string) => {
  // Substitua por sua chamada de API real
  const response = await fetch(`/api/search?q=${term}`);
  const results = await response.json();
  setSearchResults(results);
}, []);
```

## Acessibilidade

### ✅ Recursos Implementados

- **Navegação por teclado** (ESC para fechar)
- **Auto-focus** no input
- **Labels semânticos** e estrutura HTML adequada
- **Contraste adequado** para leitura
- **Indicadores visuais** de estado (loading, resultados)

### 🔧 Melhorias Futuras

- Suporte a leitores de tela (ARIA labels)
- Navegação por tab entre resultados
- Atalhos de teclado adicionais

## Performance

### 🚀 Otimizações Implementadas

- **Debounce** para evitar buscas excessivas
- **useCallback** para memoização de funções
- **Cleanup** adequado de event listeners
- **Lazy loading** de resultados

### 📊 Métricas de Performance

- Tempo de resposta: < 500ms (simulado)
- Debounce: 300ms
- Renderização: Otimizada com React hooks

## Compatibilidade

### 🌐 Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 📱 Dispositivos

- Desktop (todos os tamanhos)
- Tablet (portrait e landscape)
- Mobile (portrait e landscape)

## Troubleshooting

### Problemas Comuns

#### Modal não abre

- Verifique se `isOpen` está sendo passado corretamente
- Confirme se o estado está sendo atualizado

#### Busca não funciona

- Verifique o console para erros
- Confirme se a função `performSearch` está sendo chamada

#### Problemas de estilo

- Verifique se Tailwind CSS está configurado
- Confirme se as classes estão sendo aplicadas

## Exemplo Completo

```tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/common/search-modal";

export const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <header>
      {/* Outros elementos do header */}

      <Button onClick={() => setIsSearchModalOpen(true)}>
        <Search />
      </Button>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
};
```

## Contribuição

Para contribuir com melhorias no componente:

1. Mantenha a estrutura de props existente
2. Adicione testes para novas funcionalidades
3. Documente mudanças na API
4. Mantenha a acessibilidade e performance

## Licença

Este componente faz parte do projeto BEWEAR Bootcamp e segue as mesmas diretrizes de licenciamento.
