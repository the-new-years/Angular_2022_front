import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class DataService {
    userInfo:BehaviorSubject<any>

    constructor(){
        this.userInfo = new BehaviorSubject(null);
        this.userInfo.asObservable();
    }
}