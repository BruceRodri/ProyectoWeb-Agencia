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
        headers: { "Content-Type": "application/json" },
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

  static styles = css`
    :host {
      display: block;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 40px 20px;
    }

    .bienvenida {
      text-align: center;
      margin-bottom: 40px;
    }

    h1 {
      font-size: 2.5rem;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    span {
      color: #e94560;
    }

    .divider {
      width: 80px;
      height: 4px;
      background: #e94560;
      margin: 0 auto 15px auto;
      border-radius: 10px;
    }

    .subtitulo {
      color: #666;
      font-size: 1.1rem;
    }

    .btn-cerrar {
      margin-top: 15px;
      padding: 10px 25px;
      background: #1a1a2e;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-cerrar:hover {
      background: #e94560;
    }

    h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #1a1a2e;
      margin-bottom: 25px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
    }

    .card-body {
      padding: 20px;
    }

    .card-body h3 {
      font-size: 1.3rem;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .card-body p {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .badge {
      background: #1a1a2e;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
    }

    .badge.presupuesto {
      background: #e94560;
    }

    .badge.tipo {
      background: #0083b0;
    }

    .btn-eliminar {
      width: 100%;
      padding: 10px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-eliminar:hover {
      background: #c73652;
    }

    .sin-favoritos {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-top: 40px;
      grid-column: 1 / -1;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="bienvenida">
          <h1>Hola, <span>${this.usuario?.nombre}</span></h1>
          <div class="divider"></div>
          <p class="subtitulo">Estos son tus destinos favoritos guardados</p>
          <button class="btn-cerrar" @click=${this.cerrarSesion}>
            Cerrar sesión
          </button>
        </div>

        <h2>❤️ Mis Favoritos</h2>

        <div class="grid">
          ${this.favoritos.length === 0
            ? html`<p class="sin-favoritos">
                No tienes favoritos guardados aún.
                <a href="/destinos">Explorar destinos</a>
              </p>`
            : this.favoritos.map(
                (destino) => html`
                  <div class="card">
                    <div class="card-body">
                      <h3>${destino.nombre}</h3>
                      <p>${destino.descripcion}</p>
                      <div class="badges">
                        <span class="badge">${destino.pais}</span>
                        <span class="badge">${destino.clima}</span>
                        <span class="badge presupuesto"
                          >${destino.presupuesto}</span
                        >
                        <span class="badge tipo">${destino.tipo}</span>
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
    `;
  }
}

customElements.define("dashboard-page", DashboardPage);
