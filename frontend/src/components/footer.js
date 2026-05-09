import { LitElement, html, css } from "lit";

class Footer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    footer {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
      padding: 50px 40px 20px;
    }

    .footer-grid {
      max-width: 1200px;
      margin: 0 auto 40px auto;

      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
    }

    .footer-brand .logo {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }

    .footer-brand .logo span {
      color: #e94560;
    }

    .footer-brand p {
      color: #aaa;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .footer-links h4 {
      color: #e94560;
      font-size: 1rem;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer-links ul {
      list-style: none;

      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links ul li a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.3s;
      font-size: 0.95rem;
    }

    .footer-links ul li a:hover {
      color: #e94560;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      padding-top: 20px;

      text-align: center;

      color: #aaa;
      font-size: 0.9rem;
    }

    .footer-bottom span {
      color: #e94560;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      footer {
        padding: 40px 20px 20px;
      }

      .footer-grid {
        gap: 30px;
      }
    }
  `;

  render() {
    return html`
      <footer>
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">Travel<span>Match</span></div>

            <p>
              Descubre los mejores destinos del mundo según tus gustos,
              presupuesto y estilo de viaje.
            </p>
          </div>

          <div class="footer-links">
            <h4>Navegación</h4>

            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/destinations">Destinos</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Registro</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Destinos</h4>

            <ul>
              <li><a href="/destinations">Playas</a></li>
              <li><a href="/destinations">Ciudades</a></li>
              <li><a href="/destinations">Aventura</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Mi cuenta</h4>

            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/dashboard">Favoritos</a></li>
              <li><a href="/register">Crear cuenta</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2025 <span>TravelMatch</span> — Todos los derechos reservados</p>
        </div>
      </footer>
    `;
  }
}

customElements.define("mi-footer", Footer);
