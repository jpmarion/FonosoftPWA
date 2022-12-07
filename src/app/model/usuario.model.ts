export class Usuario {
    private _id?: BigInteger;
    private _nombreUsuario?: string;
    private _email?: string;

    get id(): BigInteger {
        return this.id;
    }
    set id(value: BigInteger) {
        this._id = value;
    }

    get nombreUsuario(): string {
        return this._nombreUsuario!;
    }
    set nombreUsuario(value:string){
        this._nombreUsuario = value;
    }

    get email():string{
        return this._email!;
    }
    set email(value:string){
        this._email = value;
    }


}
