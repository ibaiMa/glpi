import { Component, OnInit, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonInput, IonButton, IonListHeader, ToastController 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonListHeader
  ]
})
export class Tab2Page implements OnInit {
  private toastCtrl = inject(ToastController);

  nuevaIp: string = "";
  ipActual: string = "";

  ngOnInit() {
    // Carga la IP guardada o usa 'glpi1.local' por defecto
    this.ipActual = localStorage.getItem('glpi_ip') || 'glpi1.local';
    this.nuevaIp = this.ipActual;
  }

  async guardarConfig() {
    if (this.nuevaIp.trim()) {
      // Guarda en la memoria persistente
      localStorage.setItem('glpi_ip', this.nuevaIp.trim());
      this.ipActual = this.nuevaIp.trim();

      const toast = await this.toastCtrl.create({
        message: 'Configuración guardada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    }
  }
}