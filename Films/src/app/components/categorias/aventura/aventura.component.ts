import { Component } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-aventura',
  templateUrl: './aventura.component.html',
  styleUrls: ['./aventura.component.css']
})
export class AventuraComponent {
  private films: any;
  private originalFilms: any;
  filteredFilms: any[] = [];

  constructor(private dataFilms: FilmsFromAPIService, private carritoService: CarritoService, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    await this.dataFilms.initializeData();
    this.originalFilms = this.dataFilms.getMovies();
    this.films = [...this.originalFilms];
    this.filteredFilms = this.films.filter((film: Film) => film.genre.includes("Adventure"));
    this.mostrarPeliculasDeAventura();
  }

  agregarPeliculaAlCarrito (film: Film){
    if(this.userService.isLoggedIn)
    {
      this.carritoService.agregarAlCarrito(film)
    }
    else
    {
      alert("Debes iniciar sesion para agregar peliculas al carrito. ");
    }
  } 

  mostrarPeliculasDeAventura() {
    if (this.filteredFilms) {
      const contenedorGenero = document.getElementById("generoAventura");
  
      const tabla = document.createElement("table");
      const tbody = document.createElement("tbody");
      tabla.appendChild(tbody);
  
      for (let i = 0; i < this.filteredFilms.length; i++) {
        if (i % 5 === 0) {
          let fila = document.createElement("tr");
          let filaBoton = document.createElement ("tr");
  
          for (let j = 0; j < 5; j++) {
            if (i + j >= this.filteredFilms.length) {
              break;
            }
  
            const celda = document.createElement("td");
            const film = this.filteredFilms[i + j];
  
            celda.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <img alt="Imagen no disponible" src="${film.image}" width="200" height="300">
                <i><b style="font-size: 15px;">${film.title}</b></i>
                <i><b style="font-size: 15px; text-align: center;">${film.precio > 1500 ? `<s>$${film.precio}</s> En oferta: $${film.precio/2}` : `$${film.precio}`}</b></i>
              </div>
            `;

            const celdaBoton = document.createElement("td");
            const boton = document.createElement("button");
            boton.textContent = "🛒";
            boton.addEventListener("click", () => this.agregarPeliculaAlCarrito(this.filteredFilms[i + j]));
            celdaBoton.appendChild(boton);
  
            fila.appendChild(celda);
            filaBoton.appendChild (celdaBoton);
          }
  
          tbody.appendChild(fila);
          tbody.appendChild (filaBoton);
        }
      }
  
      if (contenedorGenero) {
        contenedorGenero.appendChild(tabla);
      } else {
        console.error("No se encontró el contenedor de la tabla.");
      }
    } else {
      console.error("No se encontraron datos de películas.");
    }
  }
}
