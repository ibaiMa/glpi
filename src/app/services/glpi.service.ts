import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlpiService {
  private http = inject(HttpClient);

  /**
   * metodo para construir la url dinamica
   * Si el usuario cambio la ip en ajustes la usara. Si no usara la de enviroments por defecto
   */
  private getUrlBase(): string {
    const savedIp = localStorage.getItem('glpi_ip');
    if (savedIp) {
      // Si hay una IP guardada, construimos la ruta hacia el archivo apirest.php
      return `http://${savedIp}/glpi/apirest.php`;
    }
    // Si no hay nada guardado, usamos la URL por defecto del proyecto
    return environment.urlApi;
  }

  // Conseguir el token de sesión
  async initSession() {
    const headers = new HttpHeaders({
      'App-Token': environment.appToken,
      'Authorization': `user_token ${environment.userToken}`
    });
    // Usamos getUrlBase() en lugar de environment.urlApi
    return firstValueFrom(this.http.get<any>(`${this.getUrlBase()}/initSession`, { headers }));
  }

  // Lista de ordenadores
  async getComputers(sessionToken: string) {
    const headers = new HttpHeaders({
      'App-Token': environment.appToken,
      'Session-Token': sessionToken
    });
    return firstValueFrom(this.http.get<any[]>(`${this.getUrlBase()}/Computer`, { headers }));
  }

  // Obtener el historial de notas
  async getComputerNotes(computerId: number, sessionToken: string) {
    const headers = new HttpHeaders({
      'App-Token': environment.appToken,
      'Session-Token': sessionToken
    });
    return firstValueFrom(this.http.get<any[]>(`${this.getUrlBase()}/Computer/${computerId}/Notepad`, { headers }));
  }

  // Añadir una nota nueva 
  async addComputerNote(computerId: number, content: string, sessionToken: string) {
    const headers = new HttpHeaders({
      'App-Token': environment.appToken,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json'
    });

    const body = { 
      input: { 
        itemtype: 'Computer',
        items_id: computerId, 
        content: content      
      } 
    };

    return firstValueFrom(this.http.post(`${this.getUrlBase()}/Notepad`, body, { headers }));
  }
}