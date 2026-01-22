<template>
  <div class="juego-memoria">
    <img src="/images/fondo.png" alt="Fondo" class="fondo" />
     <div class="flash-border" v-if="mostrarFlash"></div>
    <div class="contenido">
      <img src="/images/c_slogan.png" alt="Slogan" class="cslogan-img" />

      <div class="temporizador">
        <span>00:{{ tiempoFormateado }}</span>
      </div>
      <div class="cuadro-texto">
        Busca en tiktok alguien que<br>
        hable sobre la publicidad<br>
        de Digicel antigua
      </div>
      <div class="botones">
        <button class="btn btn-blanco" @click="ganasteM()">
          <img src="/icons/premios-boton.png" alt="Fin" />
        </button>
      </div>
      <div class="acciones">
        <button @click="home" class="boton-icono boton-home">
          <img src="/icons/casa.png" alt="Inicio" />
        </button>
      </div>
    </div>

    <PopUpGanaste
      :visible="ganaste" 
      @iniciar="aceptarGanaste"
    />
    <PopUpPerdiste
      :visible="perdiste" 
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
  beforeUnmount() {
    clearInterval(this.temporizador);
  },
  data() {
    return {    
      tiempo: 60,
      temporizador: null,
      ganaste: false,
      perdiste: false,
      mostrarPopup: false,
       mostrarFlash: true
    };
  },
  mounted() {
  setTimeout(() => {
    this.mostrarFlash = false
  }, 600); // dura el relámpago
},
  created() {

    const juegoIniciado = sessionStorage.getItem('juegoIniciado');
    if (!juegoIniciado) {
      this.$router.push('/'); // redirige al home si no inició desde el juego
    }

    const tiempoRuta = Number(this.$route.query.tiempo);

    this.tiempo = tiempoRuta || 60;
    this.reiniciarJuego();
  },
  methods: {
    ganasteM(){
      this.ganaste = true;
      clearInterval(this.temporizador);
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
      this.$router.push('/juego')
    },
    salirPerdiste() {
      this.perdiste = false
      this.$router.push('/')
    },
    iniciarJuego() {
      this.mostrarPopup = false
      this.reiniciarJuego();
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
      const tiempoRuta = Number(this.$route.query.tiempo);
      this.tiempo = tiempoRuta || 60;
      this.ganaste = false;
      this.perdiste = false;
      clearInterval(this.temporizador);
      this.iniciarTemporizador();  
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
  font-family: 'HGBold', sans-serif !important
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

.botones {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center; /* Alinea al centro */
  margin-bottom: 1vh;

  font-family: 'HGBold', sans-serif;
}

.btn {
  width: 95%;           /* Que no se limite al 100% del contenedor si este es pequeño */
  height: 15rem;         /* Fija la altura */
  font-size: 3rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.btn-blanco {
  background-color: #932786;
  color: #fff;
}

/* Botones fijos abajo */
.acciones {
  display: flex;
  justify-content: flex-end;
  width: 85vw;
  margin: 1vh auto 0;

  margin-top: 5vh;
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

.cuadro-texto {
  display: inline-block;
  padding: 2.5vh 4vh;

  /* Fondo con transparencia */
  background: rgba(255, 126, 243, 0.021);

  /* Borde sólido (SIN transparencia) */
  border: 2px solid #ff7ef3;

  border-radius: 1.2vh;

  color: white;
  font-size: 3vh;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  
  width: 80%; 
  margin: 4vh auto 0;
  /* Opcional: efecto vidrio */
  backdrop-filter: blur(1.5px);
  margin-bottom: 6vh;
}

.flash-border {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;

  border: 6px solid transparent;

  animation: flash 0.6s ease-out forwards;
}

@keyframes flash {
  0% {
    box-shadow:
      0 0 0 rgba(255,255,255,0),
      inset 0 0 0 rgba(255,255,255,0);
    border-color: rgba(255,255,255,0);
  }

  20% {
    box-shadow:
      0 0 40px rgba(255,255,255,0.9),
      inset 0 0 30px rgba(255,255,255,0.8);
    border-color: #ffffff;
  }

  40% {
    box-shadow:
      0 0 20px rgba(255,0,255,0.9),
      inset 0 0 20px rgba(255,0,255,0.8);
    border-color: #ff00ff;
  }

  100% {
    box-shadow: none;
    border-color: transparent;
  }
}

/* 📱 Adaptación a pantallas pequeñas */
@media (max-width: 768px) {
  .contenido h2 {
    font-size: 3vh;
  }

  .temporizador {
    font-size: 2.5vh;
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

  .btn {
    width: 100%;  
    height: 12rem;    
  }

  .btn img{
    width: 95%;           
  }
}
</style>
