import { Component, NgZone } from '@angular/core';
import { BackendComponent } from "./backend/backend.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  backend = new BackendComponent();
  title = 'shell';
  buttons = {xy:{title:"XY"}};
  result = "Nothing yet";
  objectKeys = Object.keys;
  constructor(private zone: NgZone )
  {

  }
  Execute(script, callback) {
    this.backend.Execute(script, callback);
  }
  
  ExecuteActionFromEntryName(entry_name) {
    this.Execute("self.Shell:ExecuteActionFromEntryName('" + entry_name + "')", (result) => {
      this.result = result;
    });
  }

  SetButtons(buttons) {
    this.buttons = buttons;
    this.zone.run(() => this.buttons = buttons);
  }
  ngOnInit(): void {
    let reference = this;
    this.Execute("return self.Shell.buttons", (result) => {
      reference.result = result;
      console.log(result);
      reference.SetButtons(result);
    })
  }

  
}
