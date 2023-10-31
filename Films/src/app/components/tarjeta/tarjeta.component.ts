import { Component } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { validacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent {
  errorMessage: string = '';
  successMessage: string = '';
  message: string = '';

  tarjetaForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta: new FormControl('', [Validators.required,
      (control: AbstractControl) => {
        const numeroTarjeta = control.value;
        if (!validacionTarjeta.validarTarjetaLongitud(numeroTarjeta)) {
          this.message = 'El nº de tarjeta debe tener una longitud de 16 dígitos';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      },
      (control: AbstractControl) => {
        const numeroTarjeta = control.value;
        if (!validacionTarjeta.soloNumeros(numeroTarjeta)) {
          this.message = 'El nº de tarjeta debe contener solo números';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      }
    ]),
    fechaVencimiento: new FormControl('', [Validators.required,
      (control: AbstractControl) => {
        const fecha = control.value;
        if (!validacionTarjeta.validarFormatoFechaVencimiento(fecha)) {
          this.message = 'La fecha debe ser en formato MM/YY o MM/YYYY';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      },
      (control: AbstractControl) => {
        const fecha = control.value;
        if (!validacionTarjeta.validarFechaNoExpirada(fecha)) {
          this.message = 'La tarjeta está vencida';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      }
    ]),
    CVC: new FormControl('', [Validators.required,
      (control: AbstractControl) => {
        const cvc = control.value;
        if (!validacionTarjeta.validarCVCLongitud(cvc)) {
          this.message = 'La longitud del CVC debe ser de 3 o 4 dígitos';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      },
      (control: AbstractControl) => {
        const cvc = control.value;
        if (!validacionTarjeta.soloNumeros(cvc)) {
          this.message = 'El CVC debe contener solo números';
          return { message: this.message };
        }
        this.message = ''; // Restablece el mensaje si la validación pasa
        return null;
      }
    ])
  });

  constructor(){}

  get firstName () {return this.tarjetaForm.get('firstName')}
  get lastName () {return this.tarjetaForm.get('lastName')}
  get nTarjeta () {return this.tarjetaForm.get('nTarjeta')}
  get fechaVencimiento () {return this.tarjetaForm.get('fechaVencimiento')}
  get CVC () {return this.tarjetaForm.get('CVC')}

  onSubmit ()
  {
      let tarjeta = new Tarjeta()
  }
}