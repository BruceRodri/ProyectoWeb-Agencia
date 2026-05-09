import { LitElement, html, css } from "lit";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Agregado a favoritos");
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

    .container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 40px 20px;
    }

    h1 {
      text-align: center;
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
      margin: 0 auto 30px auto;
      border-radius: 10px;
    }

    .filtros {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }

    select {
      padding: 10px 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      cursor: pointer;
      transition: border 0.3s;
    }

    select:focus {
      border-color: #e94560;
    }

    .btn-limpiar {
      padding: 10px 20px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-limpiar:hover {
      background: #c73652;
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

    .btn-favorito {
      width: 100%;
      padding: 10px;
      background: #1a1a2e;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-favorito:hover {
      background: #e94560;
    }

    .no-resultados {
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
        <h1>Destinos <span>Turísticos</span></h1>
        <div class="divider"></div>

        <div class="filtros">
          <select .value=${this.clima} @change=${this.handleClima}>
            <option value="">Todos los climas</option>
            <option value="cálido">Cálido</option>
            <option value="frío">Frío</option>
          </select>

          <select .value=${this.presupuesto} @change=${this.handlePresupuesto}>
            <option value="">Todos los presupuestos</option>
            <option value="bajo">Bajo</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>

          <select .value=${this.tipo} @change=${this.handleTipo}>
            <option value="">Todos los tipos</option>
            <option value="playa">Playa</option>
            <option value="ciudad">Ciudad</option>
            <option value="aventura">Aventura</option>
          </select>

          <button class="btn-limpiar" @click=${this.limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        <div class="grid">
          ${this.filtrados.length === 0
            ? html`<p class="no-resultados">
                No hay destinos con esos filtros
              </p>`
            : this.filtrados.map(
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
                        class="btn-favorito"
                        @click=${() => this.agregarFavorito(destino.id)}
                      >
                        ❤️ Guardar en favoritos
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
customElements.define("mi-destinations", DestinationsPage);
