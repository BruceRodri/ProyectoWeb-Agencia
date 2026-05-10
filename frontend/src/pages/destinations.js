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

  // MODAL RESERVA
  abrirModalReserva(destino) {
    if (!this.usuario) {
      alert("Debes iniciar sesión para reservar");
      window.location.href = "/login";
      return;
    }

    this.destinoReserva = destino;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.destinoReserva = null;
  }

  async handleReserva() {
    const fecha_entrada = this.renderRoot.querySelector("#fecha_entrada").value;

    const fecha_salida = this.renderRoot.querySelector("#fecha_salida").value;

    const personas = this.renderRoot.querySelector("#personas").value;

    const tipo_habitacion =
      this.renderRoot.querySelector("#tipo_habitacion").value;

    const peticiones = this.renderRoot.querySelector("#peticiones").value;

    if (!fecha_entrada || !fecha_salida || !personas || !tipo_habitacion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id: this.destinoReserva.id,
          fecha_entrada,
          fecha_salida,
          personas,
          tipo_habitacion,
          peticiones,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✈️ Reserva realizada correctamente");
        this.cerrarModal();
        this.cerrarSorpresa();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al reservar:", error);
    }
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

    .filtros-title {
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

    .filtro-group span {
      font-size: 1.1rem;
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

    /* NO RESULTADOS */

    .no-resultados {
      grid-column: 1 / -1;

      text-align: center;
      padding: 70px 20px;
    }

    .no-resultados p {
      font-size: 4rem;
      margin-bottom: 15px;
    }

    .no-resultados h3 {
      color: #1a1a2e;
      margin-bottom: 10px;
      font-size: 1.5rem;
    }

    .no-resultados span {
      color: #777;
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

    .sorpresa-overlay,
    .modal-overlay {
      position: fixed;
      inset: 0;

      background: rgba(0, 0, 0, 0.7);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 1000;
      padding: 20px;
    }

    .sorpresa-card,
    .modal {
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

    .sorpresa-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 10px;
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
    .btn-guardar-sorpresa,
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

    .btn-guardar-sorpresa {
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
    }

    .btn-reservar {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .btn-otra:hover,
    .btn-guardar-sorpresa:hover,
    .btn-reservar:hover {
      transform: translateY(-2px);
    }

    .btn-cerrar-sorpresa,
    .btn-cerrar-modal {
      position: absolute;
      top: 15px;
      right: 15px;

      width: 38px;
      height: 38px;

      border-radius: 50%;
      border: none;

      cursor: pointer;

      font-size: 1rem;
      font-weight: bold;

      background: rgba(255, 255, 255, 0.3);
    }

    /* MODAL */

    .modal-header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);

      color: white;

      padding: 25px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      position: relative;
    }

    .modal-header h3 {
      margin-bottom: 5px;
      font-size: 1.4rem;
    }

    .modal-body {
      padding: 25px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;

      margin-bottom: 8px;

      font-weight: 700;
      color: #1a1a2e;
    }

    .required {
      color: #e94560;
    }

    input,
    textarea,
    select {
      width: 100%;

      padding: 13px;

      border-radius: 14px;
      border: 2px solid #ececec;

      outline: none;

      font-size: 0.95rem;

      transition: all 0.3s ease;
    }

    input:focus,
    textarea:focus,
    select:focus {
      border-color: #e94560;
    }

    textarea {
      resize: none;
      min-height: 100px;
    }

    .modal-footer {
      padding: 0 25px 25px;

      display: flex;
      gap: 12px;
    }

    .btn-cancelar,
    .btn-confirmar {
      flex: 1;

      padding: 14px;

      border: none;
      border-radius: 14px;

      font-weight: 700;

      cursor: pointer;
    }

    .btn-cancelar {
      background: #f1f1f1;
    }

    .btn-confirmar {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    /* RESPONSIVE */

    @media (max-width: 768px) {
      .hero {
        padding: 50px 20px;
      }

      .hero h1 {
        font-size: 2.2rem;
      }

      .container {
        padding: 10px 20px 50px;
      }

      .filtros-inner {
        padding: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-footer,
      .sorpresa-footer {
        flex-direction: column;
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

          <div class="filtro-wrapper">
            <label>🌡️ Clima</label>

            <div class="filtro-group">
              <select .value=${this.clima} @change=${this.handleClima}>
                <option value="">Todos</option>
                <option value="cálido">Cálido</option>
                <option value="frío">Frío</option>
              </select>
            </div>
          </div>

          <div class="filtro-wrapper">
            <label>💰 Presupuesto</label>

            <div class="filtro-group">
              <select
                .value=${this.presupuesto}
                @change=${this.handlePresupuesto}
              >
                <option value="">Todos</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          <div class="filtro-wrapper">
            <label>🗺️ Tipo</label>

            <div class="filtro-group">
              <select .value=${this.tipo} @change=${this.handleTipo}>
                <option value="">Todos</option>
                <option value="playa">Playa</option>
                <option value="ciudad">Ciudad</option>
                <option value="aventura">Aventura</option>
              </select>
            </div>
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
          Mostrando
          <span>${this.filtrados.length}</span>
          destinos
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

                  <p>🎲 Tu destino sorpresa es</p>

                  <span class="sorpresa-icon">
                    ${this.tipoIcon(this.destinoSorpresa.tipo)}
                  </span>

                  <h2>${this.destinoSorpresa.nombre}</h2>
                </div>

                <div class="sorpresa-body">
                  <p>${this.destinoSorpresa.descripcion}</p>

                  <div class="sorpresa-badges">
                    <span class="badge badge-clima">
                      🌡️ ${this.destinoSorpresa.clima}
                    </span>

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
                    🎲 Otra sorpresa
                  </button>

                  <button
                    class="btn-guardar-sorpresa"
                    @click=${() =>
                      this.agregarFavorito(this.destinoSorpresa.id)}
                  >
                    ❤️ Favorito
                  </button>

                  <button
                    class="btn-reservar"
                    @click=${() => this.abrirModalReserva(this.destinoSorpresa)}
                  >
                    ✈️ Reservar
                  </button>
                </div>
              </div>
            </div>
          `
        : ""}
      ${this.modalAbierto
        ? html`
            <div class="modal-overlay" @click=${this.cerrarModal}>
              <div class="modal" @click=${(e) => e.stopPropagation()}>
                <div class="modal-header">
                  <div>
                    <h3>✈️ Reservar en ${this.destinoReserva.nombre}</h3>

                    <p>📍 ${this.destinoReserva.pais}</p>
                  </div>

                  <button class="btn-cerrar-modal" @click=${this.cerrarModal}>
                    ✕
                  </button>
                </div>

                <div class="modal-body">
                  <div class="form-row">
                    <div class="form-group">
                      <label>
                        Fecha de entrada
                        <span class="required">*</span>
                      </label>

                      <input type="date" id="fecha_entrada" />
                    </div>

                    <div class="form-group">
                      <label>
                        Fecha de salida
                        <span class="required">*</span>
                      </label>

                      <input type="date" id="fecha_salida" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>
                        Número de personas
                        <span class="required">*</span>
                      </label>

                      <input
                        type="number"
                        id="personas"
                        min="1"
                        max="20"
                        placeholder="1"
                      />
                    </div>

                    <div class="form-group">
                      <label>
                        Tipo de habitación
                        <span class="required">*</span>
                      </label>

                      <select id="tipo_habitacion">
                        <option value="">Selecciona</option>

                        <option value="individual">Individual</option>

                        <option value="doble">Doble</option>

                        <option value="suite">Suite</option>

                        <option value="familiar">Familiar</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label> Peticiones especiales </label>

                    <textarea
                      id="peticiones"
                      placeholder="Ej: habitación con vista al mar..."
                    ></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button class="btn-cancelar" @click=${this.cerrarModal}>
                    Cancelar
                  </button>

                  <button class="btn-confirmar" @click=${this.handleReserva}>
                    ✈️ Confirmar reserva
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
