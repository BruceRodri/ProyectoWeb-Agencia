import { LitElement, html, css } from "lit";
import "../components/card";

class DestinationsPage extends LitElement {
  static properties = {
    destinos: { type: Array },
    filtrados: { type: Array },
    clima: { type: String },
    presupuesto: { type: String },
    tipo: { type: String },
    usuario: { type: Object },
  };

  constructor() {
    super();

    this.destinos = [];
    this.filtrados = [];

    this.clima = "";
    this.presupuesto = "";
    this.tipo = "";

    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.cargarDestinos();
  }

  async cargarDestinos() {
    try {
      const response = await fetch("http://localhost:3000/destinations");
      const data = await response.json();

      this.destinos = data;
      this.filtrados = data;
    } catch (error) {
      console.error("Error al cargar destinos:", error);
    }
  }

  filtrar() {
    this.filtrados = this.destinos.filter((d) => {
      return (
        (this.clima === "" || d.clima === this.clima) &&
        (this.presupuesto === "" || d.presupuesto === this.presupuesto) &&
        (this.tipo === "" || d.tipo === this.tipo)
      );
    });
  }

  handleClima(e) {
    this.clima = e.target.value;
    this.filtrar();
  }

  handlePresupuesto(e) {
    this.presupuesto = e.target.value;
    this.filtrar();
  }

  handleTipo(e) {
    this.tipo = e.target.value;
    this.filtrar();
  }

  limpiarFiltros() {
    this.clima = "";
    this.presupuesto = "";
    this.tipo = "";

    this.filtrados = this.destinos;
  }

  async agregarFavorito(destino_id) {
    if (!this.usuario) {
      alert("Debes iniciar sesión para guardar favoritos");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("❤️ Agregado a favoritos");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al agregar favorito:", error);
    }
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
      text-align: center;
      color: white;
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .hero h1 span {
      color: #e94560;
    }

    .hero p {
      color: #aaa;
      font-size: 1.1rem;
    }

    .divider {
      width: 80px;
      height: 4px;
      background: #e94560;
      margin: 15px auto;
      border-radius: 10px;
    }

    .filtros-section {
      background: white;
      padding: 25px 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    .filtros-inner {
      max-width: 1200px;
      margin: 0 auto;

      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .filtros-label {
      font-weight: bold;
      color: #1a1a2e;
    }

    .filtro-group {
      flex: 1;
      min-width: 150px;

      display: flex;
      align-items: center;
      gap: 8px;

      background: #f5f5f5;

      padding: 10px 15px;

      border-radius: 10px;
    }

    select {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .btn-limpiar {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;

      background: #e94560;
      color: white;

      cursor: pointer;

      transition: 0.3s;

      font-weight: bold;
    }

    .btn-limpiar:hover {
      background: #c73652;
      transform: translateY(-2px);
    }

    .container {
      min-height: 60vh;
      background: #f5f5f5;
      padding: 30px 40px 60px;
    }

    .resultados-info {
      max-width: 1200px;
      margin: 0 auto;
      color: #777;
    }

    .resultados-info span {
      color: #e94560;
      font-weight: bold;
    }

    .grid {
      max-width: 1200px;
      margin: 25px auto 0;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .no-resultados {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
    }

    .no-resultados p {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .no-resultados h3 {
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .no-resultados span {
      color: #777;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 20px;
      }

      .hero h1 {
        font-size: 2rem;
      }

      .filtros-section {
        padding: 20px;
      }

      .container {
        padding: 20px;
      }
    }
  `;

  render() {
    return html`
      <div class="hero">
        <h1>Explora <span>Destinos</span></h1>

        <div class="divider"></div>

        <p>Encuentra el lugar perfecto para tu próximo viaje</p>
      </div>

      <div class="filtros-section">
        <div class="filtros-inner">
          <span class="filtros-label">🔍 Filtrar:</span>

          <div class="filtro-group">
            <span>🌡️</span>

            <select .value=${this.clima} @change=${this.handleClima}>
              <option value="">Todos los climas</option>
              <option value="cálido">Cálido</option>
              <option value="frío">Frío</option>
            </select>
          </div>

          <div class="filtro-group">
            <span>💰</span>

            <select
              .value=${this.presupuesto}
              @change=${this.handlePresupuesto}
            >
              <option value="">Todos los presupuestos</option>
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
          </div>

          <div class="filtro-group">
            <span>🗺️</span>

            <select .value=${this.tipo} @change=${this.handleTipo}>
              <option value="">Todos los tipos</option>
              <option value="playa">Playa</option>
              <option value="ciudad">Ciudad</option>
              <option value="aventura">Aventura</option>
            </select>
          </div>

          <button class="btn-limpiar" @click=${this.limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div class="container">
        <div class="resultados-info">
          Mostrando <span>${this.filtrados.length}</span> destinos
        </div>

        <div class="grid">
          ${this.filtrados.length === 0
            ? html`
                <div class="no-resultados">
                  <p>😕</p>

                  <h3>No hay destinos con esos filtros</h3>

                  <span>Intenta con otras opciones</span>
                </div>
              `
            : this.filtrados.map(
                (destino) => html`
                  <destination-card
                    .destino=${destino}
                    @favorito=${() => this.agregarFavorito(destino.id)}
                  >
                  </destination-card>
                `,
              )}
        </div>
      </div>
    `;
  }
}

customElements.define("mi-destinations", DestinationsPage);
