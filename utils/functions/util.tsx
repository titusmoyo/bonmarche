

/*
  returns the file size in MB
  input : sizeInBytes
*/
export const getFileSizeMb=(sizeInBytes:number):number=>{
  let result:number = Number((sizeInBytes / (1024*1024)).toFixed(2));
  return result;
}


/**
 * Checks if the file is an image
 *
 */
export const isThisAnImage=(fileName: string,exts: any[])=>{
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}
