import { LitElement, html, css } from "lit";

class DashboardPage extends LitElement {
  static properties = {
    usuario: { type: Object },
    favoritos: { type: Array },
  };

  constructor() {
    super();

    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    this.favoritos = [];
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.usuario) {
      window.location.href = "/login";
      return;
    }

    this.cargarFavoritos();
  }

  async cargarFavoritos() {
    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${this.usuario.id}`,
      );

      const data = await response.json();

      this.favoritos = data;
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  }

  async eliminarFavorito(destino_id) {
    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id,
        }),
      });

      if (response.ok) {
        this.favoritos = this.favoritos.filter((d) => d.id !== destino_id);
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  }

  cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  }

  tipoIcon(tipo) {
    const icons = {
      playa: "🏖️",
      ciudad: "🏙️",
      aventura: "🏔️",
    };

    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = {
      bajo: "💰",
      medio: "💳",
      alto: "💎",
    };

    return icons[presupuesto] || "💰";
  }

  static styles = css`
    :host {
      display: block;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .hero {
      background: linear-gradient(
        135deg,
        #1a1a2e 0%,
        #16213e 50%,
        #0f3460 100%
      );
      padding: 60px 40px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: "";
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(233, 69, 96, 0.1), transparent);
      top: -100px;
      right: -100px;
      border-radius: 50%;
    }

    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .hero-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #e94560;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 800;
      color: white;
      box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
    }

    .hero-texto h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 5px;
    }

    .hero-texto h1 span {
      color: #e94560;
    }

    .hero-texto p {
      color: #aaa;
      font-size: 0.95rem;
    }

    .hero-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-explorar {
      text-decoration: none;
      background: #e94560;
      color: white;
      padding: 12px 25px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      transition: 0.3s;
    }

    .btn-explorar:hover {
      background: #c73652;
      transform: translateY(-2px);
    }

    .btn-cerrar {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 25px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn-cerrar:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .stats-bar {
      background: #16213e;
      padding: 20px 40px;
    }

    .stats-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 40px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-info h4 {
      color: #e94560;
      font-size: 1.3rem;
      font-weight: 800;
    }

    .stat-info p {
      color: #aaa;
      font-size: 0.8rem;
    }

    .container {
      background: #f5f5f5;
      min-height: 60vh;
      padding: 40px;
    }

    .section-title {
      max-width: 1200px;
      margin: 0 auto 25px auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title h2 {
      font-size: 1.8rem;
      color: #1a1a2e;
      font-weight: 800;
    }

    .section-title span {
      color: #e94560;
    }

    .grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
      transition: 0.3s;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 25px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-icon {
      font-size: 2.5rem;
    }

    .card-pais {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-body h3 {
      font-size: 1.4rem;
      color: #1a1a2e;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .card-body p {
      color: #777;
      line-height: 1.6;
      margin-bottom: 20px;
      flex: 1;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-clima {
      background: #e8f4fd;
      color: #0083b0;
    }

    .badge-presupuesto {
      background: #fde8ec;
      color: #e94560;
    }

    .badge-tipo {
      background: #e8f8e8;
      color: #28a745;
    }

    .btn-eliminar {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: #fde8ec;
      color: #e94560;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn-eliminar:hover {
      background: #e94560;
      color: white;
      transform: translateY(-2px);
    }

    .sin-favoritos {
      text-align: center;
      grid-column: 1 / -1;
      padding: 80px 20px;
    }

    .sin-favoritos p {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .sin-favoritos h3 {
      color: #1a1a2e;
      font-size: 1.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .sin-favoritos span {
      display: block;
      color: #888;
      margin-bottom: 25px;
    }

    .sin-favoritos a {
      display: inline-block;
      text-decoration: none;
      background: #e94560;
      color: white;
      padding: 14px 35px;
      border-radius: 30px;
      font-weight: 700;
      transition: 0.3s;
    }

    .sin-favoritos a:hover {
      background: #c73652;
      transform: translateY(-3px);
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 20px;
      }

      .hero-inner {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-bar {
        padding: 20px;
      }

      .container {
        padding: 20px;
      }
    }
  `;

  render() {
    return html`
      <app-header></app-header>

      <div class="hero">
        <div class="hero-inner">
          <div class="hero-info">
            <div class="avatar">
              ${this.usuario?.nombre?.charAt(0).toUpperCase()}
            </div>

            <div class="hero-texto">
              <h1>
                Hola,
                <span>${this.usuario?.nombre}</span> 👋
              </h1>

              <p>Aquí están todos tus destinos guardados</p>
            </div>
          </div>

          <div class="hero-actions">
            <a class="btn-explorar" href="/destinations"> 🌍 Explorar más </a>

            <button class="btn-cerrar" @click=${this.cerrarSesion}>
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stats-inner">
          <div class="stat">
            <span class="stat-icon">❤️</span>

            <div class="stat-info">
              <h4>${this.favoritos.length}</h4>
              <p>Favoritos guardados</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="section-title">
          <h2>❤️ Mis <span>Favoritos</span></h2>
        </div>

        <div class="grid">
          ${this.favoritos.length === 0
            ? html`
                <div class="sin-favoritos">
                  <p>🗺️</p>

                  <h3>Aún no tienes favoritos</h3>

                  <span> Explora destinos y guarda los que más te gusten </span>

                  <a href="/destinations"> Explorar destinos </a>
                </div>
              `
            : this.favoritos.map(
                (destino) => html`
                  <div class="card">
                    <div class="card-header">
                      <span class="card-icon">
                        ${this.tipoIcon(destino.tipo)}
                      </span>

                      <span class="card-pais"> 📍 ${destino.pais} </span>
                    </div>

                    <div class="card-body">
                      <h3>${destino.nombre}</h3>

                      <p>${destino.descripcion}</p>

                      <div class="badges">
                        <span class="badge badge-clima">
                          🌡️ ${destino.clima}
                        </span>

                        <span class="badge badge-presupuesto">
                          ${this.presupuestoIcon(destino.presupuesto)}
                          ${destino.presupuesto}
                        </span>

                        <span class="badge badge-tipo">
                          ${this.tipoIcon(destino.tipo)} ${destino.tipo}
                        </span>
                      </div>

                      <button
                        class="btn-eliminar"
                        @click=${() => this.eliminarFavorito(destino.id)}
                      >
                        🗑️ Eliminar de favoritos
                      </button>
                    </div>
                  </div>
                `,
              )}
        </div>
      </div>

      <app-footer></app-footer>
    `;
  }
}

customElements.define("dashboard-page", DashboardPage);
