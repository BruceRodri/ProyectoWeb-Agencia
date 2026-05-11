import { LitElement, html, css } from "lit";

class TestPage extends LitElement {
  static properties = {
    usuario: { type: Object },
    preguntaActual: { type: Number },
    respuestas: { type: Array },
    resultado: { type: Object },
    destinos: { type: Array },
    recomendados: { type: Array },
  };

  constructor() {
    super();
    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    this.preguntaActual = 0;
    this.respuestas = [];
    this.resultado = null;
    this.destinos = [];
    this.recomendados = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.usuario) {
      window.location.href = "/login";
      return;
    }
    this.cargarDestinos();
  }

  async cargarDestinos() {
    try {
      const response = await fetch("http://localhost:3000/destinations");
      const data = await response.json();
      this.destinos = data;
    } catch (error) {
      console.error("Error al cargar destinos:", error);
    }
  }

  preguntas = [
    {
      pregunta: "¿Qué prefieres hacer en tus vacaciones?",
      opciones: [
        { texto: "🏖️ Playa y sol", tipo: "playa" },
        { texto: "🏔️ Montaña y naturaleza", tipo: "aventura" },
        { texto: "🏙️ Ciudades y cultura", tipo: "ciudad" },
      ],
    },
    {
      pregunta: "¿Cuál es tu presupuesto ideal?",
      opciones: [
        { texto: "💰 Bajo — viajo con lo justo", presupuesto: "bajo" },
        { texto: "💳 Medio — equilibrio perfecto", presupuesto: "medio" },
        { texto: "💎 Alto — me gusta el lujo", presupuesto: "alto" },
      ],
    },
    {
      pregunta: "¿Cómo describes tu forma de viajar?",
      opciones: [
        { texto: "🧘 Relajado y tranquilo", clima: "cálido" },
        { texto: "🔥 Con energía y aventura", clima: "frío" },
        { texto: "❤️ Romántico y especial", clima: "cálido" },
      ],
    },
  ];

  perfiles = {
    "playa-bajo-cálido": {
      nombre: "Viajero Playero 🏖️",
      descripcion:
        "Amas el sol, la arena y el mar. Buscas experiencias relajantes sin gastar demasiado.",
    },
    "playa-medio-cálido": {
      nombre: "Explorador Costero 🌊",
      descripcion:
        "Te encantan las playas pero también disfrutas de comodidades. El equilibrio perfecto.",
    },
    "playa-alto-cálido": {
      nombre: "Viajero de Lujo 💎",
      descripcion:
        "Playas paradisíacas con todo el confort. Solo lo mejor para ti.",
    },
    "aventura-bajo-frío": {
      nombre: "Aventurero Salvaje 🏔️",
      descripcion:
        "Te apasiona la naturaleza, los retos y descubrir lugares únicos sin gastar mucho.",
    },
    "aventura-medio-frío": {
      nombre: "Explorador Intrépido 🧗",
      descripcion:
        "Buscas aventuras reales con algo de comodidad. La montaña es tu hogar.",
    },
    "aventura-alto-frío": {
      nombre: "Aventurero Premium 🌋",
      descripcion:
        "Aventura sin límites con el mejor equipo y los mejores destinos.",
    },
    "ciudad-bajo-cálido": {
      nombre: "Mochilero Urbano 🎒",
      descripcion:
        "Amas las ciudades, su cultura y su gente. Viajas ligero y con presupuesto ajustado.",
    },
    "ciudad-medio-cálido": {
      nombre: "Viajero Cultural 🎭",
      descripcion:
        "Te fascinan la historia, el arte y la gastronomía de cada ciudad.",
    },
    "ciudad-alto-cálido": {
      nombre: "Jet Setter 🌃",
      descripcion:
        "Las grandes ciudades del mundo son tu patio de juegos. Solo los mejores hoteles.",
    },
  };

  responder(opcion) {
    this.respuestas = [...this.respuestas, opcion];

    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual = this.preguntaActual + 1;
    } else {
      this.calcularResultado();
    }
  }

  async calcularResultado() {
    const tipo = this.respuestas.find((r) => r.tipo)?.tipo || "playa";
    const presupuesto =
      this.respuestas.find((r) => r.presupuesto)?.presupuesto || "medio";
    const clima = this.respuestas.find((r) => r.clima)?.clima || "cálido";

    const clave = `${tipo}-${presupuesto}-${clima}`;
    this.resultado = this.perfiles[clave] || {
      nombre: "Viajero Libre 🌍",
      descripcion:
        "Eres único, no te encasillas en un solo estilo. El mundo entero es tu destino.",
    };

    try {
      const response = await fetch(
        `http://localhost:3000/destinations/recomendados?tipo=${tipo}&presupuesto=${presupuesto}&clima=${encodeURIComponent(clima)}`,
      );
      const data = await response.json();
      this.recomendados = data;
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
    }
  }

  reiniciar() {
    this.preguntaActual = 0;
    this.respuestas = [];
    this.resultado = null;
    this.recomendados = [];
  }

  tipoIcon(tipo) {
    const icons = { playa: "🏖️", ciudad: "🏙️", aventura: "🏔️" };
    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = { bajo: "💰", medio: "💳", alto: "💎" };
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
      text-align: center;
      color: white;
    }

    .hero h1 {
      font-size: 2.8rem;
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

    .container {
      background: #f5f5f5;
      min-height: 70vh;
      padding: 60px 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .test-box {
      background: white;
      border-radius: 24px;
      padding: 50px 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .progreso {
      display: flex;
      gap: 8px;
      margin-bottom: 35px;
      justify-content: center;
    }

    .progreso-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #eee;
      transition: all 0.3s;
    }

    .progreso-dot.activo {
      background: #e94560;
      transform: scale(1.2);
    }

    .progreso-dot.completado {
      background: #28a745;
    }

    .numero-pregunta {
      text-align: center;
      color: #aaa;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }

    .pregunta {
      text-align: center;
      font-size: 1.6rem;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 35px;
      line-height: 1.4;
    }

    .opciones {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .opcion {
      padding: 18px 25px;
      background: #f8f8f8;
      border: 2px solid #eee;
      border-radius: 14px;
      font-size: 1.05rem;
      font-weight: 600;
      color: #1a1a2e;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;
    }

    .opcion:hover {
      border-color: #e94560;
      background: #fde8ec;
      transform: translateX(5px);
    }

    .resultado-box {
      text-align: center;
    }

    .resultado-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      display: block;
    }

    .resultado-box h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 15px;
    }

    .resultado-box h2 span {
      color: #e94560;
    }

    .resultado-desc {
      color: #777;
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 30px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .recomendados-titulo {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 20px;
      padding-top: 25px;
      border-top: 2px solid #f5f5f5;
    }

    .recomendados-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }

    .recomendado-card {
      background: #f8f8f8;
      border-radius: 14px;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
    }

    .recomendado-info h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .recomendado-info p {
      font-size: 0.8rem;
      color: #888;
    }

    .recomendado-icon {
      font-size: 2rem;
    }

    .botones-resultado {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-reiniciar {
      padding: 13px 25px;
      background: #f5f5f5;
      color: #1a1a2e;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-reiniciar:hover {
      background: #eee;
    }

    .btn-explorar {
      padding: 13px 25px;
      background: linear-gradient(135deg, #e94560, #c73652);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-explorar:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(233, 69, 96, 0.4);
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 20px;
      }

      .hero h1 {
        font-size: 2rem;
      }

      .test-box {
        padding: 35px 25px;
      }

      .pregunta {
        font-size: 1.3rem;
      }
    }
  `;

  render() {
    return html`
      <div class="hero">
        <h1>¿Qué tipo de <span>viajero</span> eres?</h1>
        <div class="divider"></div>
        <p>Responde 3 preguntas y descubre tu perfil de viajero</p>
      </div>

      <div class="container">
        <div class="test-box">
          ${this.resultado
            ? html`
                <div class="resultado-box">
                  <span class="resultado-icon">🧭</span>
                  <h2>Eres un <span>${this.resultado.nombre}</span></h2>
                  <p class="resultado-desc">${this.resultado.descripcion}</p>

                  ${this.recomendados.length > 0
                    ? html`
                        <p class="recomendados-titulo">
                          🌍 Destinos recomendados para ti
                        </p>
                        <div class="recomendados-grid">
                          ${this.recomendados.map(
                            (d) => html`
                              <div class="recomendado-card">
                                <div class="recomendado-info">
                                  <h4>${d.nombre}</h4>
                                  <p>
                                    📍 ${d.pais} · ${d.clima} · ${d.presupuesto}
                                  </p>
                                </div>
                                <span class="recomendado-icon">
                                  ${this.tipoIcon(d.tipo)}
                                </span>
                              </div>
                            `,
                          )}
                        </div>
                      `
                    : ""}

                  <div class="botones-resultado">
                    <button class="btn-reiniciar" @click=${this.reiniciar}>
                      🔄 Repetir test
                    </button>
                    <a class="btn-explorar" href="/destinations">
                      🌍 Explorar destinos
                    </a>
                  </div>
                </div>
              `
            : html`
                <div class="progreso">
                  ${this.preguntas.map(
                    (_, i) => html`
                      <div
                        class="progreso-dot ${i === this.preguntaActual
                          ? "activo"
                          : i < this.preguntaActual
                            ? "completado"
                            : ""}"
                      ></div>
                    `,
                  )}
                </div>

                <p class="numero-pregunta">
                  Pregunta ${this.preguntaActual + 1} de
                  ${this.preguntas.length}
                </p>

                <p class="pregunta">
                  ${this.preguntas[this.preguntaActual].pregunta}
                </p>

                <div class="opciones">
                  ${this.preguntas[this.preguntaActual].opciones.map(
                    (opcion) => html`
                      <button
                        class="opcion"
                        @click=${() => this.responder(opcion)}
                      >
                        ${opcion.texto}
                      </button>
                    `,
                  )}
                </div>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define("test-page", TestPage);
