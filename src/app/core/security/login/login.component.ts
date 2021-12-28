import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  public form: FormGroup;
  private retUrl:any = null; 
  public disabledBtn_Login:boolean = false;
  public hide:boolean = true;
  public validacion:boolean = false;

  constructor(public formBuilder: FormBuilder, public router: Router, private securityService: SecurityService, private snackBar:MatSnackBar, private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.retUrl = params['retUrl'];
    });
  }

  public async onSubmit(values: Object) {
    if (this.form.valid) {
      this.validacion = true;
      const result = await this.securityService.login(values);
      this.validacion = false;
      if(result.sucess){
        this.router.navigate([this.retUrl?this.retUrl:'dashboard']);
      }else{
        this.snackBar.open(result.msj?result.msj:'Error interno', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    }else{
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
    
  }

}
