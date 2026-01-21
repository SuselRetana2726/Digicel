<template>
  <div class="home-container">
    <div class="contenido">
      <img src="/images/logo.png" alt="Logo Digicel" class="logo-img" />
      <img src="/images/titulohome.png" alt="Título del juego" class="titulo-img" />
      <img src="/images/60-seg-home.png" alt="60 Segundos" class="seg-home-img" />
      <img src="/images/insignia-home.png" alt="Insignia" class="insignia-img" />
      <div class="botones">
        <button class="btn btn-blanco" @click="iniciarJuego()">
          Comenzar el reto
        </button>
      </div>
    </div>   
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    iniciarJuego() {
      this.mostrarPopup = false
      this.$router.push(`/juego`)     
    }
  }
}
</script>

<style scoped>
.home-container {
  background-image: url('/images/fondo.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contenido {
  width: 100%;
  max-width: 45vh;
  padding: 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 85vh;
  box-sizing: border-box;
  text-align: center;
  color: white;  
}

.titulo-img {
  width: 100%;
  margin-bottom: -10rem;
}


.seg-home-img {
  margin-top: 0;
}

.botones {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center; /* Alinea al centro */
}

.btn {
  width: 100%;           /* Que no se limite al 100% del contenedor si este es pequeño */
  height: 10rem;         /* Fija la altura */
  font-size: 3.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'HGBold', sans-serif;
}

.btn-blanco {
  background-color: #942686;
  color: #fff;
}

/* Responsivo para celulares pequeños */
@media (max-width: 480px) {
  .contenido {
    height: 80vh;
    padding: 1.5rem 1rem;
    margin-top: 0vh;
  }

  .titulo-img {
    max-width: 90%;
    margin-bottom: -5rem;
  }

   .logo-img {
    max-width: 50%;
  }

  .seg-home-img {
    max-width: 60%;
  }

   .insignia-img {
    max-width: 90%;
  }

  .botones {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center; /* Alinea al centro */
  font-family: 'HGBold', sans-serif;
}

.btn {
  width: 100%;           /* Que no se limite al 100% del contenedor si este es pequeño */
  height: 4rem;         /* Fija la altura */
  font-size: 0.95rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 1rem;
  font-family: 'HGBold', sans-serif;
}

}
</style>
