import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Admin } from 'src/app/models/admin';
import { Tarjeta } from 'src/app/models/tarjeta';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent {
  usuarioActual: User | null = null;
  adminActual: Admin | null = null;
  cardExists: boolean | null = false;
  formAddCard: boolean | null = false;
  lastFourDigits: String | null = null;
  permitirEditarTarjeta:boolean | null = false;
  showFormularioPassword: boolean | null = false;
  resultInputPassword: string = '';
  isLogoutModalVisible: boolean = false;

  activeOptionsEditCard: boolean | null = false;
  passwordToEdit: String = '';
  resultEditCard: String = '';
  showOptionButtonsToCard: boolean = true;
  cardFormGroup = new FormGroup ({
    firstName:  new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('',[Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta:  new FormControl ('',[Validators.required, ValidacionTarjeta.validarTarjetaLongitud(), ValidacionTarjeta.soloNumeros()]),
    fechaVencimiento: new FormControl('', [Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()])
  })

  get firstnameCard (){return this.cardFormGroup.get ('firstName')}
  get lastnameCard (){return this.cardFormGroup.get ('lastName')}
  get numberCard (){return this.cardFormGroup.get ('nTarjeta')}
  get fechaVencimientoCard (){return this.cardFormGroup.get ('fechaVencimiento')}
  
  formGroupEmail=new FormGroup({
    email: new FormControl ('', [Validators.email, Validators.required])
  });
  formGroupFirstName = new FormGroup ({
    firstname:new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras()])
  });
  formGroupLastName = new FormGroup ({
    lastname: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras()])
  });
  formGroupDNI = new FormGroup ({
    dni: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloNumeros])
  });
  formGroupAddress = new FormGroup ({
    address: new FormControl ('', [Validators.required])
  });

  get email_fc() { return this.formGroupEmail.get('email'); }
  get firstname_fc () { return this.formGroupFirstName.get('firstname') }
  get lastname_fc () { return this.formGroupLastName.get('lastname') }
  get dni_fc () { return this.formGroupDNI.get ('dni') }
  get address_fc () { return this.formGroupAddress.get ('address') }

  isEditingFirstName = false;
  isEditingLastName = false;
  isEditingDni = false;
  isEditingEmail = false;
  isEditingAddress = false;

  showErrors = false;
  resultFirstName: string = ''
  resultLastName: string = ''
  resultEmail: string = ''
  resultDNI: string = ''
  resultAddress: string = ''
  
  constructor(private userService: UserService, private adminService: AdminService) {}

  isLoggedIn: Boolean | null = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    if (this.userService.storedUser && this.userService.storedAdmin == null)
    {
      this.userService.usuarioActual$.subscribe(async (usuario: User | null) => {
        this.usuarioActual = usuario;
        console.log ("USUARIO ACTUAL: ", this.usuarioActual)
    
        // Verificar si es un usuario regular
        await this.userService.loadUsersFromJSON();
        const isUser = this.userService.getUsers().some((user) => user.email === this.usuarioActual?.email);

        console.log ("isUser: ", isUser)
        if (isUser) {
          this.isAdmin = false;
          this.cargarDatosUsuario();
        }
      });
    }
    else if (this.userService.storedUser == null && this.userService.storedAdmin)
    {
      console.log ("ADMIN ACTUAL STORED ADMIN: ", this.userService.storedAdmin)
      this.userService.adminActual$.subscribe (async () =>
      {
        this.adminActual = this.userService.storedAdmin
        console.log ("ADMIN ACTUAL: ", this.adminActual)

        // Verificar si es un administrador
        await this.adminService.loadAdminsFromJSON();
        const isAdmin = this.adminService.getAdmins().some((admin) => admin.email === this.adminActual?.email);

        console.log ("isAdmin: ", isAdmin)
        this.isAdmin = isAdmin;

        if (isAdmin) {
          this.cargarDatosAdmin();
        }
      });
    }
  
    // Verificar estado de sesión
    this.userService.isLoggedIn$.subscribe((isLoggedIn: Boolean | null) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  
  cargarDatosUsuario() {
    this.formGroupEmail.get('email')?.setValue(this.usuarioActual!.email);
    this.formGroupFirstName.get('firstname')?.setValue(this.usuarioActual!.firstName);
    this.formGroupLastName.get('lastname')?.setValue(this.usuarioActual!.lastName);
    this.formGroupAddress.get('address')?.setValue(this.usuarioActual!.address);
    this.formGroupDNI.get('dni')?.setValue(this.usuarioActual!.dni);
    this.getLastFourDigits();
    if (this.usuarioActual!.tarjeta?.firstName && this.usuarioActual!.tarjeta?.lastName) {
      this.cardExists = true;
    }
  }
  
  cargarDatosAdmin() {
    this.formGroupEmail.get('email')?.setValue(this.adminActual!.email);
    this.formGroupFirstName.get('firstname')?.setValue(this.adminActual!.firstName);
    this.formGroupLastName.get('lastname')?.setValue(this.adminActual!.lastName);
  }
  

  openLogoutModal() {
    this.isLogoutModalVisible = true;
  }

  closeLogoutModal() {
    this.isLogoutModalVisible = false;
  }

  toggleEditFirstame() {
    this.isEditingFirstName = !this.isEditingFirstName;
    if (this.usuarioActual)
      this.formGroupFirstName.get('firstname')?.setValue (this.usuarioActual.firstName);
  }

  toggleEditLastName (){
    this.isEditingLastName = !this.isEditingLastName;
    if (this.usuarioActual)
      this.formGroupLastName.get('lastname')?.setValue (this.usuarioActual.lastName);
  }

  toggleEditDni() {
    this.isEditingDni = !this.isEditingDni;
    if (this.usuarioActual)
      this.formGroupDNI.get('dni')?.setValue (this.usuarioActual.dni);
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
    if (this.usuarioActual)
      this.formGroupEmail.get('email')?.setValue(this.usuarioActual.email); // Resetear valor al original si se vuelve a editar
  }

  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
    if (this.usuarioActual)
      this.formGroupAddress.get('address')?.setValue (this.usuarioActual.address);
  }

  cancelEdit() {
    this.isEditingFirstName = false;
    this.isEditingLastName = false;
    this.isEditingDni = false;
    this.isEditingAddress = false;
    this.isEditingEmail = false;
    if (this.usuarioActual){
      this.formGroupFirstName.reset ({firstname: this.usuarioActual.firstName});
      this.formGroupFirstName.markAsUntouched();
      this.formGroupLastName.reset ({lastname: this.usuarioActual.lastName});
      this.formGroupLastName.markAsUntouched();
      this.formGroupDNI.reset ({dni: this.usuarioActual.dni});
      this.formGroupDNI.markAsUntouched();
      this.formGroupAddress.reset ({address: this.usuarioActual.address});
      this.formGroupAddress.markAsUntouched();
      this.formGroupEmail.reset({ email: this.usuarioActual.email });
      this.formGroupEmail.markAsUntouched();
    }
  }

  private async processEmailChangeRequest (){
    if (this.formGroupEmail.valid) {
      const newEmail = this.formGroupEmail.value.email;
      if (this.usuarioActual && newEmail !== this.usuarioActual.email) {
        try {
          const resultado = await this.userService.changeEmail(this.usuarioActual as User, newEmail as string);
          if (resultado.success) {
            this.resultEmail = 'Email cambiado con éxito';
          } else {
            this.resultEmail = 'Error al cambiar el email';
          }
        } catch (error) {
          this.resultEmail = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingEmail = false; // Salimos del modo de edición
    } else {
      this.resultEmail = 'Por favor, ingresa un email válido.';
    }
    setTimeout(() => {
      this.resultEmail = '';
    }, 2000);
  }

  async processFirstNameChangeRequest (){
    if (this.formGroupFirstName.valid) {
      const newFirstName = this.formGroupFirstName.value.firstname;
      if (this.usuarioActual && newFirstName !== this.usuarioActual.firstName) {
        try {
          const resultado = await this.userService.changeFirstName(this.usuarioActual as User, newFirstName as string);
          if (resultado.success) {
            this.resultFirstName = 'Nombre cambiado con éxito';
          } else {
            this.resultFirstName = 'Error al cambiar el nombre';
          }
        } catch (error) {
          this.resultFirstName = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingFirstName = false; // Salimos del modo de edición
    } else {
      this.resultFirstName = 'Por favor, ingresa un nombre válido.';
    }
    setTimeout(() => {
      this.resultFirstName = '';
    }, 2000);
  }

  async processLastNameChangeRequest (){
    if (this.formGroupLastName.valid) {
      const newLastName = this.formGroupLastName.value.lastname;
      if (this.usuarioActual && newLastName !== this.usuarioActual.lastName) {
        try {
          const resultado = await this.userService.changeLastName(this.usuarioActual as User, newLastName as string);
          if (resultado.success) {
            this.resultLastName = 'Apellido cambiado con éxito';
          } else {
            this.resultLastName = 'Error al cambiar el apellido';
          }
        } catch (error) {
          this.resultLastName = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingLastName = false;
    } else {
      this.resultLastName = 'Por favor, ingresa un apellido válido.';
    }
    setTimeout(() => {
      this.resultLastName = '';
    }, 2000);
  }

  async processDNIChangeRequest (){
    if (this.formGroupDNI.valid) {
      const newDNI = this.formGroupDNI.value.dni;
      if (this.usuarioActual && newDNI !== this.usuarioActual.dni) {
        try {
          const resultado = await this.userService.changeDNI(this.usuarioActual as User, newDNI as string);
          if (resultado.success) {
            this.resultDNI = 'DNI cambiado con éxito';
          } else {
            this.resultDNI = 'Error al cambiar el DNI';
          }
        } catch (error) {
          this.resultDNI = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingDni = false;
    } else {
      this.resultDNI = 'Por favor, ingresa un DNI válido.';
    }
    setTimeout(() => {
      this.resultDNI = '';
    }, 2000);
  }

  async processAddressChangeRequest (){
    if (this.formGroupAddress.valid) {
      const newAddress = this.formGroupAddress.value.address;
      if (this.usuarioActual && newAddress !== this.usuarioActual.address) {
        try {
          const resultado = await this.userService.changeAddress(this.usuarioActual as User, newAddress as string);
          if (resultado.success) {
            this.resultAddress = 'Direccion cambiada con éxito';
          } else {
            this.resultAddress = 'Error al cambiar la direccion';
          }
        } catch (error) {
          this.resultAddress = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingAddress = false;
    } else {
      this.resultAddress = 'Por favor, ingresa un DNI válido.';
    }
    setTimeout(() => {
      this.resultAddress = '';
    }, 2000);
  }

  async confirmChangeFirstName (){
    await this.processFirstNameChangeRequest ()
  }

  async confirmChangeDNI (){
    await this.processDNIChangeRequest ()
  }

  async confirmChangeAddress (){
    await this.processAddressChangeRequest ()
  }

  async confirmChangeLastName (){
    await this.processLastNameChangeRequest ()
  }

  async confirmChangeEmail (){
    await this.processEmailChangeRequest()
  }

  logout(){
    this.userService.logout();
  }

  getLastFourDigits (){
    if (this.usuarioActual){
      this.lastFourDigits = this.usuarioActual.tarjeta.nTarjeta.substring(this.usuarioActual.tarjeta.nTarjeta.length - 4);
    }
  }

  async deleteCard(){
    try{
      await this.userService.deleteCard (this.usuarioActual);
      this.cardExists = false;
      alert ('Tarjeta eliminada correctamente')
    }catch (error){
      console.error (error)
      alert (error)
    }
  }

  showFormAddCard(){
    this.formAddCard = !this.formAddCard;
  }

  hideFormAddCard(){
    this.formAddCard = !this.formAddCard;
  }

  toggleFormPassword(){
    this.showFormularioPassword = !this.showFormularioPassword;
  }

  closeFormPassword() {
    this.showFormularioPassword = false;
  }

  allowEditCard (){
    this.permitirEditarTarjeta = true;
    this.showOptionButtonsToCard = false;
  }

  dontAllowEditCard (){
    this.permitirEditarTarjeta = false;
    this.showOptionButtonsToCard = true;
  }

  setFormControlDefaultCardValues (){
    this.firstnameCard?.setValue (this.usuarioActual?.tarjeta.firstName as string)
    this.lastnameCard?.setValue (this.usuarioActual?.tarjeta.lastName as string)
    this.numberCard?.setValue (this.usuarioActual?.tarjeta.nTarjeta as string)
    this.fechaVencimientoCard?.setValue (this.usuarioActual?.tarjeta.fechaVencimiento as string)
  }

  resetCardValues (){
    this.setFormControlDefaultCardValues ()
    this.cardFormGroup.markAsUntouched();
  }
  
  openOptionsEditCard (){
    this.activeOptionsEditCard = true;
  }
  
  closeOptionsEditCard (){
    this.activeOptionsEditCard = false;
  }

  verifyPassword(){
    if (this.passwordToEdit === this.usuarioActual?.password){
      this.closeFormPassword();
      this.allowEditCard ();
      this.openOptionsEditCard ();
      this.setFormControlDefaultCardValues ();
    }
    else{
      this.resultInputPassword = 'Las contraseñas no coinciden';
    }
  }

  cancelEditCard(){
    this.dontAllowEditCard ();
    this.closeOptionsEditCard ();
    this.resetCardValues ();
    this.showOptionButtonsToCard = true;
    this.resultEditCard = '';
  }

  async confirmEditCard(){
    if (this.cardFormGroup.valid){
      const newCard = new Tarjeta ({
        firstName: this.firstnameCard?.value ?? '', 
        lastName:this.lastnameCard?.value ?? '', 
        nTarjeta:this.numberCard?.value ?? '', 
        fechaVencimiento:this.fechaVencimientoCard?.value ?? ''
      })
      try{
        const resultado = await this.userService.changeDataCard (this.usuarioActual, newCard);
        if (resultado.success)
          this.resultEditCard = 'Tarjeta cambiada correctamente'
        else
          this.resultEditCard = 'Error al procesar el cambio de los datos de la tarjeta'
        this.dontAllowEditCard ();
        this.closeOptionsEditCard ();
        this.getLastFourDigits ();
        setTimeout(() => {
          this.resultEditCard = '';
        }, 2000);
      }catch (err){
        console.error (err)
      }
    }else
      this.resultEditCard = 'Por favor, revise los campos de la tarjeta'
  }
}
