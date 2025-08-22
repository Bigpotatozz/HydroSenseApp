import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuariosService, Usuario, UsuarioEdicionDTO } from '../services/perfil.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  private sub?: Subscription;
  private userId: number | null = null;
  private userActual: Usuario | null = null;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoMaterno: [''],
      edad: [18, [Validators.required, Validators.min(0), Validators.max(120)]],
      pais: [''],
      correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      contrasenia: ['']
    });
  }

  ngOnInit(): void {
    const initialUserId = this.authService.getLoggedInUserId();
    if (initialUserId) {
      this.userId = initialUserId;
      this.cargarUsuario(initialUserId);
    } else {
      this.loading.set(false);
      this.errorMsg.set('No hay usuario logueado.');
    }
    this.sub = this.authService.currentUser.subscribe(user => {
      const id = user?.idUsuario ?? null;
      if (id && id !== this.userId) {
        this.userId = id;
        this.cargarUsuario(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getErrorText(err: any): string {
    if (!err) return 'Solicitud inválida.';
    if (typeof err === 'string') return err;
    const e = err.error ?? err;
    if (typeof e === 'string') return e;
    if (e?.message) return String(e.message);
    if (e?.title) return String(e.title);
    if (e?.errors && typeof e.errors === 'object') {
      try {
        const msgs = Object.values(e.errors as Record<string, string[] | string>)
          .flat()
          .map(x => String(x))
          .filter(Boolean);
        if (msgs.length) return msgs.join(' ');
      } catch { }
    }
    try { return JSON.stringify(e); } catch { return 'Solicitud inválida.'; }
  }

  private cargarUsuario(id: number): void {
    this.loading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    const cached = (this.authService as any)?.getCurrentUser?.() as Usuario | undefined;
    if (cached && cached.idUsuario === id) {
      this.userActual = cached;
      this.form.patchValue(this.mapUsuarioToForm(cached));
      this.loading.set(false);
      return;
    }

    this.usuariosService.getUsuarioPorId(id).subscribe({
      next: (user) => {
        this.loading.set(false);
        if (!user) {
          this.errorMsg.set('Usuario no encontrado.');
          return;
        }
        this.userActual = user;
        this.form.patchValue(this.mapUsuarioToForm(user));
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(this.getErrorText(err));
      }
    });
  }

  private mapUsuarioToForm(u: Usuario) {
    return {
      nombre: u.nombre ?? '',
      apellidoPaterno: u.apellidoPaterno ?? '',
      apellidoMaterno: u.apellidoMaterno ?? '',
      edad: u.edad ?? 18,
      pais: u.pais ?? '',
      correo: u.correo ?? '',
      telefono: u.telefono ?? '',
      contrasenia: ''
    };
  }

  guardar(): void {
    if (!this.userId || this.form.invalid || !this.userActual) return;

    const dto: UsuarioEdicionDTO = {
      nombre: (this.form.value.nombre ?? '').toString().trim(),
      apellidoPaterno: (this.form.value.apellidoPaterno ?? '').toString().trim(),
      apellidoMaterno: (this.form.value.apellidoMaterno ?? '').toString().trim(),
      edad: Number(this.form.value.edad ?? 18),
      pais: (this.form.value.pais ?? '').toString().trim(),
      correo: this.userActual.correo,                 // correo fijo para evitar 400
      telefono: (this.form.value.telefono ?? '').toString().trim(),
      ...(this.form.value.contrasenia?.toString().trim()
        ? { contrasenia: this.form.value.contrasenia.toString().trim() }
        : {})
    };

    this.saving.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    this.usuariosService.editarUsuario(this.userId, dto).subscribe({
      next: (resp) => {
        this.saving.set(false);
        if (resp.success) {
          this.successMsg.set('Perfil actualizado correctamente.');
          this.form.patchValue({ contrasenia: '' });
        } else {
          this.errorMsg.set(resp.message || 'No fue posible actualizar el perfil.');
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(this.getErrorText(err));
      }
    });
  }
}
