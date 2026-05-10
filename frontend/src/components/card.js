import { LitElement, html, css } from "lit";

class DestinationCard extends LitElement {
  static properties = {
    destino: { type: Object },
    usuario: { type: Object },
    modalAbierto: { type: Boolean },
  };

  constructor() {
    super();
    this.destino = {};
    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    this.modalAbierto = false;
  }

  tipoIcon(tipo) {
    const icons = { playa: "🏖️", ciudad: "🏙️", aventura: "🏔️" };
    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = { bajo: "💰", medio: "💳", alto: "💎" };
    return icons[presupuesto] || "💰";
  }

  async agregarFavorito() {
    if (!this.usuario) {
      alert("Debes iniciar sesión para guardar favoritos");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id: this.destino.id,
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

  abrirModal() {
    if (!this.usuario) {
      alert("Debes iniciar sesión para realizar una reserva");
      window.location.href = "/login";
      return;
    }
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async handleReserva() {
    const fecha_entrada = this.shadowRoot.getElementById("fecha_entrada").value;
    const fecha_salida = this.shadowRoot.getElementById("fecha_salida").value;
    const personas = this.shadowRoot.getElementById("personas").value;
    const tipo_habitacion =
      this.shadowRoot.getElementById("tipo_habitacion").value;
    const peticiones = this.shadowRoot.getElementById("peticiones").value;

    if (!fecha_entrada || !fecha_salida || !personas || !tipo_habitacion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (new Date(fecha_salida) <= new Date(fecha_entrada)) {
      alert("La fecha de salida debe ser posterior a la fecha de entrada");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id: this.destino.id,
          fecha_entrada,
          fecha_salida,
          personas,
          tipo_habitacion,
          peticiones,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Reserva realizada correctamente");
        this.cerrarModal();
      } else {
        alert(data.error || "Error al realizar la reserva");
      }
    } catch (error) {
      console.error("Error al realizar reserva:", error);
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    .card-image {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 0.4s;
    }

    .card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-pais {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      backdrop-filter: blur(5px);
    }

    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-body h3 {
      color: #1a1a2e;
      font-size: 1.4rem;
      margin-bottom: 10px;
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
      font-weight: bold;
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

    .botones {
      display: flex;
      gap: 10px;
    }

    .btn-favorito {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
      cursor: pointer;
      transition: 0.3s;
      font-weight: bold;
      font-size: 0.85rem;
    }

    .btn-favorito:hover {
      background: linear-gradient(135deg, #e94560, #c73652);
      transform: translateY(-2px);
    }

    .btn-reservar {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
      cursor: pointer;
      transition: 0.3s;
      font-weight: bold;
      font-size: 0.85rem;
    }

    .btn-reservar:hover {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      transform: translateY(-2px);
    }

    /* MODAL */
    .modal-overlay {
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

    .modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      animation: popIn 0.3s ease;
      overflow: hidden;
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

    .modal-header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 25px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      color: white;
      font-size: 1.3rem;
      font-weight: 800;
    }

    .modal-header p {
      color: #aaa;
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .btn-cerrar-modal {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-cerrar-modal:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 25px 30px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #333;
    }

    .required {
      color: #e94560;
    }

    input,
    select,
    textarea {
      padding: 11px 14px;
      border: 2px solid #eee;
      border-radius: 10px;
      font-size: 0.9rem;
      outline: none;
      transition: border 0.3s;
      background: #fafafa;
      color: #333;
      font-family: inherit;
    }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: #e94560;
      background: white;
    }

    textarea {
      resize: none;
      height: 80px;
    }

    .modal-footer {
      padding: 0 30px 25px 30px;
      display: flex;
      gap: 10px;
    }

    .btn-cancelar {
      flex: 1;
      padding: 13px;
      background: #f5f5f5;
      color: #333;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn-cancelar:hover {
      background: #eee;
    }

    .btn-confirmar {
      flex: 2;
      padding: 13px;
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
      box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
    }

    .btn-confirmar:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(233, 69, 96, 0.4);
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="card-image">
          <img src="${this.destino.imagen}" alt="${this.destino.nombre}" />
          <span class="card-pais">📍 ${this.destino.pais}</span>
        </div>

        <div class="card-body">
          <h3>${this.destino.nombre}</h3>
          <p>${this.destino.descripcion}</p>

          <div class="badges">
            <span class="badge badge-clima">🌡️ ${this.destino.clima}</span>
            <span class="badge badge-presupuesto">
              ${this.presupuestoIcon(this.destino.presupuesto)}
              ${this.destino.presupuesto}
            </span>
            <span class="badge badge-tipo">
              ${this.tipoIcon(this.destino.tipo)} ${this.destino.tipo}
            </span>
          </div>

          <div class="botones">
            <button class="btn-favorito" @click=${this.agregarFavorito}>
              ❤️ Favorito
            </button>
            <button class="btn-reservar" @click=${this.abrirModal}>
              ✈️ Reservar
            </button>
          </div>
        </div>
      </div>

      ${this.modalAbierto
        ? html`
            <div class="modal-overlay" @click=${this.cerrarModal}>
              <div class="modal" @click=${(e) => e.stopPropagation()}>
                <div class="modal-header">
                  <div>
                    <h3>✈️ Reservar en ${this.destino.nombre}</h3>
                    <p>📍 ${this.destino.pais}</p>
                  </div>
                  <button class="btn-cerrar-modal" @click=${this.cerrarModal}>
                    ✕
                  </button>
                </div>

                <div class="modal-body">
                  <div class="form-row">
                    <div class="form-group">
                      <label
                        >Fecha de entrada <span class="required">*</span></label
                      >
                      <input type="date" id="fecha_entrada" />
                    </div>
                    <div class="form-group">
                      <label
                        >Fecha de salida <span class="required">*</span></label
                      >
                      <input type="date" id="fecha_salida" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label
                        >Número de personas
                        <span class="required">*</span></label
                      >
                      <input
                        type="number"
                        id="personas"
                        min="1"
                        max="20"
                        placeholder="1"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        >Tipo de habitación
                        <span class="required">*</span></label
                      >
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
                    <label>Peticiones especiales</label>
                    <textarea
                      id="peticiones"
                      placeholder="Ej: habitación con vista al mar, cama extra, dieta vegetariana..."
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

customElements.define("destination-card", DestinationCard);
