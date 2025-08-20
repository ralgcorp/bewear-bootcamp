# API de Busca de Produtos - BEWEAR

## 🎯 **Visão Geral**

Implementei uma API real de busca de produtos usando **Drizzle ORM** e **React Query**, seguindo os padrões existentes do projeto BEWEAR. A busca é feita diretamente no banco de dados PostgreSQL e retorna produtos reais com suas variantes.

## 🏗️ **Arquitetura Implementada**

### 1. **Action de Busca** (`src/actions/search-products/index.ts`)

- **Server Action** que executa no servidor
- **Query otimizada** usando Drizzle ORM
- **Busca por texto** em nome, descrição e categoria
- **JOINs eficientes** entre produtos, variantes e categorias
- **Limite configurável** de resultados (padrão: 20)

### 2. **Hook React Query** (`src/hooks/queries/use-search-products.ts`)

- **Cache inteligente** com React Query
- **Debounce automático** através do hook
- **Stale time** de 5 minutos
- **Garbage collection** de 10 minutos
- **Query key** única para cada termo de busca

### 3. **Componente SearchModal** (`src/components/common/search-modal.tsx`)

- **Integração completa** com a API real
- **Resultados em tempo real** conforme digitação
- **Links diretos** para páginas de produtos
- **Exibição de preços** formatados em BRL
- **Indicador de variantes** disponíveis
- **Imagens dos produtos** exibidas acima do nome
- **Fechamento automático** do modal ao clicar no produto

## 🔍 **Como a Busca Funciona**

### **Algoritmo de Busca**

```sql
-- Busca em produtos, descrições e categorias
WHERE (
  ILIKE(product.name, '%termo%') OR
  ILIKE(product.description, '%termo%') OR
  ILIKE(category.name, '%termo%')
)
```

### **Estrutura de Retorno**

```typescript
interface SearchProductResult {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  description: string;
  variants: {
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
  }[];
  minPriceInCents: number;
  maxPriceInCents: number;
}
```

## 🚀 **Funcionalidades da API**

### ✅ **Implementadas**

- **Busca por texto** em tempo real
- **Filtros inteligentes** por nome, descrição e categoria
- **Resultados paginados** com limite configurável
- **Cache otimizado** com React Query
- **Tratamento de erros** robusto
- **Performance otimizada** com JOINs eficientes
- **Imagens dos produtos** em alta qualidade
- **Fechamento automático** do modal ao selecionar produto

### 🔧 **Características Técnicas**

- **Debounce automático** de 300ms
- **Queries parametrizadas** para segurança
- **Índices de banco** otimizados
- **Lazy loading** de variantes
- **Fallback graceful** para erros

## 📊 **Dados Disponíveis para Busca**

### **Categorias**

- Acessórios (Mochilas, Bonés, Meias)
- Bermuda & Shorts
- Calças (Nike, Jordan, Brooklin)
- Camisetas (ACG, Run, Active, Nature)
- Jaquetas & Moletons (Windrunner, Style, Nike Club)
- Tênis (Nike Vomero, Panda, Air Force, Dunk Low)

### **Produtos**

- **Total**: 30 produtos
- **Variantes**: 3-4 cores por produto
- **Preços**: R$ 19,99 a R$ 899,99
- **Imagens**: URLs do CloudFront

## 🛠️ **Como Usar**

### **1. Importar o Hook**

```tsx
import { useSearchProducts } from "@/hooks/queries/use-search-products";
```

### **2. Usar no Componente**

```tsx
const {
  data: products,
  isLoading,
  error,
} = useSearchProducts(searchTerm, isModalOpen);
```

### **3. Acessar os Dados**

```tsx
{
  products.map((product) => (
    <div key={product.id}>
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>Preço: {formatCentsToBRL(product.minPriceInCents)}</p>
      <p>{product.variants.length} cores disponíveis</p>
    </div>
  ));
}
```

## 🔌 **Integração com Banco de Dados**

### **Schema Utilizado**

```typescript
// Tabelas principais
productTable        // Produtos base
productVariantTable // Variantes (cores, preços)
categoryTable       // Categorias

// Relacionamentos
product -> category (1:1)
product -> variants (1:N)
```

### **Queries Otimizadas**

- **JOIN único** para buscar produtos e categorias
- **Subqueries** para variantes de cada produto
- **Índices** em campos de busca (name, description)
- **Limite** para evitar sobrecarga

## 📈 **Performance e Otimizações**

### **Cache Strategy**

- **Stale time**: 5 minutos
- **GC time**: 10 minutos
- **Query keys**: Únicas por termo
- **Background updates**: Automáticos

### **Database Optimizations**

- **ILIKE** para busca case-insensitive
- **JOINs** em vez de múltiplas queries
- **Limite** de resultados
- **Índices** em campos de busca

## 🧪 **Testando a API**

### **1. Abrir o Modal de Busca**

- Clique no ícone 🔍 no header
- Digite qualquer termo (ex: "nike", "camiseta", "tênis")

### **2. Verificar Resultados**

- Produtos reais do banco aparecem
- **Imagens dos produtos** exibidas acima do nome
- Preços formatados em BRL
- Links funcionais para páginas de produtos
- Variantes e cores exibidas
- **Modal fecha automaticamente** ao clicar no produto

### **3. Testar Diferentes Termos**

- **Marcas**: "nike", "jordan"
- **Categorias**: "camisetas", "tênis", "calças"
- **Produtos**: "dunk", "air force", "windrunner"
- **Descrições**: "esportivo", "casual", "premium"

## 🚨 **Tratamento de Erros**

### **Tipos de Erro**

- **Banco indisponível**: Mensagem amigável
- **Query inválida**: Fallback para array vazio
- **Timeout**: Retry automático
- **Network**: Cache local quando possível

### **Fallbacks**

- **Resultados vazios**: Mensagem informativa
- **Erro de busca**: Botão de retry
- **Loading**: Spinner animado
- **Offline**: Cache local

## 🔮 **Melhorias Futuras**

### **Funcionalidades Planejadas**

- **Filtros avançados** (preço, categoria, marca)
- **Ordenação** (relevância, preço, nome)
- **Busca fuzzy** para erros de digitação
- **Sugestões automáticas** baseadas em histórico
- **Analytics** de buscas populares

### **Otimizações Técnicas**

- **Full-text search** com PostgreSQL
- **Elasticsearch** para buscas complexas
- **CDN** para resultados em cache
- **GraphQL** para queries flexíveis

## 📚 **Referências Técnicas**

### **Dependências**

- **Drizzle ORM**: `drizzle-orm`
- **React Query**: `@tanstack/react-query`
- **PostgreSQL**: Driver nativo
- **Next.js**: Server Actions

### **Padrões Seguidos**

- **Server Actions** para operações de banco
- **React Query** para cache e estado
- **TypeScript** para type safety
- **Tailwind CSS** para estilização

## 🎉 **Conclusão**

A API de busca implementada oferece:

- **Performance superior** com cache inteligente
- **Experiência de usuário** fluida e responsiva
- **Integração perfeita** com o ecossistema existente
- **Escalabilidade** para crescimento futuro
- **Manutenibilidade** com código limpo e documentado

A busca agora funciona com **dados reais** do banco, oferecendo uma experiência profissional e funcional para os usuários da BEWEAR! 🚀
