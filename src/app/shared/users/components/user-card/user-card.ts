import { Component, input, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-card',
    standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss'
})
export class UserCard {
  user = input<{ name: string; email: string }>();
  refresh = output<void>();
}
