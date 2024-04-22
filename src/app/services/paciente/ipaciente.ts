import { IContactos } from "./icontactos";
import { Idocumentos } from "./idocumentos";
import { IObraSocial } from "./iobra-social";

export interface IPaciente {
    idPaciente: number;
    apellido: string;
    nombre: string;
    obraSociales:IObraSocial[];
    contactos: IContactos[];
    documentos: Idocumentos[];
}
