export interface IUser{
    email:String;
    displayName:String;
    image:String;
     }
 
 export class User implements IUser{
     public email:String;
     public displayName:String;
     public image:String;
     constructor( email:String,displayName:String,image:String){
         this.email=email;
         this.displayName=displayName;
         this.image=image;
     }
 }