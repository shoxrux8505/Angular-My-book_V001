import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(private toastr: NzNotificationService) {}
  jumpTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showReportInfo(): void {
    this.toastr.info('Info','Iltimos ctrl+enter tugmasidan foydalaning!');
  }
}
