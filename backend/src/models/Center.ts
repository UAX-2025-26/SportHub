import { Profile } from "./Profile";
import { Facility } from "./Facility";
import { Promotion } from "./Promotion";
import { v4 as UUID } from "uuid";

export class Center {
  private id: string;
  private nombre: string;
  private direccion: string;
  private admin_user_id: string;

  constructor(nombre: string, direccion: string, admin_user_id: string) {
    this.id = UUID();
    this.nombre = nombre;
    this.direccion = direccion;
    this.admin_user_id = admin_user_id;
  }

  public getCenter(): Center {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public updateCenter(nombre: string, direccion: string): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getFacilities(): Facility[] {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getAdmin(): Profile {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public addFacility(facility: Facility): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getPromotions(): Promotion[] {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }
}
