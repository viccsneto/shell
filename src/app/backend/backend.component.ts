import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit {
  ipcRenderer;
  pending_callbacks;
  constructor() {
    this.pending_callbacks = new Map();
  }

  RegisterIPC() {
    if (!this.ipcRenderer && (<any>window).require) {
      try {
        this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
        this.ipcRenderer.on("call_result", (event, call_result) => {
          let call_result_object = JSON.parse(call_result);
          let callback_function = this.pending_callbacks.get(call_result_object.id);
          if (callback_function) {
            callback_function(call_result_object.result);
            this.pending_callbacks.delete(call_result_object.id);
          }
        });
      }
      catch (e) {
        throw e;
      }
    }
    else {
      console.warn('App not running inside Electron!');
    }
  }

  Execute(script, callback) {
    this.RegisterIPC();

    let callback_id = this.ipcRenderer.sendSync("Execute", script);     
    this.pending_callbacks.set(callback_id, callback);

    console.log("Registering callback id as ", callback_id, this.pending_callbacks.get(callback_id));
  }

  ngOnInit(): void {
  }

}
