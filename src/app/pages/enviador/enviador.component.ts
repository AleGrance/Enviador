import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-enviador',
  templateUrl: './enviador.component.html',
  styleUrls: ['./enviador.component.css'],
})
export class EnviadorComponent implements OnInit {
  title = 'enviador';
  clientesWa: any[] = [];
  clientesLong = 0;
  mensajeWa = '';
  btnEnviar = '';
  urlWa = '';
  nombreCliente = '';
  numeroCliente = '';
  index = 0;
  objWa = {
    message: '',
    phone: '',
  };

  // Para la imagen
  error = '';
  imageError = '';
  fileInput = '';
  uploadedImageBase64: string = '';

  constructor(private api: ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Escribir mensaje y cargar el texto en una variable. Concatenar esa variable con la URL que se va abrir
  onChangeTextArea(e: any) {
    this.mensajeWa = (<HTMLInputElement>(
      document.getElementById('mensajeEscrito')
    )).value;

    this.objWa.message = this.mensajeWa;
  }

  // Al seleccionar el archivo Excel
  handleImport($event: any) {
    this.index = 0;
    this.clientesWa = [];
    this.nombreCliente = '';

    // Se muestra el btn Enviar mensaje recien al cargar el archivo Excel
    //(<HTMLInputElement>document.getElementById('btnEnviar')).innerHTML = this.btnEnviar;

    const files = $event.target.files;

    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = XLSX.read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.clientesWa = rows;
          console.log(this.clientesWa);

          for (let i = 0; i < this.clientesWa.length; i++) {
            if (i === this.index) {
              //console.log(this.clientesWa[this.index]);
              this.nombreCliente = this.clientesWa[this.index].NOMBRE;
              this.numeroCliente = this.clientesWa[this.index].NRO_CEL;
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Envia el mensaje uno por uno -- UNO POR UNO
  enviarMensaje() {
    // Si no hay archivo seleccionado se muestra el mensaje de alerta
    if (this.clientesWa.length === 0) {
      this.toastr.error('Seleccionar un archivo!' + this.nombreCliente);
      return;
    }

    if (this.index > this.clientesWa.length - 1) {
      window.alert('Ya se envio a todos los de la lista!');
      return;
    }

    this.objWa.message = this.mensajeWa;
    this.objWa.phone = this.numeroCliente;

    this.api.post('lead', this.objWa).subscribe(
      (result) => {
        //Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Mensaje enviado a: ' + this.nombreCliente);
          this.index += 1;
          this.recorrerArray();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
        console.log('La respuesta de la api: ', result);
      },
      (error) => {
        console.log('Si hay error en el post: ', error);
      }
    );

    console.log('Lo que se envia a la api: ', this.objWa);
  }

  // Recorre el array de clientes y muestra el siguiente contacto a enviar -- UNO POR UNO
  recorrerArray() {
    for (let i = 0; i < this.clientesWa.length; i++) {
      if (i === this.index) {
        this.numeroCliente = this.clientesWa[i].NRO_CEL;
        this.nombreCliente = this.clientesWa[i].NOMBRE;
      }
    }
  }

  // Envia el mensaje a todos lo de la lista cada 5 seg -- MASIVO CONTINUO
  enviarTodos() {
    (<HTMLInputElement>(
      document.getElementById('btnEnviarTodos')
    )).style.pointerEvents = "none";

    if (this.index > this.clientesWa.length - 1) {
      this.toastr.warning('Ya se envio a todos los de la lista!');
      return;
    }

    for (let i = 0; i < this.clientesWa.length; i++) {
      if (i === this.index) {
        this.objWa.phone = this.clientesWa[i].NRO_CEL;
        this.nombreCliente = this.clientesWa[i].NOMBRE;
        this.envioRetrasado(this.objWa);
      }
    }
  }

  // Funcion que retrasa el envio -- MASIVO CONTINUO
  envioRetrasado(param: any) {
    setTimeout(() => {
      this.api.post('lead', this.objWa).subscribe(
        (result) => {
          //Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
          if (typeof result === 'object') {
            this.toastr.success('Mensaje enviado a: ' + this.nombreCliente);
            console.log('Lo que se envia a la API: ', param);
            this.index += 1;
            this.enviarTodos();
          } else {
            console.log('result post: ', result);
            this.toastr.warning(result);
          }
          console.log('La respuesta de la api: ', result);
        },
        (error) => {
          console.log('Si hay error en el post: ', error);
        }
      );
    }, 5000);
  }

  //Cargar imagen
  // handleImageUpload(fileToUpload: any) {
  //   // check for image to upload
  //   // this checks if the user has uploaded any file
  //   if (fileToUpload.target.files && fileToUpload.target.files[0]) {
  //     // calculate your image sizes allowed for upload
  //     const max_size = 20971510;
  //     // the only MIME types allowed
  //     const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
  //     // max image height allowed
  //     const max_height = 14200;
  //     //max image width allowed
  //     const max_width = 15600;

  //     // check the file uploaded by the user
  //     if (fileToUpload.target.files[0].size > max_size) {
  //       //show error
  //       this.error = 'max image size allowed is ' + max_size / 1000 + 'Mb';
  //       //show an error alert using the Toastr service.
  //       this.toastr.error(this.imageError,'Error');
  //       return false;
  //     }
  //     // check for allowable types
  //     // if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
  //     //   // define the error message due to wrong MIME type
  //     //   let error = 'The allowed images are: ( JPEG | JPG | PNG )';
  //     //   // show an error alert for MIME
  //     //   this.toastrService.error(error,'Error');
  //     //   //return false since the MIME type is wrong
  //     //   return false;
  //     // }
  //     // define a file reader constant
  //     const reader = new FileReader();
  //     // read the file on load
  //     reader.onload = (e: any) => {
  //       // create an instance of the Image()
  //       const image = new Image();
  //       // get the image source
  //       image.src = e.target.result;
  //       // @ts-ignore
  //       // image.onload = rs => {
  //       //   // get the image height read
  //       //   const img_height = rs.currentTarget['height'];
  //       //   // get the image width read
  //       //   const img_width = rs.currentTarget['width'];
  //       //   // check if the dimensions meet the required height and width
  //       //   if (img_height > max_height && img_width > max_width) {
  //       //     // throw error due to unmatched dimensions
  //       //     this.error =
  //       //       'Maximum dimensions allowed: ' +
  //       //       max_height +
  //       //       '*' +
  //       //       max_width +
  //       //       'px';
  //       //     return false;
  //       //   } else {
  //       //     // otherise get the base64 image
  //       //     this.uploadedImageBase64 = e.target.result;

  //       //   }
  //       // };
  //     };
  //     // reader as data url
  //     reader.readAsDataURL(fileToUpload.target.files[0]);
  //   }
  // }
}
