import { Injectable } from "@angular/core";
import { Buffer } from 'buffer';

@Injectable({ providedIn: 'root' })
export class Helpers {
  constructor(
  ) { }

  // For Base64
  encodeBase64 = (data: any) => Buffer.from(data).toString('base64');
  decodeBase64 = (data: any) => Buffer.from(data, 'base64').toString('ascii');

  copyObject(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }

  public getAdminProfile() {
    const profileEncode = this.encodeBase64('profileData');
    if (localStorage.getItem(profileEncode)) {
      const profileData = this.decodeBase64(localStorage.getItem(profileEncode))
      return JSON.parse(profileData);
    }
    return null;
  }

  public checkSAUser(data: any) {
    return data?.is_admin ? data?.is_admin : false;
  }


  public getEmptyProperties(obj: any) {
    let emptyProperties = [];
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] === null || obj[prop] === '') {
          emptyProperties.push(prop);
        }
      }
    }
    return emptyProperties;
  }
}
