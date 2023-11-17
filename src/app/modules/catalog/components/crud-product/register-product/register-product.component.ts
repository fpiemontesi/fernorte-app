import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage/storage.service';
import {productService} from "../../../services/productService/product.service";
import {Producto} from "../../../models/producto";
import {Subscription} from "rxjs";
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoryService/categoria.service';
import { Marca } from '../../../models/marca';
import { ServiceMarcaService } from '../../../services/brandService/service-marca.service';
import { ProductoPreCarga } from "../../../models/productoPreCarga";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fn-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.css']
})
export class RegisterProductComponent implements OnInit, OnDestroy {
  categoriesCodigo: String[] = []
  categorias: Categoria[] = []
  productsInactives: Producto[] = []
  categoriesNombre: String[] = []
  prodPreCarga: ProductoPreCarga = {} as ProductoPreCarga;
  allModels:Producto[]=[];
  marcas: Marca[] = [];
  codeProductSelected = "";
  title = 'Modificar Producto';
  model:Producto = {} as Producto;
  codigo = "";
  flag = false;
  private subscription = new Subscription();

    constructor(
      private storageService: StorageService, 
      private httpClientService:productService, 
      private httpClientCategoria: CategoriaService,
      private htppBrand: ServiceMarcaService,
      private router: Router,
      private activedRoute: ActivatedRoute
      ) { }

      

    ngOnInit(): void {
     

      //TODO: get params from url
      this.subscription.add(
        this.activedRoute.queryParams.subscribe(params => {
          this.codigo = params["codigo"];
          this.title = params["title"];
          if(this.codigo == null || undefined){
            this.cargarDatos();
            this.title = "Modificar Producto";
          }
          console.log(this.codigo);
           if(this.codigo != null || undefined){
            this.subscription.add(
             this.httpClientService.getProductByCode(this.codigo).subscribe(
              {
                next: (response:Producto)=>{
                  this.productsInactives = [];
                  this.model=response;
                  this.productsInactives.push(this.model);
                  if(this.productsInactives[0].codigo == null || undefined){
                    console.log("No existe el producto");
                    this.router.navigate(["/listProducts"]);                 
                  }
                
                  console.log(this.productsInactives);
                },
                error: (error:any)=>{
                  console.log(error);
                },
                complete:()=>{
                  console.log("Petición realizada");
                }

              }
             )
            )

           }
        }),
      )


      

      this.subscription.add(
        this.httpClientService.getAllProducts().subscribe(
          (response:Producto[])=>{
            this.allModels=response;
            }
        )
      )


      this.subscription.add(
        this.httpClientCategoria.get().subscribe(
          (response:Categoria[])=>{
            this.categorias=response;
            }
        )
      )

      this.subscription.add(
        this.htppBrand.get().subscribe(
          (response:Marca[])=>{
            this.marcas=response;
            }
        )
      )
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

  getModelByCode(){
    this.subscription.add(
      this.httpClientService.getProductByCode(this.codeProductSelected).subscribe(
        (response:Producto)=>{
          this.model=response;
        }
      )
    )
  }

    formArticle = new FormGroup({
      codigo_marca: new FormControl('', [Validators.required]),
      categorias_id: new FormControl('', [Validators.required, Validators.nullValidator]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      dimensiones: new FormControl("", [Validators.required]), // Inicializado en 0 como número
      peso: new FormControl("", [Validators.required]), // Inicializado en 0 como número
      color: new FormControl('', [Validators.required]),
      material: new FormControl('', [Validators.required]),
      pais: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required]),
    });






    addElement(){
      if(this.formArticle.value.categorias_id != ("" || null || undefined)){
        
        for(let i = 0; i < this.categoriesCodigo.length; i++){
          if(this.categoriesCodigo[i] == this.formArticle.value.categorias_id){
            alert("Ya se ha agregado esta categoría");
            return;
          }
        }
        this.categoriesCodigo.push(this.formArticle.value.categorias_id);
        this.categoriesNombre.push(this.categorias.find(categoria => categoria.codigo == this.formArticle.value.categorias_id)?.nombre || "");
      }
    }

   
    removeCategory(index: number){
      this.categoriesNombre.splice(index, 1);
      this.categoriesCodigo.splice(index, 1);
    }


    onSubmit() {  
      if(this.formArticle.valid){
        this.prodPreCarga = {
          activo: true,
          codigo_categorias: this.categoriesCodigo as string[],
          codigo_marca: this.formArticle.value.codigo_marca || "",
          paisOrigen: this.formArticle.value.pais || "", 
          color: this.formArticle.value.color || "",
          material: this.formArticle.value.material || "",
          peso: this.formArticle.value.peso || "",
          dimensiones: this.formArticle.value.dimensiones || "",
          imageURL: this.formArticle.value.imageURL || "",
          precio_compra: 0,
          descripcion: this.formArticle.value.descripcion || "",
        }
  
        let flag = false;
  
        //TODO: add alert of success
        this.subscription.add(
          this.httpClientService.updateProduct(this.productsInactives[0].codigo, this.prodPreCarga ).subscribe(
            (response:Producto)=>{
              this.model=response;
              alert("Producto creado");
              flag = true;
              this.formArticle.reset();
              this.categoriesCodigo = [];
              this.categoriesNombre = [];
              this.cargarDatos();
              
            }
          )
        )
       
      }else{
        alert("Rellene todos los campos");
      }
    }

    cargarDatos(){
      this.subscription.add(
        this.httpClientService.getProductsInactives().subscribe({
          next: (response:Producto[])=>{
            console.log(response);
            this.productsInactives=response;
            },
            error: (error:any)=>{
              console.log(error);
            },
            complete:()=>{
              console.log("Petición realizada");
            }
        }     
        )
      )
    }


    resetFields(){
      alert("SUCCESS");
    }

    readPhoto(event:any){
      const archivoCapturado = event.target.files[0];
      if (archivoCapturado instanceof Blob) {
        let reader = new FileReader();
        reader.readAsDataURL(archivoCapturado);
        reader.onloadend = async () => {
          const imagen = reader.result;
          this.formArticle.value.imageURL = await this.storageService.subirImagen(archivoCapturado);
        };
      }
      else {
        this.formArticle.value.imageURL = "";
      }
    }
}

