import { Facility } from "./Facility";
import { Profile } from "./Profile";
import { BookingStatus } from "./BookingStatus";
import { v4 as UUID } from "uuid";

export class Booking {
  private id: string;
  private facility_id: string;
  private user_id: string;
  private fecha: Date;
  private hora_inicio: string;
  private estado: BookingStatus;

  constructor(facility_id: string, user_id: string, fecha: Date, hora_inicio: string, estado: BookingStatus) {
    this.id = UUID();
    this.facility_id = facility_id;
    this.user_id = user_id;
    this.fecha = fecha;
    this.hora_inicio = hora_inicio;
    this.estado = estado;
  }

  public createBooking(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public cancelBooking(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public confirmBooking(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public completeBooking(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getBooking(): Booking {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public isActive(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public canBeCancelled(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getFacility(): Facility {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getUser(): Profile {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }
}
