import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { async } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cambiar-email',
  templateUrl: './cambiar-email.component.html',
  styleUrls: ['./cambiar-email.component.css']
})

export class CambiarEmailComponent implements OnInit {
  usuarioActual: User | null = null;
  formGroup=new FormGroup({
    email: new FormControl ('', [Validators.email, Validators.required])
  });
  result: string = ''
  mostrarFormulario: boolean = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      console.log (this.usuarioActual)
    });
  }

  get email() { return this.formGroup.get('email'); }

  private async metodoAux (){
    let newEmail /* VARIABLE PARA GUARDAR EL NUEVO EMAIL */
    if (this.formGroup.valid) {
      try {
        if (this.email != null){
          newEmail = this.email.value;
        }
        if (newEmail) {
          const resultado = await this.userService.changeEmail(this.usuarioActual as User, newEmail);
          
          if (resultado.success){
            this.result = resultado.message; 
          }
          else{ 
            this.result = resultado.message;
          }
        }
      } catch (error) {
        console.error('Error al cambiar el email del usuario:', error);
      }
    }
  }

  cancelar (){
    this.mostrarFormulario = false;
  }

  async confirmar (){
    await this.metodoAux()
    setTimeout(()=>{ /* LUEGO DE QUE SE MUESTRE EL RESULTADO, ESTE SE MUESTRA 3 SEGUNDOS Y SE QUITA. */
      this.mostrarFormulario = false
    }, 3000)
  }
}
