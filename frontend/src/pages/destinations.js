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
    destinoSorpresa: { type: Object },
  };

  constructor() {
    super();
    this.destinos = [];
    this.filtrados = [];
    this.clima = "";
    this.presupuesto = "";
    this.tipo = "";
    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    this.destinoSorpresa = null;
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
  sorprender() {
    if (!this.usuario) {
      window.location.href = "/login";
      return;
    }
    const aleatorio = Math.floor(Math.random() * this.destinos.length);
    this.destinoSorpresa = this.destinos[aleatorio];
  }

  cerrarSorpresa() {
    this.destinoSorpresa = null;
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
    .sorpresa-btn-container {
      max-width: 1200px;
      margin: 0 auto 10px auto;
      display: flex;
      justify-content: center;
    }

    .btn-sorpresa {
      padding: 14px 35px;
      background: linear-gradient(135deg, #f7971e, #ffd200);
      color: #1a1a2e;
      border: none;
      border-radius: 30px;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 5px 20px rgba(247, 151, 30, 0.4);
      letter-spacing: 0.5px;
    }

    .btn-sorpresa:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 25px rgba(247, 151, 30, 0.5);
    }

    .sorpresa-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .sorpresa-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      animation: popIn 0.3s ease;
    }

    @keyframes popIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .sorpresa-header {
      background: linear-gradient(135deg, #f7971e, #ffd200);
      padding: 30px;
      text-align: center;
    }

    .sorpresa-header p {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1a1a2e;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }

    .sorpresa-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 10px;
    }

    .sorpresa-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1a2e;
    }

    .sorpresa-body {
      padding: 25px 30px;
    }

    .sorpresa-body p {
      color: #777;
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .sorpresa-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 25px;
    }

    .sorpresa-footer {
      display: flex;
      gap: 10px;
      padding: 0 30px 25px 30px;
    }

    .btn-otra {
      flex: 1;
      padding: 13px;
      background: #f5f5f5;
      color: #1a1a2e;
      border: none;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-otra:hover {
      background: #eee;
    }

    .btn-guardar-sorpresa {
      flex: 1;
      padding: 13px;
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-guardar-sorpresa:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(233, 69, 96, 0.4);
    }

    .btn-cerrar-sorpresa {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #1a1a2e;
      font-size: 1.2rem;
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .btn-cerrar-sorpresa:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    .sorpresa-header {
      position: relative;
    }
  `;
  tipoIcon(tipo) {
    const icons = { playa: "🏖️", ciudad: "🏙️", aventura: "🏔️" };
    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = { bajo: "💰", medio: "💳", alto: "💎" };
    return icons[presupuesto] || "💰";
  }
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
        <div class="sorpresa-btn-container">
          <button class="btn-sorpresa" @click=${this.sorprender}>
            🎲 Sorpréndeme
          </button>
        </div>
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
      ${this.destinoSorpresa
        ? html`
            <div class="sorpresa-overlay" @click=${this.cerrarSorpresa}>
              <div class="sorpresa-card" @click=${(e) => e.stopPropagation()}>
                <div class="sorpresa-header">
                  <button
                    class="btn-cerrar-sorpresa"
                    @click=${this.cerrarSorpresa}
                  >
                    ✕
                  </button>
                  <p>🎲 Tu destino sorpresa es</p>
                  <span class="sorpresa-icon"
                    >${this.tipoIcon(this.destinoSorpresa.tipo)}</span
                  >
                  <h2>${this.destinoSorpresa.nombre}</h2>
                </div>
                <div class="sorpresa-body">
                  <p>${this.destinoSorpresa.descripcion}</p>
                  <div class="sorpresa-badges">
                    <span class="badge badge-clima"
                      >🌡️ ${this.destinoSorpresa.clima}</span
                    >
                    <span class="badge badge-presupuesto">
                      ${this.presupuestoIcon(this.destinoSorpresa.presupuesto)}
                      ${this.destinoSorpresa.presupuesto}
                    </span>
                    <span class="badge badge-tipo">
                      ${this.tipoIcon(this.destinoSorpresa.tipo)}
                      ${this.destinoSorpresa.tipo}
                    </span>
                    <span class="badge badge-clima"
                      >📍 ${this.destinoSorpresa.pais}</span
                    >
                  </div>
                </div>
                <div class="sorpresa-footer">
                  <button class="btn-otra" @click=${this.sorprender}>
                    🎲 Otra sorpresa
                  </button>
                  <button
                    class="btn-guardar-sorpresa"
                    @click=${() =>
                      this.agregarFavorito(this.destinoSorpresa.id)}
                  >
                    ❤️ Guardar favorito
                  </button>
                </div>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

customElements.define("mi-destinations", DestinationsPage);
