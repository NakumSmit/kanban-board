import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { BoardComponent } from '../board/board';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [NavbarComponent, BoardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss', '../../app.scss'],
})

export class DashboardComponent { }
