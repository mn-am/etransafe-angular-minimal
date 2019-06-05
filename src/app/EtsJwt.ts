/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

import {KEYUTIL, KJUR} from 'jsrsasign';

const pem = `-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyMDh4+03E+iWPoAbd5XXEQ3ViosRXX4O5TlSJdr1B14OywzvDBY4cpOj5EPuJOXAyuWyZvWiVTzy4LjlzVQLJUNmHoFmfjerqGtvuwSGeJyVw+XZAmju0l/lT2mg0qxP94gsRgwzB5l2uwYfOGe7RtAtDUtWBFyn6ub+Pbi1rL/U6GjBCK011mvYp0068PLOAdn/zVYnm83ELSETNv1jFh5eCZf/Pg1arZYLizvmp1DE+YxgDJHI5yagFFVvxJxqPjmpnapML/Kcolh6kEH79PmJT5XATCq0s0t8dMvPd6i6alQVOP1uQascuG+hODyfYGxdS/jSWPniJLR/RVTXKwIDAQAB-----END PUBLIC KEY-----`;

export class EtsJwt {

    static urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return EtsJwt.b64DecodeUnicode(output);
    }

    // credits for decoder goes to https://github.com/atk
    static b64decode(str: string): string {
        let chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output: string = '';

        str = String(str).replace(/=+$/, '');

        if (str.length % 4 === 1) {
            throw new Error(
                "'atob' failed: The string to be decoded is not correctly encoded."
            );
        }

        for (
            // initialize result and counters
            let bc: number = 0, bs: any, buffer: any, idx: number = 0;
            // get next character
            (buffer = str.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
            (
                (bs = bc % 4 ? bs * 64 + buffer : buffer),
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                bc++ % 4
            )
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        return output;
    }

    static b64DecodeUnicode(str: any) {
        return decodeURIComponent(
            Array.prototype.map
                .call(EtsJwt.b64decode(str), (c: any) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    }

    static decodeTokenHeader(token: string, ): EtsJwt.Token.Header {
        if(token===null) {
            return null;
        }

        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
        }

        let decoded = EtsJwt.urlBase64Decode(parts[0]);
        if (!decoded) {
            throw new Error('Cannot decode the token.');
        }

        return JSON.parse(decoded);
    }

    static decodeTokenPayload(token: string, ): EtsJwt.Token.Payload {
        if(token===null) {
            return null;
        }

        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
        }

        let decoded = EtsJwt.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token.');
        }

        return JSON.parse(decoded);
    }

    static getTokenExpirationDate(token: string): Date | null {
        if (token === null) {
            return null;
        }
        let decoded: any;
        decoded = EtsJwt.decodeTokenPayload(token);

        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        return date;
    }

    static isTokenExpired(token: string, offsetSeconds?: number): boolean {
        if (token === null || token === '') {
            return true;
        }
        let date = EtsJwt.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;

        if (date === null) {
            return true;
        }

        return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
    }

    static isTokenValid(token: string): boolean {
        if (token === null || token === '') {
            return false;
        }
        const result = KJUR.jws.JWS.verifyJWT(token, pem, {alg: ["RS256"], gracePeriod: 100}/*{
            alg: [ EtsJwt.decodeTokenHeader(token).alg ]
        }*/);
        console.log('YYY', result);
        return result
    }

    static getTokenExpiresInMilliseconds(token: string): number {
        if (token === null || token === '') {
            return -1;
        }
        const pl: EtsJwt.Token.Payload = EtsJwt.decodeTokenPayload(token);
        const ms_now: number = Date.now();
        return (pl.exp * 1000) - ms_now;
    }

}
export namespace EtsJwt {
    export namespace Token {
        export interface Payload {
            domain: string;
            exp: number;
            iat: number;
            iss: string;
            roles: string[];
            sub: string;
        }
        export interface Header {
            alg: string;
        }
    }
}