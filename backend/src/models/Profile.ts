import { Center } from "./Center";
import { v4 as UUID } from "uuid";
import { UserRole } from "./UserRole";

export class Profile {
  private id: string;
  private nombre: string;
  private rol: UserRole;
  private center_id: string;

  constructor(nombre: string, rol: UserRole, center_id: string) {
    this.id = UUID();
    this.nombre = nombre;
    this.rol = rol;
    this.center_id = center_id;
  }

  public getProfile(): Profile {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public updateProfile(nombre: string): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public hasRole(rol: UserRole): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public isAdmin(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getCenter(): Center {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }
}
