import { Center } from "./Center";
import { FacilityType } from "./FacilityType";
import { Promotion } from "./Promotion";
import { Booking } from "./Booking";
import { v4 as UUID } from "uuid";

export class Facility {
  private id: string;
  private center_id: string;
  private nombre: string;
  private tipo: FacilityType;
  private precio_hora: number;

  constructor(center_id: string, nombre: string, tipo: FacilityType, precio_hora: number) {
    this.id = UUID();
    this.center_id = center_id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio_hora = precio_hora;
  }

  public getFacility(): Facility {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public updateFacility(nombre: string, precio: number): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public isAvailable(fecha: Date, hora: string): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public calculatePrice(horas: number, promocion: Promotion): number {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getBookings(fecha: Date): Booking[] {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getCenter(): Center {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }
}
