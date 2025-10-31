import { Center } from "./Center";
import { DiscountType } from "./DiscountType";

export class Promotion {
  private id: number;
  private codigo: string;
  private tipo_descuento: DiscountType;
  private valor_descuento: number;
  private center_id: string;

  constructor(id: number, codigo: string, tipo_descuento: DiscountType, valor_descuento: number, center_id: string) {
    this.id = id;
    this.codigo = codigo;
    this.tipo_descuento = tipo_descuento;
    this.valor_descuento = valor_descuento;
    this.center_id = center_id;
  }

  public getPromotion(): Promotion {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public createPromotion(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public validateCode(codigo: string): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public applyDiscount(precio: number): number {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public isValid(): boolean {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }

  public getCenter(): Center {
    // TODO: Implement method
    throw new Error("Not implemented yet");
  }
}
