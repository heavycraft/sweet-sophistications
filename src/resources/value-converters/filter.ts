export class FilterValueConverter {
  toView(array: {}[], property: string, exp: string | string[]) {

    if (array === undefined || array === null || property === undefined || exp === undefined) {
      return array;
    }
    return array.filter((item) => {
      
      switch(typeof item[property]) {
        case 'number':
        case 'boolean':
          return item[property] === exp;
        case 'string':
          if(Array.isArray(exp)) {
            return exp.filter( x => item[property].toLowerCase().indexOf(x.toLowerCase()) > -1)[0];
          } else {
            return item[property].toLowerCase().indexOf(exp.toLowerCase()) > -1;
          }
          
        case 'object':
          if(Array.isArray(item[property])) {
            if(Array.isArray(exp)) {
              return exp.filter( x => item[property].map( i => i.toLowerCase()).indexOf(x.toLowerCase()) > -1)[0];
            } else {
              return item[property].indexOf(exp.toLowerCase()) > -1;
            }
          }
        default:
          return false;
      }

    });
  }
}

