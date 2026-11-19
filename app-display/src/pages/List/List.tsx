import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Page } from "../../types/page";

import { getAllPages } from "../../services/page.service";

import { searchFields } from "../../config/search-fields";

import type { SearchField } from "../../config/search-fields";

import "./List.scss";

export function List() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("all");

  useEffect(() => {
    let active = true;

    async function loadPages() {
      try {
        setLoading(true);
        setError(false);

        const result = await getAllPages();

        if (active) {
          setPages(result);
        }
      } catch (err) {
        console.error("Error loading directory:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPages();

    return () => {
      active = false;
    };
  }, []);

  function normalize(value: string): string {
    return (value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function groupPagesByUser(pages: Page[]) {
    return pages.reduce<Record<string, Page[]>>((groups, page) => {
      if (!groups[page.userId]) {
        groups[page.userId] = [];
      }

      groups[page.userId].push(page);

      return groups;
    }, {});
  }

  const filteredPages = pages.filter((page) => {
    const search = normalize(searchValue);

    if (!search) {
      return true;
    }

    const fields: Record<SearchField, string> = {
      all: `${page.userName ?? ""} ${page.name ?? ""} ${page.url ?? ""}`,
      user: page.userName ?? "",
      name: page.name ?? "",
      url: page.url ?? "",
    };

    return normalize(fields[searchField]).includes(search);
  });

  const groupedPages = groupPagesByUser(filteredPages);

  function clearSearch(): void {
    setSearchValue("");
    setSearchField("all");
  }

  if (loading) {
    return (
      <main className="profile-state">
        <p>Carregando perfis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-state">
        <h2>Não foi possível carregar os perfis.</h2>
        <p>Verifique sua conexão e as permissões do Firestore.</p>
      </main>
    );
  }

  return (
    <main className="profile-container">
      <section className="profile-list">
        <h1>Perfis profissionais</h1>

        <div className="profile-filters">
          <label htmlFor="searchField">Pesquisar em:</label>

          <select
            id="searchField"
            value={searchField}
            onChange={(event) =>
              setSearchField(event.target.value as SearchField)
            }
          >
            <option value="all">Todos</option>

            {searchFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>

          <label htmlFor="searchValue">Buscar:</label>

          <input
            id="searchValue"
            type="search"
            placeholder="Digite o que deseja encontrar..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          {(searchValue || searchField !== "all") && (
            <button type="button" onClick={clearSearch}>
              Limpar filtros
            </button>
          )}
        </div>

        {Object.keys(groupedPages).length === 0 ? (
          <section>
            <h2>Nenhum perfil encontrado.</h2>
            <p>Tente alterar os filtros ou os termos da busca.</p>
          </section>
        ) : (
          <div className="user-groups">
            {Object.entries(groupedPages).map(([userId, userPages]) => (
              <section className="user-group" key={userId}>
                <h2>{userPages[0].userName || "Usuário desconhecido"}</h2>

                <ul className="slug-list">
                  {userPages.map((page) => (
                    <li key={page.id}>
                      <Link to={`/${page.slug}`}>
                        {page.name} ({page.url})
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
