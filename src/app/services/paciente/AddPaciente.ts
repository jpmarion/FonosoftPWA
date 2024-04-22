export class AddPaciente {
    apellido?: string;
    nonbre?: string;
    obrasSociales?: AddPacienteObraSocial[] = [];
    contactos?: AddPacienteContacto[] = [];
    documentos?: AddPacienteDocumento[] = [];
}

export class AddPacienteObraSocial {
    idObraSocial?: number;
    nroObraSocial?: string;
}

export class AddPacienteContacto {
    idTipoContacto?: number;
    DescContacto?: string;
}

export class AddPacienteDocumento {
    idTipoDocumento?: number;
    nroDocumento?: string;
}
