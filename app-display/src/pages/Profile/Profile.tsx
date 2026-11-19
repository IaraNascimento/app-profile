import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";

import { getPageBySlug } from "../../services/page.service";
import type { Page as PageType } from "../../types/page";
import { profileFields } from "../../config/profile-fields";

import { NotFound } from "../NotFound/NotFound";

import "./Profile.scss";

import packageJson from "../../../package.json";

export function Profile() {
  const appVersion = packageJson.version;

  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);

  const colors = page?.colors;

  const profileStyles = {
    "--screen-background-color": colors?.screenBackgroundColor,
    "--card-background-color": colors?.cardBackgroundColor,
    "--card-border-color": colors?.cardBorderColor,
    "--card-inner-background-color": colors?.cardInnerBackgroundColor,
    "--card-inner-border-color": colors?.cardInnerBorderColor,
    "--name-color": colors?.nameColor,
    "--label-color": colors?.labelColor,
    "--value-color": colors?.valueColor,
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
    return <NotFound />;
  }

  const visibleFields = profileFields.filter((field) => {
    const value = page[field.value];

    return (
      (!field.show || page[field.show] === true) &&
      value != null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
    );
  });

  const description = visibleFields.find(
    (field) => field.type === "description",
  );

  const contacts = visibleFields.filter(
    (field) => field.type !== "description" && field.value !== "services",
  );

  const services = visibleFields.find((field) => field.value === "services");

  const serviceItems = services ? page[services.value] : null;

  function getContactUrl(type: string | undefined, value: string) {
    switch (type) {
      case "link":
        return value.startsWith("http") ? value : `https://${value}`;

      case "instagram":
        return `https://www.instagram.com/${value.replace("@", "").replace(/^\/+|\/+$/g, "")}/`;

      case "whatsapp":
        return `https://wa.me/${value.replace(/\D/g, "")}`;

      default:
        return undefined;
    }
  }

  function renderContact(field: (typeof profileFields)[number]) {
    const value = String(page![field.value]);

    if (field.type === "map") {
      const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;

      return (
        <div className="profile__map">
          <iframe
            src={mapUrl}
            title={`Localização: ${value}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        </div>
      );
    }

    const url = getContactUrl(field.type, value);

    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    ) : (
      <span>{value}</span>
    );
  }

  return (
    <main className="profile-container" style={profileStyles}>
      <article className="profile">
        <header className="profile__header">
          <h1>{page.name}</h1>
          <h2>{page.profession}</h2>
        </header>

        <div className="profile__content">
          {page.showTitle && <h3>{page.title}</h3>}
          {page.showSubtitle && <p>{page.subtitle}</p>}

          {Array.isArray(serviceItems) && (
            <ul className="profile__list">
              {serviceItems.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          )}

          {page.showDescription && description && (
            <section className="profile__description">
              <h2>
                <span className="profile__icon" aria-hidden="true">
                  {description.icon}
                </span>{" "}
                {description.label}
              </h2>
              <p>{String(page[description.value])}</p>
            </section>
          )}

          {contacts.length > 0 && (
            <section className="profile__contacts">
              {contacts.map((field) => (
                <div className="profile__contact" key={field.value}>
                  {field.icon && (
                    <span className="profile__icon" aria-hidden="true">
                      {field.icon}
                    </span>
                  )}

                  <div className="profile__contact-content">
                    {renderContact(field)}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        <footer className="profile__footer">
          <div className="profile__footer__version">
            <span>✿</span>
            <p>Perfil profissional - v{appVersion}</p>
          </div>
          <a
            className="profile__footer__author"
            href="https://app-profile-display.vercel.app/iara-nascimento-sztybe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Criado por:
            <strong>Iara Nascimento Sztybe</strong>
          </a>{" "}
        </footer>
      </article>
    </main>
  );
}
