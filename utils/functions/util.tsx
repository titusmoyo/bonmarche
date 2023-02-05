
import { PRODUCTMODEL } from '@models/model';

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

const luhnCheck = (val:string) => {
    val = val.replaceAll(" ","");
    let checksum = 0; // running checksum total
    let j = 1; // takes value of 1 or 2

    // Process each digit one by one starting from the last
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      // Extract the next digit and multiply by 1 or 2 on alternative digits.
      calc = Number(val.charAt(i)) * j;

      // If the result is in two digits add 1 to the checksum total
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }

      // Add the units element to the checksum total
      checksum = checksum + calc;

      // Switch the value of j
      if (j == 1) {
        j = 2;
      } else {
        j = 1;
      }
    }

    //Check if it is divisible by 10 or not.
    return (checksum % 10) == 0;
}



export const validateCardNumber = (num:string) => {
    //Check if the number contains only numeric value
    //and is of between 13 to 19 digits
    num = num.replaceAll(" ","");
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(num)){
        return false;
    }
    return luhnCheck(num);
}

/*  isCardValidSoFar  */
export const isCardValidSoFar = (num:string) => {
    //Check if the number contains only numeric value
    num=num.replaceAll(" ","");
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(num)){
        return false;
    }
    return true;
}

export const isCardExpired =(s:any)=> {
  s = formatExpiry(s);
  var b = s.split(/\D/);
  var d = new Date();
  var century = d.getFullYear()/100 | 0;
  // Generate date for first day of following month
  var expires = new Date(century + b[1], b[0], 1);
  return expires<d;
}

// Reformat date in m/yy format to mm-yy strict
function formatExpiry(s:any) {
  var b = s.split(/\D/);
  function z(n: number){return (n<10?'0':'') + +n}
  return z(b[0]) + '-' + z(b[1]);
}



// CVV_Number
export const isCVVValid=(CVV_Number:string)=>{
    // Regex to check valid
    // CVV_Number
    let regex = new RegExp(/^[0-9]{3,4}$/);

    // if CVV_Number
    // is empty return false
    if (CVV_Number == null) {
        return "false";
    }

    // Return true if the CVV_Number
    // matched the ReGex
    if (regex.test(CVV_Number) == true) {
        return true;
    }
    else {
        return false;
    }
}


export const filterProducts = (array:PRODUCTMODEL[], query:string) => {
  let result:PRODUCTMODEL[] = [];
  array.forEach(item => {
    const matches = Object.values(item).filter((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(query.toLowerCase());
      }
    });
    if (matches.length > 0) {
      result.push(item);
    }
  });
  return result;
};
