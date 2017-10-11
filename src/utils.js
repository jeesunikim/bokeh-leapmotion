export var getRandom = function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export var ParseToNum = function ParseToNum(str1, str2) {
	let combined;

	if(str2) {
		combined = parseFloat(str1) + parseFloat(str2); 
	}else{
		combined = parseFloat(str1);
	}
	return combined.toFixed(1);	
}

export var checkIfExists = function checkIfExists(id, arr) {
   let isExist = arr.some((el) => {
      return el.options.id === id;
   });
   return isExist;
}

export var concatData = function concatData(id, data) {
	return id + ": " + data + "<br>";	
}

export var addClass = function(el, className){
    if (el.classList) {
        el.classList.add(className);
    }else {
        el.className += ' ' + className;
    }
};