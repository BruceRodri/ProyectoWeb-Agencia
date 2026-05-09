import { LitElement, html, css } from "lit";

class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .hero {
      min-height: 100vh;

      background: linear-gradient(
        135deg,
        #1a1a2e 0%,
        #16213e 50%,
        #0f3460 100%
      );

      display: flex;
      justify-content: center;
      align-items: center;

      text-align: center;

      padding: 40px 20px;

      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: "";

      position: absolute;

      width: 600px;
      height: 600px;

      background: radial-gradient(circle, rgba(233, 69, 96, 0.15), transparent);

      top: -100px;
      right: -100px;

      border-radius: 50%;
    }

    .hero::after {
      content: "";

      position: absolute;

      width: 400px;
      height: 400px;

      background: radial-gradient(circle, rgba(15, 52, 96, 0.5), transparent);

      bottom: -50px;
      left: -50px;

      border-radius: 50%;
    }

    .content {
      max-width: 800px;
      color: white;

      position: relative;
      z-index: 1;
    }

    .badge {
      display: inline-block;

      background: rgba(233, 69, 96, 0.2);

      color: #e94560;

      border: 1px solid rgba(233, 69, 96, 0.4);

      padding: 8px 20px;

      border-radius: 30px;

      font-size: 0.9rem;
      font-weight: bold;

      margin-bottom: 25px;
    }

    h1 {
      font-size: 4rem;
      font-weight: 800;

      margin-bottom: 15px;

      line-height: 1.2;
    }

    h1 span {
      color: #e94560;
    }

    .divider {
      width: 80px;
      height: 4px;

      background: #e94560;

      margin: 0 auto 25px auto;

      border-radius: 10px;
    }

    p {
      font-size: 1.2rem;

      color: #aaa;

      line-height: 1.8;

      margin-bottom: 40px;

      max-width: 600px;

      margin-left: auto;
      margin-right: auto;
    }

    .buttons {
      display: flex;
      justify-content: center;
      gap: 15px;

      flex-wrap: wrap;
    }

    .btn-primary {
      text-decoration: none;

      background: #e94560;
      color: white;

      padding: 15px 40px;

      border-radius: 30px;

      font-weight: bold;

      transition: all 0.3s;

      box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
    }

    .btn-primary:hover {
      background: #c73652;

      transform: translateY(-3px);

      box-shadow: 0 8px 25px rgba(233, 69, 96, 0.5);
    }

    .btn-secondary {
      text-decoration: none;

      background: transparent;
      color: white;

      border: 2px solid rgba(255, 255, 255, 0.3);

      padding: 15px 40px;

      border-radius: 30px;

      font-weight: bold;

      transition: all 0.3s;
    }

    .btn-secondary:hover {
      border-color: white;

      transform: translateY(-3px);
    }

    .stats {
      background: #16213e;

      padding: 60px 40px;
    }

    .stats-grid {
      max-width: 800px;
      margin: 0 auto;

      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

      gap: 30px;

      text-align: center;
    }

    .stat h3 {
      font-size: 2.5rem;
      color: #e94560;

      margin-bottom: 8px;
    }

    .stat p {
      margin: 0;
      color: #aaa;
      font-size: 0.95rem;
    }

    .categorias {
      background: #f5f5f5;

      padding: 80px 40px;
    }

    .categorias h2 {
      text-align: center;

      font-size: 2.5rem;

      color: #1a1a2e;

      margin-bottom: 10px;
    }

    .categorias h2 span {
      color: #e94560;
    }

    .categorias-divider {
      width: 80px;
      height: 4px;

      background: #e94560;

      margin: 0 auto 50px auto;

      border-radius: 10px;
    }

    .categorias-grid {
      max-width: 1000px;
      margin: 0 auto;

      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

      gap: 25px;
    }

    .categoria-card {
      background: white;

      border-radius: 16px;

      padding: 35px 25px;

      text-align: center;

      text-decoration: none;

      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

      transition: all 0.3s;
    }

    .categoria-card:hover {
      transform: translateY(-8px);

      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    .categoria-icon {
      display: block;

      font-size: 3rem;

      margin-bottom: 15px;
    }

    .categoria-card h3 {
      color: #1a1a2e;

      margin-bottom: 8px;
    }

    .categoria-card p {
      margin: 0;

      color: #888;

      font-size: 0.9rem;
    }

    .cta {
      background: linear-gradient(135deg, #e94560, #c73652);

      color: white;

      text-align: center;

      padding: 80px 40px;
    }

    .cta h2 {
      font-size: 2.5rem;

      margin-bottom: 15px;
    }

    .cta p {
      color: rgba(255, 255, 255, 0.85);

      margin-bottom: 35px;
    }

    .cta a {
      text-decoration: none;

      background: white;
      color: #e94560;

      padding: 15px 40px;

      border-radius: 30px;

      font-weight: bold;

      transition: all 0.3s;
    }

    .cta a:hover {
      transform: translateY(-3px);

      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }

      .stats,
      .categorias,
      .cta {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  `;

  render() {
    return html`
      <section class="hero">
        <div class="content">
          <div class="badge">✈️ Tu próxima aventura te espera</div>

          <h1>Descubre tu próximo <span>destino</span></h1>

          <div class="divider"></div>

          <p>
            TravelMatch te recomienda los mejores destinos según tus gustos,
            presupuesto y estilo de viaje.
          </p>

          <div class="buttons">
            <a class="btn-primary" href="/destinations"> Explorar destinos </a>

            <a class="btn-secondary" href="/register"> Crear cuenta </a>
          </div>
        </div>
      </section>

      <section class="stats">
        <div class="stats-grid">
          <div class="stat">
            <h3>12+</h3>
            <p>Destinos disponibles</p>
          </div>

          <div class="stat">
            <h3>3</h3>
            <p>Tipos de viaje</p>
          </div>

          <div class="stat">
            <h3>100%</h3>
            <p>Personalizado</p>
          </div>

          <div class="stat">
            <h3>24/7</h3>
            <p>Disponible siempre</p>
          </div>
        </div>
      </section>

      <section class="categorias">
        <h2>Viaja por <span>categoría</span></h2>

        <div class="categorias-divider"></div>

        <div class="categorias-grid">
          <a class="categoria-card" href="/destinations">
            <span class="categoria-icon">🏖️</span>
            <h3>Playa</h3>
            <p>Sol, arena y mar en los mejores destinos costeros</p>
          </a>

          <a class="categoria-card" href="/destinations">
            <span class="categoria-icon">🏙️</span>
            <h3>Ciudad</h3>
            <p>Cultura, gastronomía y arquitectura en grandes urbes</p>
          </a>

          <a class="categoria-card" href="/destinations">
            <span class="categoria-icon">🏔️</span>
            <h3>Aventura</h3>
            <p>Naturaleza, adrenalina y experiencias únicas</p>
          </a>
        </div>
      </section>

      <section class="cta">
        <h2>¿Listo para tu próximo viaje?</h2>

        <p>Crea tu cuenta y guarda tus destinos favoritos</p>

        <a href="/register"> Empezar ahora </a>
      </section>
    `;
  }
}

customElements.define("mi-home", HomePage);
