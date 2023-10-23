import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import {HttpClientService} from "../../services/httpClient/http-client.service";
import {Producto} from "../../models/producto";

@Component({
  selector: 'fn-register-article',
  templateUrl: './register-article.component.html',
  styleUrls: ['./register-article.component.css']
})
export class RegisterArticleComponent implements OnInit {

  private models = {};
  imagenURL:string = "";
  categories: String[] = [
  ]
  allModels:Producto[]=[];
  modelSelected:string = "";
  model:Producto | undefined;
    constructor(private storageService: StorageService, private httpClientService:HttpClientService) { }
    ngOnInit(): void {
      this.httpClientService.getAllModels().subscribe(
        (response:Producto[])=>{
          this.allModels=response;
          }
      );
    }

  getModelById(){
    this.httpClientService.getModelById(this.modelSelected).subscribe(
      (response:Producto)=>{
        this.model=response;
      }
    )
  }

    formArticle = new FormGroup({
      nombre: new FormControl('', [Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9 ]+$')
      ]), //validacion que no acepte caracteres especiales


      descripcion: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      marca: new FormControl('', [Validators.required]),
      minorista: new FormControl(null, [Validators.required]),
      mayorista: new FormControl(null, [Validators.required]), // Inicializado en 0 como número
      dimensiones: new FormControl(null, [Validators.required]), // Inicializado en 0 como número
      peso: new FormControl(null, [Validators.required]), // Inicializado en 0 como número
      color: new FormControl('', [Validators.required]),
      material: new FormControl('', [Validators.required]),
      pais: new FormControl('', [Validators.required]),
      categorias: new FormControl('', [Validators.required]),
    });





    addElement(){
      if(this.formArticle.value.categorias != 'Abrir Menu' && this.formArticle.value.categorias != null){
        for(let i = 0; i < this.categories.length; i++){
          if(this.categories[i] == this.formArticle.value.categorias){
            return;
          }
        }
        this.categories.push(this.formArticle.value.categorias);
      }
    }


    removeCategory(categories: any){
      this.categories.splice(this.categories.indexOf(categories), 1);
    }


    onSubmit() {
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.formArticle.value, null, 4));
    }

    resetFields(){
      alert("SUCCESS");
    }

    readPhoto(event:any){
      const archivoCapturado = event.target.files[0];
      if (archivoCapturado instanceof Blob) {
        let reader = new FileReader();
        reader.readAsDataURL(archivoCapturado);
        reader.onloadend = () => {
          const imagen = reader.result;
          this.imagenURL = imagen as string;
          this.storageService.subirImagen(archivoCapturado);
        };
      } else {
        this.imagenURL = "";
      }
  }
}
