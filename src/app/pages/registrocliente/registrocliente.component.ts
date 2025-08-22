import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from '../../services/registrocliente.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registrocliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrocliente.component.html',
  styleUrls: ['./registrocliente.component.css']
})
export class RegistroclienteComponent implements OnInit {
  cargando = false;
  exitoMsg = '';
  errorMsg = '';

  form!: FormGroup;

  // Solo países de América
  paisesAmerica: string[] = [
    'Argentina', 'Belice', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Dominica', 'Ecuador',
    'El Salvador', 'Estados Unidos', 'Granada', 'Guatemala', 'Guyana', 'Haití', 'Honduras', 'Jamaica', 'México', 'Nicaragua',
    'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'San Cristóbal y Nieves', 'San Vicente y las Granadinas',
    'Santa Lucía', 'Surinam', 'Trinidad y Tobago', 'Uruguay', 'Venezuela'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: RegistroService
  ) { }

  ngOnInit(): void {
    // regex: solo letras (incluye acentos), espacios y ñ/Ñ
    const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
    const soloTelefono = /^\d{7,15}$/;

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern(soloLetras)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(soloLetras)]],
      apellidoMaterno: ['', [Validators.pattern(soloLetras)]],
      edad: [null as number | null, [Validators.required, Validators.min(18), Validators.max(99)]],
      pais: ['', [Validators.required]],
      correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required, Validators.pattern(soloTelefono)]],
      nivel: [{ value: '2', disabled: true }, [Validators.required]],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });

    const correo = this.route.snapshot.queryParamMap.get('correo') ?? '';
    const nivel = this.route.snapshot.queryParamMap.get('nivel') ?? '2';
    this.form.patchValue({ correo, nivel });
  }

  submit(): void {
    this.exitoMsg = '';
    this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload = {
      ...this.form.getRawValue(),
      nivel: '2'
    } as any;

    this.cargando = true;
    this.usuarioService.registrar(payload).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res.success) {
          this.exitoMsg = 'Registro exitoso. ¡Bienvenido!';
       
          this.router.navigateByUrl('/');
        } else {
          this.errorMsg = res.message || 'No se pudo registrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error al registrar.';
        console.error(err);
      }
    });
  }

  hasError(ctrl: string, error: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.touched && c.hasError(error);
  }
}
