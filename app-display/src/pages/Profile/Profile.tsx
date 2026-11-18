import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPageBySlug } from "../../services/page.service";
import type { Page as PageType } from "../../types/page";

import "./Profile.scss";

export function Profile() {
  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    <main className="profile-container">
      <article className="profile">
        <h3>{page.name}</h3>

        <p>URL: {page.url}</p>
        <p>Profissão: {page.profession}</p>

        {page.showDescription && <p>Descrição: {page.description}</p>}

        {page.showTitle && <p>Título: {page.title}</p>}

        {page.showSubtitle && <p>Subtítulo: {page.subtitle}</p>}

        {page.showLinkedIn && <p>LinkedIn: {page.linkedIn}</p>}

        {page.showInstagram && <p>Instagram: {page.instagram}</p>}

        {page.showWhatsApp && <p>WhatsApp: {page.whatsApp}</p>}

        {page.showBusinessPhone && (
          <p>Telefone comercial: {page.businessPhone}</p>
        )}

        {page.showEmail && <p>E-mail: {page.email}</p>}

        {page.showAddress && <p>Endereço: {page.address}</p>}

        {page.services?.length > 0 && (
          <>
            <h4>Serviços</h4>

            <ul>
              {page.services.map((service, index) => (
                <li key={`${service}-${index}`}>{service}</li>
              ))}
            </ul>
          </>
        )}
      </article>
    </main>
  );
}
