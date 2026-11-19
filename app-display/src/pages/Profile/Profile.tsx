import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";

import { getPageBySlug } from "../../services/page.service";
import type { Page as PageType } from "../../types/page";
import { profileFields } from "../../config/profile-fields";

import "./Profile.scss";

export function Profile() {
  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const colors = page?.colors;

  const profileStyles: CSSProperties = {
    "--screen-background-color": colors?.screenBackgroundColor || "#f8fafc",

    "--card-background-color": colors?.cardBackgroundColor || "#ffffff",

    "--card-border-color": colors?.cardBorderColor || "transparent",

    "--name-color": colors?.nameColor || "#1e293b",

    "--label-color": colors?.labelColor || "#334155",

    "--value-color": colors?.valueColor || "#475569",
  } as CSSProperties;

  useEffect(() => {
    let active = true;

    async function loadPage() {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        setPage(null);

        const result = await getPageBySlug(slug);

        if (active) {
          setPage(result);
        }
      } catch (err) {
        console.error("Error loading profile:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [slug]);

  function isFieldVisible(field: (typeof profileFields)[number]): boolean {
    if (!field.show) {
      return true;
    }

    return page?.[field.show] === true;
  }

  function renderValue(value: unknown) {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={`${String(item)}-${index}`}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    return String(value);
  }

  if (loading) {
    return (
      <main className="profile-state">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  if (error || !page) {
    return (
      <main className="profile-state">
        <h2>Perfil não encontrado</h2>
        <p>Não foi possível encontrar este perfil.</p>
      </main>
    );
  }

  return (
    <main className="profile-container" style={profileStyles}>
      <article className="profile">
        <h3>{page.name}</h3>

        {profileFields.map((field) => {
          if (!isFieldVisible(field)) {
            return null;
          }

          const value = page[field.value];

          if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return null;
          }

          return (
            <div key={field.value}>
              {Array.isArray(value) ? (
                <>
                  <h4>{field.label}</h4>
                  {renderValue(value)}
                </>
              ) : (
                <p>
                  <span>{field.label}:</span> {renderValue(value)}
                </p>
              )}
            </div>
          );
        })}
      </article>
    </main>
  );
}
