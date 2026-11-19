import { Link } from "react-router-dom";
import "./NotFound.scss";

export function NotFound() {
  return (
    <main className="profile-404">
      <h1>404</h1>

      <h2>Página não encontrada</h2>

      <p>
        Parece que este perfil saiu para passear! Verifique o endereço ou volte
        para a página inicial.
      </p>

      <div className="profile-404__actions">
        <Link to="/" className="button button--primary">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
