import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent {
 productoform: FormGroup;
 titulo = "Crear producto";
 id: string | null;
 constructor(private fb: FormBuilder,
             private router: Router,
             private toastr: ToastrService,
             private _productoService: ProductoService,
             private aRouter: ActivatedRoute){
  this.productoform = this.fb.group({
    producto:['', Validators.required],
    categoria:['', Validators.required],
    ubicacion:['', Validators.required],
    precio:['', Validators.required],
  })
  this.id = this.aRouter.snapshot.paramMap.get("id");
 }

 ngOnInit() {
  this.esEditar();
 }

 agregarProducto(){
  console.log(this.productoform);
  console.log(this.productoform.get('producto')?.value);
  
  const PRODUCTO: Producto ={
    nombre: this.productoform.get('producto')?.value,
    categoria: this.productoform.get('categoria')?.value,
    ubicacion: this.productoform.get('ubicacion')?.value,
    precio: this.productoform.get('precio')?.value,
  }

  if(this.id !== null){
    //editamos producto
    this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data =>{
    this.toastr.info('El producto fue actualizado con exito!', 'Producto actualizado!');
    this.router.navigate(['/']); 
    }, error => {
      console.log(error);
      this.productoform.reset();
    })
  }else{
    //agregamos producto
    console.log(PRODUCTO);
    this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
    this.toastr.success('El producto fue registrado con exito!', 'Producto registrado!');
    this.router.navigate(['/']);
    }, error => {
      console.log(error);
      this.productoform.reset();
    })
  }
 }

 esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe( data =>{
        this.productoform.setValue({
          producto:data.nombre,
          categoria:data.categoria,
          ubicacion:data.ubicacion,
          precio:data.precio,
        })
      })
    }
 }

}
