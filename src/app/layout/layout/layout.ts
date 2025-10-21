import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './../components/navbar/navbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
