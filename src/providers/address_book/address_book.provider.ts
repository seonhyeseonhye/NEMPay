import {Injectable} from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import CryptoJS from 'crypto-js';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AddressBookProvider {
    private database: SQLiteObject;

    constructor(private sqlite: SQLite) {
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.database = db;
        });
    }

    /**
     * New Address
     * @param account address as an index, to know to which address book belongs if have multiple accounts loaded.
     * @param name name of the account to be stored
     * @return address address of the account to be stored
     */

    public addAddress(account, name, address) {
        return this.database.executeSql('INSERT INTO address_book VALUES ('+account+','+name+','+address+')', {}).then((data) => {
            return data;
        });
    }

    /**
     * Delete Address
     * @param id address to be deleted from address book
     */

    public deleteAddress(id)  {
        return this.database.executeSql('DELETE FROM address_book WHERE id='+id+')', {}).then((data) => {
            return data;
        });
    }

    /**
     * Get Addresses
     * @param account address as an index, to retrieve it's addres book
     */
    public getAddresses(account)  {
        return this.database.executeSql('SELECT * FROM address_book WHERE account='+account+')', {}).then((data) => {
            return data;
        });
    }
}
