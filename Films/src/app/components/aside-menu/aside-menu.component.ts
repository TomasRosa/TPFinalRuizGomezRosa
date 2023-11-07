import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.css']
})
export class AsideMenuComponent
{
  prendido = false;
    constructor (private router: Router, public userService: UserService)
    {
    }

    navegarSobreNosotros(componente: string)
    {
      this.router.navigate([componente]);
    }

    navegarLogin (componente: string)
    {
      this.router.navigate([componente]);
    }

    navegarRegister (componente: string)
    {
      this.router.navigate([componente]);
    }

    navegarOfertas(componente: string)
    {
      this.router.navigate([componente]);
    }

    toggleMenu ()
    {
      if (this.prendido == false)
      {
        this.prendido = true;
      }
      else if (this.prendido == true)
      {
        this.prendido = false;
      }
    }
}
