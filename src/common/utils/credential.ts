import Cookies from "js-cookie";

export interface IUser {
    [index: string]: any;
    userName: string;
    password: string;
}

export class Credential {

    public static remember: boolean = false;

    public static get user(): IUser {
        return Cookies.getJSON(Credential.getKey("user")) || {};
    }

    public static set user(user: IUser) {
        Credential.remember ?
            Cookies.set(Credential.getKey("user"), user, { expires: 7 }) :
            Cookies.set(Credential.getKey("user"), user);
    }

    public static get token() {
        return Cookies.getJSON(Credential.getKey("access_token"));
    }

    public static set token(token: string) {
        Cookies.set(Credential.getKey("access_token"), token);
    }

    public static clear(key?: "user" | "token") {
        if (key) {
            Cookies.remove(Credential.getKey(key));
        } else {
            Cookies.remove(Credential.getKey("user"));
            Cookies.remove(Credential.getKey("access_token"));
        }
    }

    private static getKey(key: string) {
        return `codeboard_${key}`;
    }

}
