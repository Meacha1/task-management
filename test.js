function simulate(entries) {
    // Write your code here
    let newArr = [];
    
    for (let i = 0; i < entries.length; i++) {
      let X = entries[i];
      let Tr = X - 1;
      let Tl = X - 1;
      if (i + 4 <= entries.length - 1) {
        Tr = entries[i + 4];
      }
       if(i - 3 >= 0) {
         Tl = entries[i - 3];
       }
      
      if (X <= Tr || X <= Tl) {
        newArr.push(0);
        continue;
      }
      
       newArr.push(X);
    }
    
    return newArr;
  }

  const records = [1, 2, 0, 5, 0, 2, 4, 3, 3, 3];
console.log(simulate(records));
// Expected output
// [1, 0, 0, 5, 0, 0, 0, 3, 3, 0]