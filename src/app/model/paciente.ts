
import { Deserializable } from "../interface/deserializable";
import { Documento } from "./documento";

export class Paciente implements Deserializable {
    public IdPaciente?: BigInteger;
    public Apellido?: string;
    public Nombre?: string;
    public Documentos?: Documento[];
    
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
