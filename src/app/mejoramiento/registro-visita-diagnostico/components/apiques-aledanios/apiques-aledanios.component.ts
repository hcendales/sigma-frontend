import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { GestionService } from '../../../../core/services/gestion.service';
import { EntityTabAledanioService } from '../../../../core/services/entity-tab-aledanio.service';
import { EntityTabApiqueService } from '../../../../core/services/entity-tab-apique.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs'


@Component({
  selector: 'app-apiques-aledanios',
  templateUrl: './apiques-aledanios.component.html',
  styleUrls: ['./apiques-aledanios.component.scss']
})
export class ApiquesAledaniosComponent implements OnInit {

  public dataSource: any[] = [
    
  ];

  public listaPks: any[] = [];

  public listaMostrarPks: any[] = [];

  displayedColumns: string[] = ['pkIdCalzada','opciones'];
  
  public formEntity: FormGroup;

  public enProgreso: boolean = false;

  public pkPrevSelect:any[] = [];

  public pksEvtConApiques:any[] = [];

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ApiquesAledaniosComponent>, private gestionService:GestionService, private entityTabAledanioService:EntityTabAledanioService, private entityTabApiqueService:EntityTabApiqueService, private matSnackBar:MatSnackBar) {
    this.formEntity = this.fb.group({
      requiere_apiques: ['',[Validators.required]],
    });
    
    this.pkPrevSelect = data.pksAledanios.map((x:any) => {return {pkIdCalzada:x.pk_id_calzada_aledanio,idMantenimientoVialEvento:x.id_mv_evento_aledanio,idPredisenioAledanio:x.id_predisenio_aledanio}});
    this.dataSource = [...this.pkPrevSelect];
  }

  async ngOnInit() {
    //pks que estén en la actividad
    let resp:any = await this.gestionService.listarBandejaGestionPendiente(13); 
    //pks que ya estén como aledaños del pk que se esta trabajando
   // let resp2:any = await this.entityTabAledanioService.consultarXFiltro('ID_MANTENIMIENTO_VIAL_EVENTO = '+this.data.idMantenimientoVialEvento);
    
    
/*
    if(resp2.codError == 0){
      console.log(resp2.respuesta);
      this.pkPrevSelect = resp2.respuesta.map((x:any) => {return {pkIdCalzada:x.pk_id_calzada_aledanio,idMantenimientoVialEvento:x.id_mv_evento_aledanio,idPredisenioAledanio:x.id_predisenio_aledanio}});
      this.dataSource = [...this.pkPrevSelect];
    }
*/
    //remueve de la lista de pks los que ya tengan apiques (un aíque aledaño no puede tener apiques)
    if(resp.codError == 0){
      this.listaPks = resp.respuesta.filter((x:any) => {return x.id_mantenimiento_vial_evento != this.data.idMantenimientoVialEvento}).map((x:any) => {return {pkIdCalzada:x.pk_id_calzada, idMantenimientoVialEvento:x.id_mantenimiento_vial_evento}});

      this.pksEvtConApiques = await this.getListaPksApiques(this.listaPks.map((x:any)=>x.idMantenimientoVialEvento));

      console.log('EL datasource', this.dataSource);
      console.log('Los pks con apiques', this.pksEvtConApiques);
      for(let pkEvt of this.pksEvtConApiques){
        let index = this.listaPks.find((x:any)=> x.idMantenimientoVialEvento == pkEvt);
        if(index != -1){
          this.listaPks.splice(index,1);
        }
      }
      
    //remueve de la lista de pks, los pks que ya se esten registrados como aledaños
      for(let pk of this.dataSource){
        let index = this.listaPks.findIndex((x:any) => x.idMantenimientoVialEvento == pk.idMantenimientoVialEvento);
        if(index != -1){
          console.log('SPLIIIIICE');
          this.listaPks.splice(index,1)
        }
      }
  
      this.listaMostrarPks = [...this.listaPks];
      this.listaMostrarPks.sort((a:any,b:any) => (a.pkIdCalzada > b.pkIdCalzada) ? 1 : ((b?.pkIdCalzada > a.pkIdCalzada) ? -1 : 0));
    }
  }

  //agregar a a lista
  agregarPk(e:any){
    
    this.formEntity.get('requiere_apiques')?.setValue('null');
    this.dataSource.push(e.value);
    this.dataSource = [...this.dataSource];
    this.listaMostrarPks = this.listaMostrarPks.filter((x:any) => x.pkIdCalzada != e.value.pkIdCalzada);
    
  }

  //eliminar de la lista
  eliminarPK(e:any){
    this.formEntity.get('requiere_apiques')?.setValue('null');
    this.dataSource = this.dataSource.filter((x:any) => x.pkIdCalzada != e.pkIdCalzada);
    this.listaMostrarPks.push(e);
    this.listaMostrarPks.sort((a:any,b:any) => (a.pkIdCalzada > b.pkIdCalzada) ? 1 : ((b?.pkIdCalzada > a.pkIdCalzada) ? -1 : 0));
  }

  cerrar(){
    this.dialogRef.close();
  }

  async asociar(){
    this.enProgreso = true;

    //almacena los pks a aeliminar
    let arrayAEliminar = [];
    for(let pkEvt of this.pkPrevSelect){
      let index = this.dataSource.findIndex((x:any) => x.idMantenimientoVialEvento == pkEvt.idMantenimientoVialEvento);
      if(index == -1){
        arrayAEliminar.push(this.entityTabAledanioService.eliminar(pkEvt.idPredisenioAledanio));
      }
    }
    let arrayInsertar = [];
    for(let pk of this.dataSource){
      console.log('Prevselet',this.pkPrevSelect);
      console.log('datasource',this.dataSource);
      let index = this.pkPrevSelect.findIndex((x:any)=>x.idMantenimientoVialEvento == pk.idMantenimientoVialEvento);
      if(index == -1){
        arrayInsertar.push(this.entityTabAledanioService.insertar(this.data.idMantenimientoVialEvento,pk.pkIdCalzada,pk.idMantenimientoVialEvento));
      }
    }

    
    let resEliminar = [];
    if(arrayAEliminar.length > 0){
      resEliminar = await forkJoin(arrayAEliminar).toPromise();
    }

    
    let resInsertar = [];
    if(arrayInsertar.length > 0){
      resInsertar = await forkJoin(arrayInsertar).toPromise();
    }
    
    
    let respuestas:any[] = [...resEliminar,...resInsertar];
    for(let r of respuestas){
      if(r.codError != 0){
        this.matSnackBar.open('Error al momento de Guardar', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        console.error(r.msgError);
        this.enProgreso = false;
        this.cerrar();
        return;
      }
    }
    this.matSnackBar.open('Apiques aledaños guardados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });

    this.enProgreso = false;
    this.cerrar();
  }
  
  async getListaPksApiques(idsEvento:number[]){
    //se divide en arrays de a 999
    let idsWhere = [];
    let i,j, chunk = 999;
    for (i = 0,j = idsEvento.length; i < j; i += chunk) {
      idsWhere.push(idsEvento.slice(i, i + chunk).join());
    }
    
    let solicitudes = [];
    for(let where of idsWhere){
      solicitudes.push(this.entityTabApiqueService.list('id_mantenimiento_vial_evento in ('+where+')'));
    }
    let resp:any[] = await forkJoin(solicitudes).toPromise();
    let apiques = []
    for(let r of resp){
      if(r.codError != 0){
        console.error('Error al consultar apiques: ',r.msgError);
      }else{
        for(let apique of r.respuesta){
          apiques.push(apique);
        }
      }
    }

    let fo:any = {} as any;
    for(let apique of apiques){
      if(!fo[apique.id_mantenimiento_vial_evento]){
        fo[apique.id_mantenimiento_vial_evento] = true;
      }
    }
    //ids de los eventos que tienen apiques
    let idEventos = Object.keys(fo);
    return idEventos;
  }
}
