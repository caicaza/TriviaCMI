import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { encryptionKey } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  key: string = encryptionKey;

  constructor() {}

  encrypt(text: string): string {
    let datoEncriptado = CryptoJS.AES.encrypt(text, this.key).toString();
    return encodeURIComponent(datoEncriptado);
  }

  decrypt(encodedText: string): string {
    let encryptedText = decodeURIComponent(encodedText);
    return CryptoJS.AES.decrypt(encryptedText, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }
}
