import { Component, OnInit, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, 
  IonLabel, IonItem, IonIcon, IonTextarea, IonButton, IonCard, 
  IonCardHeader, IonCardSubtitle, IonCardContent, IonNote, ToastController 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlpiService } from '../services/glpi.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonTextarea, 
    IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonNote
  ]
})
export class Tab1Page implements OnInit {
  private glpiService = inject(GlpiService);
  private toastCtrl = inject(ToastController);

  // Variables de estado de la página
  computers: any[] = [];
  selectedComputer: any = null;
  newComment: string = "";
  notesList: any[] = [];
  sessionToken: string = "";

  //  Crea la sesión en GLPI y carga los ordenadores
  async ngOnInit() {
    try {
      const res = await this.glpiService.initSession();
      this.sessionToken = res.session_token;
      this.computers = await this.glpiService.getComputers(this.sessionToken);
    } catch (e) {
      console.error("Error inicial:", e);
    }
  }

  // al elegir un pc lo guarda y busca sus notas
  async seleccionarPC(pc: any) {
    this.selectedComputer = pc;
    await this.cargarNotas();
  }

  // Obtiene el historial de notas del equipo seleccionado
  async cargarNotas() {
    if (!this.selectedComputer) return;
    try {
      const res = await this.glpiService.getComputerNotes(this.selectedComputer.id, this.sessionToken);
      // convertir en un array manejable
      this.notesList = Array.isArray(res) ? res.reverse() : (res ? [res] : []);
    } catch (e) {
      this.notesList = []; // Si falla o no hay notas limpiamos la lista
    }
  }

  // Enviar la nueva nota a glpi y refresca la vista
  async saveChanges() {
    if (!this.newComment.trim() || !this.selectedComputer) return;
    
    try {
      await this.glpiService.addComputerNote(this.selectedComputer.id, this.newComment, this.sessionToken);
      this.newComment = "";     // Limpiar el input
      await this.cargarNotas(); // Refresca el historial
      
      const toast = await this.toastCtrl.create({ 
        message: 'Nota guardada', 
        duration: 2000, 
        color: 'success' 
      });
      toast.present();
    } catch (e) {
      console.error("Error al guardar:", e);
    }
  }
}