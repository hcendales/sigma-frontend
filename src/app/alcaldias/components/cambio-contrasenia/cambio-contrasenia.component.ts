import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { SecurityService } from '../../../core/security/services/security.service';


@Component({
  selector: 'app-cambio-contrasenia',
  templateUrl: './cambio-contrasenia.component.html',
  styleUrls: ['./cambio-contrasenia.component.scss']
})
export class CambioContraseniaComponent implements OnInit {

  formGroup: FormGroup;
  get newPassword() { return this.formGroup.get('newPassword'); }
  get confirmNewPassword() { return this.formGroup.get('confirmNewPassword'); }
  get actualPassword() { return this.formGroup.get('actualPassword'); }
  nombreUsuario: String = ''
  enProceso:boolean = false;
  msjRes: String = '';
  tipoMsj: String = '';

  public samePasswordsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.get('newPassword')?.value == control.get('confirmNewPassword')?.value){
        return null;
      }else{
        return {clavesNoCoinciden: true};
      }
    }
  };

  public notOldPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.get('newPassword')?.value == control.get('actualPassword')?.value){
        return {igualActualPass: true};
      }else{
        return null;
      }
    }
  };

  

  constructor(private securityService:SecurityService, private formBuilder: FormBuilder) {
    this.enProceso = false; 
    this.formGroup = formBuilder.group({
      actualPassword: (['',[Validators.required]]),
      newPassword: (['',[Validators.required,Validators.minLength(6)]]),
      confirmNewPassword: (['',[Validators.required]])
    });
    this.formGroup.setValidators([this.samePasswordsValidator(),this.notOldPasswordValidator()]);
  }

  ngOnInit(): void {
    this.nombreUsuario = this.securityService.userSession.login;
  }

  submit(){
    
  }

  

}
