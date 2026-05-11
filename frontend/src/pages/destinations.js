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

    // MODAL
    modalAbierto: { type: Boolean },
    destinoReserva: { type: Object },
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

    // MODAL
    this.modalAbierto = false;
    this.destinoReserva = null;
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

  // SORPRESA
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

  // MODAL RESERVA (ESTO CONECTA LA SORPRESA CON LA CARD PARA REUTILIZAR EL PAGO)
  abrirReservaDesdeSorpresa(destino) {
    // Cerramos la ventana de sorpresa
    this.cerrarSorpresa();

    // Buscamos la card en el grid o creamos una temporal para disparar su modal de pago
    const tempCard = document.createElement("destination-card");
    tempCard.destino = destino;
    this.renderRoot.appendChild(tempCard);

    tempCard.updateComplete.then(() => {
      tempCard.abrirModal();
      // Limpiar elemento temporal al cerrar modal
      const checkClosed = setInterval(() => {
        if (!tempCard.modalAbierto) {
          tempCard.remove();
          clearInterval(checkClosed);
        }
      }, 500);
    });
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
      background: #f4f7fb;
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

      padding: 70px 30px;
      text-align: center;
      color: white;
    }

    .hero h1 {
      font-size: 3.2rem;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .hero h1 span {
      color: #e94560;
    }

    .hero p {
      color: #c7c7c7;
      font-size: 1.1rem;
    }

    .divider {
      width: 90px;
      height: 5px;
      border-radius: 999px;
      background: #e94560;
      margin: 18px auto;
    }

    /* FILTROS */

    .filtros-section {
      padding: 30px 20px;
      margin-top: -30px;
      position: relative;
      z-index: 20;
    }

    .filtros-inner {
      max-width: 1250px;
      margin: auto;

      background: white;
      border-radius: 24px;

      padding: 28px;

      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 20px;

      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
    }

    .filtros-label {
      width: 100%;
      font-size: 1.2rem;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 5px;
    }

    .filtro-wrapper {
      flex: 1;
      min-width: 220px;

      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filtro-wrapper label {
      font-size: 0.92rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .filtro-group {
      display: flex;
      align-items: center;
      gap: 10px;

      background: #f5f7fb;

      border: 2px solid transparent;

      padding: 14px 16px;
      border-radius: 16px;

      transition: all 0.3s ease;
    }

    .filtro-group:hover {
      border-color: #e94560;
      background: white;
    }

    .filtro-group select {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;

      font-size: 0.95rem;
      font-weight: 600;

      color: #1a1a2e;
      cursor: pointer;
    }

    .btn-limpiar {
      padding: 15px 25px;
      border: none;
      border-radius: 16px;

      background: linear-gradient(135deg, #e94560, #c73652);

      color: white;

      font-size: 0.95rem;
      font-weight: 700;

      cursor: pointer;
      transition: all 0.3s ease;

      height: fit-content;
    }

    .btn-limpiar:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(233, 69, 96, 0.3);
    }

    /* CONTENIDO */

    .container {
      min-height: 60vh;
      padding: 10px 30px 60px;
    }

    .resultados-info {
      max-width: 1250px;
      margin: 0 auto;

      color: #777;
      font-size: 1rem;
    }

    .resultados-info span {
      color: #e94560;
      font-weight: 800;
    }

    .grid {
      max-width: 1250px;
      margin: 30px auto 0;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 28px;
    }

    /* BOTON SORPRESA */

    .sorpresa-btn-container {
      max-width: 1250px;
      margin: 0 auto 25px auto;

      display: flex;
      justify-content: center;
    }

    .btn-sorpresa {
      padding: 15px 35px;

      background: linear-gradient(135deg, #f7971e, #ffd200);

      color: #1a1a2e;
      border: none;
      border-radius: 999px;

      font-size: 1rem;
      font-weight: 800;

      cursor: pointer;
      transition: all 0.3s ease;

      box-shadow: 0 10px 25px rgba(247, 151, 30, 0.35);
    }

    .btn-sorpresa:hover {
      transform: translateY(-3px) scale(1.03);
    }

    /* MODALES */

    .sorpresa-overlay {
      position: fixed;
      inset: 0;

      background: rgba(0, 0, 0, 0.7);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 1000;
      padding: 20px;
    }

    .sorpresa-card {
      width: 100%;
      max-width: 520px;

      background: white;
      border-radius: 28px;

      overflow: hidden;

      animation: aparecer 0.25s ease;

      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
    }

    @keyframes aparecer {
      from {
        transform: scale(0.9);
        opacity: 0;
      }

      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .sorpresa-header {
      background: linear-gradient(135deg, #f7971e, #ffd200);

      padding: 35px 30px;
      text-align: center;

      position: relative;
    }

    .sorpresa-header p {
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .sorpresa-header h2 {
      font-size: 2rem;
      color: #1a1a2e;
    }

    /* ESTILO PARA LA IMAGEN EN LA SORPRESA */
    .sorpresa-media img {
      width: 100%;
      border-radius: 12px;
      margin-top: 10px;
      max-height: 200px;
      object-fit: cover;
    }

    .sorpresa-body {
      padding: 28px;
    }

    .sorpresa-body p {
      color: #666;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .sorpresa-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .badge {
      padding: 9px 15px;
      border-radius: 999px;

      font-size: 0.85rem;
      font-weight: 700;
    }

    .badge-clima {
      background: #e8f4fd;
      color: #0077b6;
    }

    .badge-presupuesto {
      background: #fde8ec;
      color: #e94560;
    }

    .badge-tipo {
      background: #e9f9ee;
      color: #28a745;
    }

    .sorpresa-footer {
      padding: 0 28px 28px;

      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .btn-otra,
    .btn-reservar {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-otra {
      background: #f1f1f1;
    }

    .btn-reservar {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .btn-cerrar-sorpresa {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.3);
    }
  `;

  render() {
    return html`
      <div class="hero">
        <h1>EXPLORA <span>DESTINOS</span></h1>
        <div class="divider"></div>
        <p>Encuentra el lugar perfecto para tu próximo viaje</p>
      </div>

      <div class="filtros-section">
        <div class="filtros-inner">
          <span class="filtros-label">🔍 FILTRAR:</span>

          <div class="filtro-wrapper">
            <label>🌡️ CLIMA</label>
            <div class="filtro-group">
              <select .value=${this.clima} @change=${this.handleClima}>
                <option value="">TODOS</option>
                <option value="cálido">CÁLIDO</option>
                <option value="frío">FRÍO</option>
              </select>
            </div>
          </div>

          <div class="filtro-wrapper">
            <label>💰 PRESUPUESTO</label>
            <div class="filtro-group">
              <select
                .value=${this.presupuesto}
                @change=${this.handlePresupuesto}
              >
                <option value="">TODOS</option>
                <option value="bajo">BAJO</option>
                <option value="medio">MEDIO</option>
                <option value="alto">ALTO</option>
              </select>
            </div>
          </div>

          <div class="filtro-wrapper">
            <label>🗺️ TIPO</label>
            <div class="filtro-group">
              <select .value=${this.tipo} @change=${this.handleTipo}>
                <option value="">TODOS</option>
                <option value="playa">PLAYA</option>
                <option value="ciudad">CIUDAD</option>
                <option value="aventura">AVENTURA</option>
              </select>
            </div>
          </div>

          <button class="btn-limpiar" @click=${this.limpiarFiltros}>
            LIMPIAR FILTROS
          </button>
        </div>
      </div>

      <div class="container">
        <div class="sorpresa-btn-container">
          <button class="btn-sorpresa" @click=${this.sorprender}>
            🎲 SORPRÉNDEME
          </button>
        </div>

        <div class="resultados-info">
          Mostrando <span>${this.filtrados.length}</span> destinos
        </div>

        <div class="grid">
          ${this.filtrados.map(
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
                  <p>🎲 TU DESTINO SORPRESA ES</p>

                  <!-- IMAGEN CORREGIDA AQUÍ -->
                  <div class="sorpresa-media">
                    <img
                      src="${this.destinoSorpresa.imagen}"
                      alt="${this.destinoSorpresa.nombre}"
                    />
                  </div>

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
                  </div>
                </div>

                <div class="sorpresa-footer">
                  <button class="btn-otra" @click=${this.sorprender}>
                    🎲 OTRA SORPRESA
                  </button>

                  <!-- VINCULACIÓN AL MODAL DE PAGO CORREGIDA AQUÍ -->
                  <button
                    class="btn-reservar"
                    @click=${() =>
                      this.abrirReservaDesdeSorpresa(this.destinoSorpresa)}
                  >
                    ✈️ RESERVAR
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
