import {Injectable} from '@angular/core';
import {Http,Headers,RequestOptions} from "@angular/http"
import 'rxjs/add/operator/map';
//import {BaThemePreloader} from '../../theme/services';

@Injectable()
export class BatchService {
    
    constructor (private _http: Http){}
    
    getBatchForList(listName:String){ 
        let headers = new Headers({ 'Accept': 'application/json','Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' });
        let options = new RequestOptions({ headers: headers });
        //console.log("Getting list "+listName)
        let body = "{\"listName\":\""+listName+"\"}";
        return this._http.post('/rest/plugandplay/api/v1/batch/all',body,options).map(res => {
                // If request fails, throw an Error that will be caught
                if(res.status == 204) {
                    console.log(res.status);
                    return res;
                } 
                // If everything went fine, return the response
                else {
                return res;
                }
            });
            //.map(res => res.json());
    }

    removeFromBatch(id:Number,listName:String) { 
        let headers = new Headers({ 'Accept': 'application/json','Content-Type':'application/json','Access-Control-Allow-Origin': '*' });
        let options = new RequestOptions({ headers: headers });
        let body = "{\"id\":"+id+",\"listName\":\""+listName+"\"}";
        return this._http.post('/rest/plugandplay/api/v1/batch/delete/',body,options)
            .map(res => res.json());
    }

    movePosition(body:String) { 
        let headers = new Headers({ 'Accept': 'application/json','Content-Type':'application/json','Access-Control-Allow-Origin': '*' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post('/rest/plugandplay/api/v1/batch/move',body,options)
            .map(res => res.json());
    }

    /*addBatchList(body: String) {
        let headers = new Headers({ 'Accept': 'application/json','Content-Type':'application/json','Access-Control-Allow-Origin': '*' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post('/rest/plugandplay/api/v1/batch/newlist',body,options)
            .map(res => res.json());
    }*/

    //54.145.172.103
    //        BaThemePreloader.registerLoader(this.getVentures());
    /*getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.StartupsData);
      }, 2000);
    });
    }*/
}