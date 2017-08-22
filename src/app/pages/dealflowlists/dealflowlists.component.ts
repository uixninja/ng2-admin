import {Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, ViewContainerRef} from '@angular/core';
import {Pipe, PipeTransform, SimpleChanges} from '@angular/core'
import { Observable } from 'rxjs/Rx';
import {Router} from '@angular/router';

import { DealflowListsService } from './dealflowlists.service';
import { LocalDataSource } from 'ng2-smart-table';
import {Subscription} from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';



@Component({
  selector: 'dealflow',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./dealflowlists.scss'),require('../css/ng2-toastr.min.scss')],
  template: require('./dealflowlists.html'),
  providers: [DealflowListsService]
})
export class DealflowListsComponent implements OnInit {
  @ViewChild('input')
  input: ElementRef;
  lists: any[] = [];
  archived: any[] = [];
  private sub: any;
  dealflow: Object;
  dealflowlist: String;
  public error: boolean;
  public errorArchived: boolean;
  public loading: boolean;
  public overlay: any;
  router: Router;

  constructor(private _dealflowService: DealflowListsService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.archived = new Array(0);
    this.lists  = new Array(0);
    this.unsetOverlay();
    this.getLists();
    this.getArchivedLists()
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(){
    let eventObservable = Observable.fromEvent(this.input.nativeElement, 'keyup')
      eventObservable.subscribe();  
  }
  showSuccess(message: string, title: string, time: number) {
        this.toastr.success(message, title,{toastLife: 2000});
  }
  showError(message: string, title: string, time: number) {
        this.toastr.error(message, title,{toastLife: 2000});
  }
  showWarning(message: string, title: string, time: number) {
        this.toastr.warning(message, title,{toastLife: time});
  }
  getLists() {
      this.loading = true;
      this.error = false;
      this._dealflowService.getDealflowLists().map(res => {
      // If request fails, throw an Error that will be caught
      if(res.status == 204) {
        this.loading = false;
        this.error = true;
        console.log("Search did not return any results.") 
      } else if (res.status < 200 || res.status >= 300){
        this.loading = false;
        throw new Error('This request has failed ' + res.status);
      }
      // If everything went fine, return the response
      else {
        this.loading = false;
        return res.json();
      }
    }).subscribe(data => this.lists = data,
      err => console.error('Error: ' + err),
          () => console.log('Completed!')
      )
  }

  getArchivedLists() {
      this.loading = true;
      this.errorArchived = false;
      this._dealflowService.getDealflowArchived().map(res => {
      // If request fails, throw an Error that will be caught
      if(res.status == 204) {
        this.loading = false;
        this.errorArchived = true;
        console.log("Search did not return any results.") 
      } else if (res.status < 200 || res.status >= 300){
        this.loading = false;
        throw new Error('This request has failed ' + res.status);
      }
      // If everything went fine, return the response
      else {
        this.loading = false;
        return res.json();
      }
    }).subscribe(data => this.archived = data,
      err => console.error('Error: ' + err),
          () => console.log('Completed!')
      )
  }

  addDealflowList(listname: String){
    if(listname.length < 2 || listname.length > 50) {
      this.showWarning("Please enter a list name greater than 1 and less than 50 characters.", "", 4000);
    } else {
      console.log(listname);
      let item;
      this.loading = true;
      this._dealflowService.addDealflowList("{\"listName\":\""+listname+"\"}").subscribe(data => item = data,
    error => {this.loading = false; this.showWarning("Please enter a new Dealflow List, '" +listname+ "' already exists!", "", 6000);},
      () => { 
        if(typeof this.lists == 'undefined'){
          this.lists = new Array(1);
          this.lists[0] = item;
          this.error = false;
          this.loading = false;
        }else{
          this.lists.push(item);
          this.loading = false;
        } 
      }            
    );
    }
  }


  archiveList(id:number) {
    this.setOverlay();
    this._dealflowService.archiveList("{\"id\":"+id+"}").subscribe(data => this.dealflow = data,
    error => {
      this.unsetOverlay();
      this.showError("Could not archive list, please try again!", "Error", 4000)}, 
      () =>{
        
        for(var i = 0; i < this.lists.length; i++){
          
          if(this.lists[i].id == id){
            if(typeof this.archived == 'undefined'){
              this.archived = new Array(1);
              this.archived[0] = this.lists[i];
              this.errorArchived = false;
            }else{
              this.archived.push(this.lists[i])
            }
            this.lists.splice(i,1);
          }
          this.unsetOverlay();

        }
      }
    );
  }

  unarchiveList(id:number) {
    //console.log("Remove "+id);
    this.setOverlay();
    this._dealflowService.unarchiveList("{\"id\":"+id+"}").subscribe(data => this.dealflow = data,
    error => {
      this.unsetOverlay();
      this.showError("Could not unarchive list, please try again!", "Error", 4000)},
      () =>{
        
        for(var i = 0; i < this.archived.length; i++){
          
          if(this.archived[i].id == id){
            this.lists.push(this.archived[i])
            this.archived.splice(i,1);
          }
          this.unsetOverlay();

        }
      }
    );
  }

  setOverlay(){
    this.overlay = {'background-color' : 'Black', 'opacity': '0.7', 'border-radius' : '7px'};
  }

  unsetOverlay(){
    this.overlay = {};
  }

/*   getPage(page: number) {
        this.loading = true;
        this.error = false;
        this.asyncLists = this._startupService.getVenturesPage(page, this.searchString)
            .do(res => {
                if(res.status == 204) {
                  this.loading = false;
                  this.error = true;
                  console.log("Search did not return any results.")                  
                } else {
                    this.total = res.count;
                    this.p = page;
                    this.loading = false;
                }
                
            })
            .map(res => res.data);
    }

    listSearch(event: any){
        this.searchString = event.target.value;
        if(this.searchString.length > 2){
            this.getPage(1);
        }
    }*/

}

@Pipe({
	name: "smArraySearch"
})
export class SearchArrayPipe implements PipeTransform {
	transform(list: Array<{}>, search: string): Array<{}> {
		if (!list || !search) {
			return list;
		}
    return list.filter((item: { listName: string}) => 
    (!!item.listName.toLowerCase().match(new RegExp(search.toLowerCase())))
    );
    
	}
}