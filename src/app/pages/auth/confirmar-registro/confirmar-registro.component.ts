import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-confirmar-registro',
  templateUrl: './confirmar-registro.component.html',
  styleUrls: ['./confirmar-registro.component.scss']
})
export class ConfirmarRegistroComponent implements OnInit {
  registro: { nombreusuario: string } = { nombreusuario: "" };


  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }
  ngOnInit(): void {

    this.registro.nombreusuario = this.route.snapshot.paramMap.get('nombreusuario')!;

    this.authService.ConfirmarRegistro(this.registro.nombreusuario)
      .subscribe({
        next: (resultado) => {
          this.router.navigate(['']);
        }
      });
  }


}
