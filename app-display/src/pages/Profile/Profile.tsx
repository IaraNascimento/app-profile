import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";

import { getPageBySlug } from "../../services/page.service";
import type { Page as PageType } from "../../types/page";
import { profileFields } from "../../config/profile-fields";

import "./Profile.scss";
import { NotFound } from "../NotFound/NotFound";

export function Profile() {
  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);

  const colors = page?.colors;

  const profileStyles = {
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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const result = await getPageBySlug(slug);

        if (active) {
          setPage(result);
        }
      } catch (error) {
        console.error("Error loading profile:", error);

        if (active) {
          setPage(null);
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

  if (loading) {
    return (
      <main className="profile-state">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  if (!page) {
    return <NotFound></NotFound>;
  }

  return (
    <main className="profile-container" style={profileStyles}>
      <article className="profile">
        <header className="profile__header">
          <h1>{page.name}</h1>
          <h2>{page.profession}</h2>
        </header>

        <div className="profile__content">
          {profileFields.map((field) => {
            const value = page[field.value];

            if (
              (field.show && page[field.show] !== true) ||
              value == null ||
              value === "" ||
              (Array.isArray(value) && !value.length)
            ) {
              return null;
            }

            return (
              <section className="profile__section" key={field.value}>
                {Array.isArray(value) ? (
                  <>
                    <h2>{field.label}</h2>

                    <ul className="profile__list">
                      {value.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="profile__field">
                    <span>{field.label}</span>
                    <strong>{String(value)}</strong>
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <footer className="profile__footer">
          <span>✿</span>
          <p>Perfil profissional</p>
        </footer>
      </article>
    </main>
  );
}
