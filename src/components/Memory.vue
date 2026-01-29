<template>
  <div class="juego-memoria">
    <img src="/images/fondo.png" alt="Fondo" class="fondo" />

    <div class="contenido">
      <img src="/images/c_slogan.png" alt="Slogan" class="cslogan-img" />

      <div class="temporizador">
        <span>00:{{ tiempoFormateado }}</span>
      </div>
      <div class="area-juego">
        <div class="tablero">
          <div v-for="(carta, index) in cartas" :key="index" class="carta" @click="voltearCarta(index)"
            :class="{ mezclando: mezclando }" :style="mezclando ? `animation-delay: ${index * 0.05}s` : ''">
            <div class="card-inner" :class="{ girada: carta.volteada || carta.encontrada }">
              <div class="card-front">
                <img src="/images/card.png" alt="Reverso" />
              </div>
              <div class="card-back">
                <img :src="getImagenCarta(carta.valor)" :alt="carta.valor" />
              </div>
            </div>
          </div>
        </div>

        <div class="acciones">
          <button @click="home" class="boton-icono boton-home">
            <img src="/icons/casa.png" alt="Inicio" />
          </button>
        </div>
      </div>
    </div>

    <PopUpGanaste
      :juego="juegoSeleccionado" 
      :visible="ganaste" 
      @iniciar="aceptarGanaste"
    />
    <PopUpPerdiste
      :juego="juegoSeleccionado" 
      :visible="perdiste" 
      :parejas="parejasEncontradas"
      @cerrar="salirPerdiste"
      @iniciar="reiniciarPerdiste"
    />
  </div>



</template>

<script>
import PopUpGanaste from '../components/PopUpWin.vue'
import PopUpPerdiste from '../components/PopUpLose.vue'

export default {
  components: {
        PopUpGanaste,
        PopUpPerdiste,
  },
  computed: {
    tiempoFormateado() {
      return String(this.tiempo).padStart(2, '0');
    }
  },
  data() {
    return {
      cartas: [],
      primeraCarta: null,
      segundaCarta: null,
      bloqueo: false,
      tiempo: 60,
      temporizador: null,
      ganaste: false,
      perdiste: false,
      mezclando: false,
      juegoSeleccionado: 'memoria',
      mostrarPopup: false,
      parejasEncontradas: 0, 
    };
  },
  created() {
    this.reiniciarJuego();
  },
  methods: {
    getImagenCarta(valor) {
      return `${import.meta.env.BASE_URL}images/${valor}.png`;
    },
    aceptarGanaste() {            
            this.ganaste = false
            this.$router.push('/')
        },
    home(){this.$router.push('/')},
    cerrarPopup() {
      this.mostrarPopup = false
    },
    reiniciarPerdiste() {
      this.perdiste = false
      this.reiniciarJuego();
    },
    salirPerdiste() {
      this.perdiste = false
      this.$router.push('/')
    },
    iniciarJuego() {
      this.mostrarPopup = false
      this.reiniciarJuego();
    },
    generarCartas() {
      const valoresBase = ['c_cel', 'c_chip', 'c_con','c_digicel', 'c_fb','c_gb','c_ig', 'c_roaming', 'c_spotify', 'c_tiktok', 'c_waze', 'c_whatsapp', 'c_x', 'c_youtube'];
      const valores = [...valoresBase, ...valoresBase];
      const mezcladas = valores
        .map(valor => ({ valor, volteada: false, encontrada: false }))
        .sort(() => 0.5 - Math.random());
      return mezcladas;
    },
    voltearCarta(index) {
      if (this.ganaste || this.perdiste) return;
      const carta = this.cartas[index];
      if (this.bloqueo || carta.volteada || carta.encontrada) return;

      carta.volteada = true;

      if (!this.primeraCarta) {
        this.primeraCarta = { carta, index };
      } else if (!this.segundaCarta) {
        this.segundaCarta = { carta, index };
        this.bloqueo = true;

        setTimeout(() => {
          const { carta: primera } = this.primeraCarta;
          const { carta: segunda } = this.segundaCarta;

          if (primera.valor === segunda.valor) {
            primera.encontrada = true;
            segunda.encontrada = true;
            this.parejasEncontradas++;
          } else {
            primera.volteada = false;
            segunda.volteada = false;
          }

          this.primeraCarta = null;
          this.segundaCarta = null;
          this.bloqueo = false;

          if (this.cartas.every(c => c.encontrada)) {
            const tiempo1 = this.tiempo;
            clearInterval(this.temporizador);
             sessionStorage.setItem('juegoIniciado', 'true');
             this.$router.push({
              path: '/final',
              query: {
                tiempo: tiempo1
              }
            })
          }
        }, 700);
      }
    },
    iniciarTemporizador() {
      this.temporizador = setInterval(() => {
        if (this.tiempo > 0) {
          this.tiempo--;
        } else {
          clearInterval(this.temporizador);
          this.perdiste = true;
        }
      }, 1000);
    },
    reiniciarJuego() {
      this.cartas = this.generarCartas();
      this.primeraCarta = null;
      this.segundaCarta = null;
      this.bloqueo = true;
      this.tiempo = 60;
      this.ganaste = false;
      this.perdiste = false;
      this.parejasEncontradas = 0;
      clearInterval(this.temporizador);

      this.mezclando = true;
      setTimeout(() => {
        this.mezclando = false;
        this.bloqueo = false;
        this.iniciarTemporizador();
      }, 1500);
    }
  }
};
</script>
<style scoped>
.juego-memoria {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fondo {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.contenido {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 4vh 3vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  text-align: center;
  color: white;
  font-weight: bold;
}

.temporizador {
  background-image: url('/images/cronometro.png');
  color: #FFF;
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: 1vh;
  padding: 2.5vh 5vh;
  font-size: 7vh;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  align-self: center;
  min-width: 5ch; 
  font-family: 'Digib', monospace !important;
   
}

.temporizador span {
  font-family: 'Digib', monospace;
  display: inline-block;
  width: 5ch;
  text-align: center;
}

.tablero {
  margin-top: 2vh;
  display: grid;
  gap: 1.2vh;
  grid-template-columns: repeat(6, 1fr);
  width: min(90vw, 90vh);
  flex-grow: 5;
}

.carta {
  perspective: 1000px;
  width: 100%;
  aspect-ratio: 1/1;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.card-inner.girada {
  transform: rotateY(180deg);
}

.card-inner.girada .card-back {
  background-image: url('/images/cardfront.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 0.5vh;
}

.card-front img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 1vh;
  opacity: 0.5; 
}

.card-back img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  z-index: 2;
}

.card-back {
  transform: rotateY(180deg);
  align-items: center;     
  justify-content: center; 
  display: flex;  
}

.mezclando {
  animation: mezclar 0.6s ease-in-out forwards;
}

@keyframes mezclar {
  0% {
    transform: translateY(0) scale(1);
  }

  30% {
    transform: translateY(-2vh) scale(1.1) rotate(5deg);
  }

  60% {
    transform: translateY(2vh) scale(0.9) rotate(-5deg);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

.area-juego {
  width: 90vw;
  /* igual que el tablero */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1vh;
}

.tablero > .carta:nth-last-child(4) {
  grid-column: 2 / span 1;
}

.tablero > .carta:nth-last-child(3) {
  grid-column: 3 / span 1;
}

.tablero > .carta:nth-last-child(2) {
  grid-column: 4 / span 1;
}

.tablero > .carta:nth-last-child(1) {
  grid-column: 5 / span 1;
}


/* Botones fijos abajo */
.acciones {
  display: flex;
  justify-content: flex-end;
  width: 85vw;
  margin: 1vh auto 0;
}

.boton-icono {
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 7vh;
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(217, 87, 87, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.boton-icono:hover {
  transform: scale(1.1);
}

.boton-icono img {
  width: 5vh;
  height: 5vh;
  object-fit: contain;
}

.cslogan-img{
  max-width: 65%;
  margin: 1vh auto 3vh;
}

/* 📱 Adaptación a pantallas pequeñas */
@media (max-width: 768px) {
  .contenido h2 {
    font-size: 3vh;
  }

  .temporizador {
    font-size: 2.5vh;
  }

  .tablero {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5vh;
  }

  .acciones {
    gap: 4vw;
  }

  .boton-icono {
    width: 7vh;
    height: 7vh;
  }

  .boton-icono img {
    width: 3.5vh;
    height: 3.5vh;
  }
}
</style>
