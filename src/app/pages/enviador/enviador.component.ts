import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { map, timeout } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-enviador',
  templateUrl: './enviador.component.html',
  styleUrls: ['./enviador.component.css'],
})
export class EnviadorComponent implements OnInit {
  // Nombre del archivo que se muestra en el html
  fileNameExcel = 'Subir un archivo XLS/XLSX...';

  // Para enviar el mensaje
  clientesWa: any[] = [];
  mensajeWa = '';
  nombreCliente = '';
  numeroCliente = '';
  index = 0;
  objWa = {
    message: '',
    phone: '',
    mimeType: '',
    data: '',
    fileName: '',
  };
  progressBarText = '';

  // Para el envio del adjunto
  error = '';
  fileInput: any;
  fileMimeTypeMedia = '';
  fileBase64Media: string = '';
  fileNameMedia = 'Subir un archivo JPG/PDF...';
  fileSizeMedia = 0;

  constructor(private api: ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Escribir mensaje y cargar el texto en una variable.
  onChangeTextArea(e: any) {
    this.mensajeWa = (<HTMLInputElement>(
      document.getElementById('mensajeEscrito')
    )).value;

    this.objWa.message = this.mensajeWa;
  }

  // Al seleccionar el archivo Excel
  handleXLSFile(event: any) {
    this.index = 0;
    this.clientesWa = [];
    this.nombreCliente = '';

    const files = event.target.files;

    // Se recorre el array que contiene el archivo y se obtiene el nombre del archivo para mostrar en el html
    for (let fi of files) {
      this.fileNameExcel = fi.name;
    }

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
          this.changeProgressBar(this.index);
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
    // Si no hay archivo seleccionado se muestra el mensaje de alerta
    if (this.clientesWa.length === 0) {
      this.toastr.error('Subir un archivo!');
      return;
    }

    // Si no se escribió el mensaje
    if (this.mensajeWa.length === 0) {
      this.toastr.error('Escriba un mensaje!');
      return;
    }

    // Si ya se recorrió toda la lista
    if (this.index > this.clientesWa.length - 1) {
      this.resetFormulario();
      return;
    }

    this.showProgressBar();

    for (let i = 0; i < this.clientesWa.length; i++) {
      if (i === this.index) {
        this.objWa.phone = this.clientesWa[i].NRO_CEL;
        this.nombreCliente = this.clientesWa[i].NOMBRE;
        this.envioRetrasado(this.objWa);
      }
    }
  }

  // Funcion POST que retrasa el envio -- MASIVO CONTINUO
  envioRetrasado(param: any) {
    setTimeout(() => {
      this.api.post('lead', this.objWa).subscribe(
        (result) => {
          //Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
          if (typeof result === 'object') {
            this.toastr.success('Mensaje enviado a: ' + this.nombreCliente);
            console.log('Lo que se envia a la API: ', param);
            this.index += 1;
            this.changeProgressBar(this.index);
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

  // Se oculta el boton y se muestra el progressbar
  showProgressBar() {
    (<HTMLInputElement>document.getElementById('enviarTodos')).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('progressBar')).style.display =
      'block';
    (<HTMLInputElement>document.getElementById('labelEnviando')).style.display =
      'block';
  }

  // Se resetea el formulario
  resetFormulario() {
    setTimeout(() => {
      this.toastr.info('Se completó el envío masivo!', 'Enviador Alert', {
        timeOut: 0,
      });
    }, 2000);

    this.clientesWa = [];
    this.fileNameExcel = 'Subir un archivo XLS/XLSX...';
    this.fileNameMedia = 'Subir un archivo JPG/PDF...';
    this.mensajeWa = '';
    (<HTMLInputElement>document.getElementById('mensajeEscrito')).value = '';
    (<HTMLInputElement>document.getElementById('enviarTodos')).style.display =
      'block';
    (<HTMLInputElement>document.getElementById('progressBar')).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('labelEnviando')).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('excelFile')).value = '';
  }

  // Eliminar la imagen seleccionada
  deleteMediaFile() {
    (<HTMLInputElement>document.getElementById('mediaFile')).value = '';
    this.fileNameMedia = 'Subir un archivo JPG/PDF...';
    this.objWa.mimeType = '';
    this.objWa.data = '';
  }

  // Cambia el estado del progressBar
  changeProgressBar(valor: any) {
    let porcent = (valor * 100) / this.clientesWa.length;
    (<HTMLInputElement>document.getElementById('progressBar')).style.width =
      porcent + '%';
    (<HTMLInputElement>document.getElementById('progressBar')).style.width =
      porcent + '%';
    //this.progressBarText = "Enviando " + this.index + " de " + this.clientesWa.length;
    this.progressBarText = 'Enviando ' + porcent.toFixed(0) + '%';
  }

  // Cargar archivo
  handleMediaFile(fileToUpload: any) {
    this.fileInput = fileToUpload.target.files[0];
    this.fileNameMedia = this.fileInput.name;
    this.fileSizeMedia = this.fileInput.size;
    console.log(this.fileInput);

    // check for image to upload
    // this checks if the user has uploaded any file
    if (fileToUpload.target.files && fileToUpload.target.files[0]) {
      // calculate your image sizes allowed for upload
      const max_size = 20971510;
      // the only MIME types allowed
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      // max image height allowed
      const max_height = 1080;
      //max image width allowed
      const max_width = 720;

      // check the file uploaded by the user
      // if (this.fileInput.size > max_size) {
      //   //show error
      //   this.error = 'max image size allowed is ' + max_size / 1000 + 'Mb';
      //   //show an error alert using the Toastr service.
      //   this.toastr.error(this.error, 'Error');
      //   return;
      // }

      //check for allowable types
      // if (!allowed_types.includes(this.fileInput.type)) {
      //   // define the error message due to wrong MIME type
      //   let error = 'Los archivos permitidos son: ( JPEG | JPG | PNG )';
      //   // show an error alert for MIME
      //   this.toastr.error(error, 'Error');
      //   //return false since the MIME type is wrong
      //   return;
      // }

      // define a file reader constant
      const reader = new FileReader();
      // read the file on load
      reader.onload = (e: any) => {
        // create an instance of the Image()
        const image = new Image();
        // get the image source
        image.src = e.target.result;

        image.onload = (rs) => {
          // get the image height read
          // const img_height = image.height;
          // // get the image width read
          // const img_width = image.width;
          // check if the dimensions meet the required height and width
          // if (img_height > max_height && img_width > max_width) {
          //   console.log('Imagen medida!');
          //   // throw error due to unmatched dimensions
          //   this.error =
          //     'Maximum dimensions allowed: ' +
          //     max_height +
          //     '*' +
          //     max_width +
          //     'px';
          //   this.toastr.error(this.error, 'Error');
          //   return;
          // } else {
          //   // otherise get the base64 image
          //   this.fileMimeTypeMedia = image.src.split(';base64,')[0];
          //   this.fileMimeTypeMedia = this.fileMimeTypeMedia.slice(5);
          //   this.fileBase64Media = image.src.split(',')[1];
          //   // console.log("Mime type: ",this.fileMimeTypeMedia);
          //   // console.log("Base64: ", this.fileBase64Media);
          //   // console.log("Name: ", this.fileNameMedia);
          //   // console.log("Type: ", this.fileSizeMedia);
          // }
        };

        this.fileMimeTypeMedia = image.src.split(';base64,')[0];
        this.fileMimeTypeMedia = this.fileMimeTypeMedia.slice(5);
        this.fileBase64Media = image.src.split(',')[1];

        this.objWa.mimeType = this.fileMimeTypeMedia;
        this.objWa.data = this.fileBase64Media;
        this.objWa.fileName = this.fileNameMedia;

        console.log('Mime type: ', this.fileMimeTypeMedia);
        console.log('Base64: ', this.fileBase64Media);
        console.log('Name: ', this.fileNameMedia);
        console.log('Size: ', this.fileSizeMedia);
      };
      // reader as data url
      reader.readAsDataURL(fileToUpload.target.files[0]);
      //console.log(reader);
    }
  }
}
