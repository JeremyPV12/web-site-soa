import { Component } from '@angular/core';
import { FibertelService } from '../../../shared/services/fibertel.service';
import { MainService } from '../../../shared/services/service.service';

@Component({
  selector: 'app-main-page-client',
  imports: [],
  templateUrl: './main-page-client.component.html',
  styleUrl: './main-page-client.component.css'
})
export class MainPageClientComponent {

  constructor(
    private mainService: MainService
  ){}
  ngOnInit(){
    this.ObtenerListadoProductos();
  }

  ObtenerListadoProductos(){
    this.mainService.obtenerListadoProductos().subscribe((data:any)=>{
      console.log(data.content);
    })
  }
}
