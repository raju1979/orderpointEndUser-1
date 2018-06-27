import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Network } from '@ionic-native/network';
@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {

    networkAvailable: boolean = false;

    constructor(private network: Network) {
        console.log(this.network)
        if (this.network.type !== 'none') {
            this.networkAvailable = true;
            console.log('we got a nooooo connection, woohoo!');
        }

    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if(this.networkAvailable) {
            const dupReq = req.clone({
                headers: req.headers.set('Consumer-Secret', 'some sample key')
            });
            return next.handle(dupReq);
        } else {
            return Observable.throw('Error message');
        }
        
    }
}
@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpsRequestInterceptor,
            multi: true
        }
    ]
})
export class InterceptorModule { }
