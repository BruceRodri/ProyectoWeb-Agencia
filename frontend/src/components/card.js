import { LitElement, html, css } from "lit";

class DestinationCard extends LitElement {
  static properties = {
    destino: { type: Object },
    usuario: { type: Object },
    modalAbierto: { type: Boolean },
    // NUEVAS PROPIEDADES PARA EL PAGO
    total: { type: Number },
    metodoPago: { type: String },
  };

  constructor() {
    super();
    this.destino = {};
    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    this.modalAbierto = false;
    this.total = 0;
    this.metodoPago = "transferencia"; // Valor por defecto
  }

  // --- LÓGICA DE CÁLCULO ---
  calcularTotal() {
    const fechaEntrada = this.shadowRoot.getElementById("fecha_entrada")?.value;
    const fechaSalida = this.shadowRoot.getElementById("fecha_salida")?.value;
    const personas =
      parseInt(this.shadowRoot.getElementById("personas")?.value) || 0;
    const precioNoche = this.destino.precio || 0;

    if (fechaEntrada && fechaSalida && personas > 0) {
      const inicio = new Date(fechaEntrada);
      const fin = new Date(fechaSalida);
      const diferenciaDias = (fin - inicio) / (1000 * 60 * 60 * 24);

      if (diferenciaDias > 0) {
        this.total = diferenciaDias * personas * precioNoche;
      } else {
        this.total = 0;
      }
    } else {
      this.total = 0;
    }
  }

  seleccionarPago(metodo) {
    this.metodoPago = metodo;
  }

  // --- MÉTODOS EXISTENTES MEJORADOS ---
  tipoIcon(tipo) {
    const icons = { playa: "🏖️", ciudad: "🏙️", aventura: "🏔️" };
    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = { bajo: "💰", medio: "💳", alto: "💎" };
    return icons[presupuesto] || "💰";
  }

  abrirModal() {
    if (!this.usuario) {
      alert("Debes iniciar sesión para realizar una reserva");
      window.location.href = "/login";
      return;
    }
    this.modalAbierto = true;
    this.total = 0; // Resetear total al abrir
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async handleReserva() {
    // 1. CAPTURAR ELEMENTOS BÁSICOS
    const inputEntrada = this.shadowRoot.querySelector("#fecha_entrada");
    const inputSalida = this.shadowRoot.querySelector("#fecha_salida");
    const inputPersonas = this.shadowRoot.querySelector("#personas");
    const selectHabitacion = this.shadowRoot.querySelector("#tipo_habitacion");

    // 2. VALIDACIÓN DE EXISTENCIA EN EL DOM
    if (!inputEntrada || !inputSalida || !inputPersonas || !selectHabitacion) {
      alert("ERROR INTERNO: NO SE PUDO ACCEDER AL FORMULARIO.");
      return;
    }

    // 3. VALIDACIÓN ESPECÍFICA SI ES TARJETA
    if (this.metodoPago === "tarjeta") {
      const num = this.shadowRoot.querySelector("#num_tarjeta")?.value;
      const exp = this.shadowRoot.querySelector("#exp_tarjeta")?.value;
      const cvv = this.shadowRoot.querySelector("#cvv_tarjeta")?.value;

      if (!num || !exp || !cvv) {
        alert("POR FAVOR INGRESA LOS DATOS DE TU TARJETA PARA CONTINUAR");
        return;
      }

      if (num.length < 16) {
        alert("EL NÚMERO DE TARJETA DEBE TENER 16 DÍGITOS");
        return;
      }
    }

    // 4. PREPARAR OBJETO DE DATOS PARA EL BACKEND
    const dataReserva = {
      usuario_id: this.usuario.id,
      destino_id: this.destino.id,
      fecha_entrada: inputEntrada.value,
      fecha_salida: inputSalida.value,
      personas: inputPersonas.value,
      tipo_habitacion: selectHabitacion.value,
      total_pago: this.total, // PROPIEDAD REACCIONARIA DE LA CLASE
      metodo_pago: this.metodoPago, // PROPIEDAD REACCIONARIA DE LA CLASE
    };

    // 5. VALIDACIONES DE LÓGICA DE NEGOCIO
    if (
      !dataReserva.fecha_entrada ||
      !dataReserva.fecha_salida ||
      !dataReserva.personas
    ) {
      alert("POR FAVOR COMPLETA TODOS LOS CAMPOS OBLIGATORIOS");
      return;
    }

    if (this.total <= 0) {
      alert("EL TOTAL NO PUEDE SER $0. REVISA LAS FECHAS SELECCIONADAS.");
      return;
    }

    // 6. ENVÍO AL SERVIDOR (EXPRESS)
    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataReserva),
      });

      const data = await response.json();

      if (response.ok) {
        // MENSAJE PERSONALIZADO SEGÚN EL MÉTODO
        let mensajeExito = `✅ RESERVA CONFIRMADA POR $${this.total}\n`;
        if (this.metodoPago === "transferencia") {
          mensajeExito += "POR FAVOR, ENVÍA EL COMPROBANTE AL CORREO DE PAGOS.";
        } else if (this.metodoPago === "tarjeta") {
          mensajeExito += "EL PAGO HA SIDO PROCESADO EXITOSAMENTE.";
        }

        alert(mensajeExito);
        this.cerrarModal();
      } else {
        alert(data.error || "ERROR AL PROCESAR LA RESERVA EN EL SERVIDOR");
      }
    } catch (error) {
      console.error("ERROR CRÍTICO EN LA PETICIÓN:", error);
      alert("NO SE PUDO CONECTAR CON EL SERVIDOR. INTENTA MÁS TARDE.");
    }
  }

  static styles = css`
    .resumen-total {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 12px;
      border: 2px dashed #e94560;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    .total-monto {
      font-size: 1.5rem;
      font-weight: 800;
      color: #e94560;
    }

    .pago-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .pago-opciones {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .pago-item {
      padding: 10px;
      border: 2px solid #eee;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      font-size: 0.8rem;
      font-weight: bold;
      transition: 0.3s;
      background: white;
    }

    .pago-item.active {
      border-color: #e94560;
      background: #fff0f3;
      color: #e94560;
    }
    .tarjeta-form {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tarjeta-form input {
      background: white !important;
      border: 1px solid #ddd !important;
    }
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
      backdrop-filter: blur(5px);
    }
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
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
    .btn-reservar {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-favorito {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: #1a1a2e;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    /* MODIFICA ESTAS REGLAS EN TU CSS */

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center; /* CENTRA EL MODAL VERTICALMENTE */
      justify-content: center;
      z-index: 1000;
      padding: 20px; /* EVITA QUE EL MODAL TOQUE LOS BORDES EN MÓVILES */
    }

    .modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh; /* QUE NO MIDA MÁS DEL 90% DE LA ALTURA DE LA PANTALLA */
      display: flex;
      flex-direction: column; /* PARA QUE EL HEADER Y FOOTER SE QUEDEN FIJOS */
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    /* AÑADE ESTA REGLA PARA EL SCROLL */
    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      overflow-y: auto; /* ESTO ACTIVA EL SCROLL SI EL CONTENIDO ES MUY LARGO */
    }
    .modal-header {
      background: #1a1a2e;
      padding: 20px;
      color: white;
      display: flex;
      justify-content: space-between;
    }
    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    input,
    select,
    textarea {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .modal-footer {
      padding: 20px;
      display: flex;
      gap: 10px;
    }
    .btn-confirmar {
      flex: 2;
      padding: 12px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-cancelar {
      flex: 1;
      padding: 12px;
      background: #eee;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
    .precio-box {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 15px;
      padding: 10px;
      background: #fde8ec;
      border-radius: 10px;
      border-left: 4px solid #e94560;
    }
    .precio-valor {
      font-size: 1.4rem;
      font-weight: 800;
      color: #e94560;
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
            <span class="badge badge-presupuesto"
              >${this.presupuestoIcon(this.destino.presupuesto)}
              ${this.destino.presupuesto}</span
            >
            <span class="badge badge-tipo"
              >${this.tipoIcon(this.destino.tipo)} ${this.destino.tipo}</span
            >
          </div>
          <div class="precio-box">
            <span class="precio-valor">$${this.destino.precio}</span>
            <span class="precio-label">por persona / noche</span>
          </div>
          <div class="botones">
            <button
              class="btn-favorito"
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("favorito", {
                    bubbles: true,
                    composed: true,
                    detail: { id: this.destino.id },
                  }),
                )}
            >
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
                  <button
                    @click=${this.cerrarModal}
                    style="background:none; border:none; color:white; cursor:pointer;"
                  >
                    ✕
                  </button>
                </div>

                <div class="modal-body">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Entrada <span style="color:red">*</span></label>
                      <input
                        type="date"
                        id="fecha_entrada"
                        @input=${this.calcularTotal}
                      />
                    </div>
                    <div class="form-group">
                      <label>Salida <span style="color:red">*</span></label>
                      <input
                        type="date"
                        id="fecha_salida"
                        @input=${this.calcularTotal}
                      />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Personas <span style="color:red">*</span></label>
                      <input
                        type="number"
                        id="personas"
                        min="1"
                        @input=${this.calcularTotal}
                        placeholder="1"
                      />
                    </div>
                    <div class="form-group">
                      <label>Habitación <span style="color:red">*</span></label>
                      <select id="tipo_habitacion">
                        <option value="individual">Individual</option>
                        <option value="doble">Doble</option>
                        <option value="suite">Suite</option>
                      </select>
                    </div>
                  </div>

                  <div class="pago-container">
                    <label>Método de Pago</label>
                    <div class="pago-opciones">
                      <div
                        class="pago-item ${this.metodoPago === "transferencia"
                          ? "active"
                          : ""}"
                        @click=${() => this.seleccionarPago("transferencia")}
                      >
                        🏦 Transf.
                      </div>
                      <div
                        class="pago-item ${this.metodoPago === "tarjeta"
                          ? "active"
                          : ""}"
                        @click=${() => this.seleccionarPago("tarjeta")}
                      >
                        💳 Tarjeta
                      </div>
                      <div
                        class="pago-item ${this.metodoPago === "efectivo"
                          ? "active"
                          : ""}"
                        @click=${() => this.seleccionarPago("efectivo")}
                      >
                        💵 Efectivo
                      </div>
                    </div>
                  </div>

                  ${this.metodoPago === "tarjeta"
                    ? html`
                        <div
                          class="tarjeta-form"
                          style="margin-top: 15px; padding: 15px; border: 1px solid #eee; border-radius: 12px; background: #fafafa;"
                        >
                          <div class="form-group">
                            <label>Núm. de identificación de pago</label>
                            <input
                              type="text"
                              id="num_tarjeta"
                              autocomplete="off"
                              placeholder="XXXX XXXX XXXX XXXX"
                              maxlength="16"
                            />
                          </div>
                          <div class="form-row" style="margin-top: 10px;">
                            <div class="form-group">
                              <label>Vencimiento</label>
                              <input
                                type="text"
                                id="exp_tarjeta"
                                autocomplete="off"
                                placeholder="00 / 00"
                                maxlength="5"
                              />
                            </div>
                            <div class="form-group">
                              <label>Código seg.</label>
                              <input
                                type="password"
                                id="cvv_tarjeta"
                                autocomplete="off"
                                placeholder="..."
                                maxlength="3"
                              />
                            </div>
                          </div>
                        </div>
                      `
                    : ""}

                  <div class="resumen-total">
                    <span>Total estimado:</span>
                    <span class="total-monto">$${this.total}</span>
                  </div>
                </div>

                <div class="modal-footer">
                  <button class="btn-cancelar" @click=${this.cerrarModal}>
                    Cancelar
                  </button>
                  <button class="btn-confirmar" @click=${this.handleReserva}>
                    ✈️ Confirmar ($${this.total})
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
