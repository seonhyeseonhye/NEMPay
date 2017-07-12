import {Component} from '@angular/core';

import {NavController, NavParams, ModalController, ViewController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {AddressBookProvider} from '../../../providers/address_book/address_book.provider';


@Component({
    selector: 'page-select-recipient-from-address-book',
    templateUrl: 'select_recipient_from_address_book.html'
})
export class SelectRecipientFromAddressBookPage {

    storedAddresses : any
    selectedAddress: string
    account: string

    constructor(public navCtrl: NavController, private params: NavParams, public translate: TranslateService, private addressBook: AddressBookProvider, private modalCtrl: ModalController, private viewCtrl : ViewController) {
        this.selectedAddress = null;
        this.account = this.params.get('account')
        this._getStoredAddresses(this.account);
    }

    /**
     * Retrieves current account stored addresses in addres book
     * @param account address of the account to retrieve it's address book
     */
    private _getStoredAddresses(account) {
        return this.addressBook.getAddresses(account).then(data => {
            this.storedAddresses =  data;
            return data;
        })
    }

    /**
     *  Filters shown addresses
     * @param ev event
     */
    public filterAddresses(event: any){
        this._getStoredAddresses(this.account).then(data => {
            let val = event.target.value;
            if (val && val.trim() != '') {
                this.storedAddresses = data.filter((item) => {
                    return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
                })
            }

        })
    }

    /**
     *  Dismiss modal
     */
    dismiss(){
        this.viewCtrl.dismiss(this.storedAddresses);
    }

}
