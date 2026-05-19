import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss', '../../app.scss'],
})

export class DashboardComponent { }
