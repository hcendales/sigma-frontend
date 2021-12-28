

export function distinct(array:any[],objectKey:any){
   let c:any[] = [];
   array.forEach((v:any,i:number,a:any)=>{
      c.push(v[objectKey]);
   });
   return c.filter((x, i, a) => {
     return a.indexOf(x) == i
   })
}
