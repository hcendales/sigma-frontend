import { Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-registro-foto',
  templateUrl: './registro-foto.component.html',
  styleUrls: ['./registro-foto.component.scss']
})
export class RegistroFotoComponent implements OnInit {

  @ViewChild('inputFoto') inputFoto:any;

  public urlFoto:string = '';
  public anteriorValor:any;

  public formFoto: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    this.anteriorValor = data.form.value;
    this.formFoto = data.form;
    this.setUrlFoto();
    
    
  }

  ngOnInit(): void {
  }

  clickCambioFoto(){
    this.inputFoto.nativeElement.click()
  }

  onFotoChanged(event:any){
    const reader: FileReader = new FileReader();
    const fileInfo = event.target.files[0]
    reader.readAsDataURL(fileInfo);
    console.log(fileInfo);
    reader.onload = (e) => {
      this.formFoto.get('url')?.setValue(reader.result?.toString());
      this.formFoto.get('fileInfo')?.setValue(fileInfo);
      this.setUrlFoto();
    }
  }

  setUrlFoto(){
    if(this.formFoto.get('url')?.value.startsWith('data:'))
    {
      this.urlFoto = this.formFoto.get('url')?.value;
    }else{
      this.urlFoto = this.data.urlFotos + this.formFoto.get('url')?.value;
    }
  }

}
