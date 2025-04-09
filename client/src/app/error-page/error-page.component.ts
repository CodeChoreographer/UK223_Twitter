import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {
  errorCode: string = '404';
  errorMessage: string = 'Seite nicht gefunden';
  showEasterEgg: boolean = false;
  redirecting: boolean = false;
  inputSequence: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.data.subscribe((data) => {
      if (data['errorCode']) {
        this.errorCode = data['errorCode'];
        this.errorMessage = data['errorMessage'] || this.errorMessage;
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.errorCode === '403') {
      this.inputSequence += event.key;

      if (this.inputSequence.trim().toLowerCase() === 'i am frodo') {
        this.showEasterEgg = true;
        this.inputSequence = '';
      }

      if (this.inputSequence.length > 20) {
        this.inputSequence = this.inputSequence.slice(-20);
      }
    }
  }

  triggerEasterEgg() {
    this.redirecting = true;

    setTimeout(() => {
      const mapTab = window.open(
        'http://lotrproject.com/map/#zoom=3&lat=-1388.5&lon=1500&layers=BTTTTTTTT',
        '_blank'
      );

      if (mapTab) {
        mapTab.focus();
        setTimeout(() => {
          mapTab.close();
          window.focus();
        }, 3000);
      }
    }, 4000);

    setTimeout(() => {
      this.router.navigate(['/users/login']);
    }, 5000);
  }
}
