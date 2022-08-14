inputArray = []
res = ""
$("input[type='text']").each(function(i, o) {
	if(inputArray.indexOf($(o).attr("name")) == -1) {
		inputArray.push($(o).attr("name"));
	}
});

for(i = 0; i < inputArray.length; i++) {
	if($("input[name='"+inputArray[i]+"']").length > 1) {
		valString = "[";
		$("input[name='"+inputArray[i]+"']").each(function(i, o) {
			valString += "\""+$(o).val()+"\","
		});
		valString = valString.substring(0, valString.length-1) + "]";
		res += (inputArray[i].replace("[]", "") + " = " + valString) + "\n";
	}
	else {
		res += (inputArray[i] + " = " + $("input[name='"+inputArray[i]+"']").val()) + "\n";
	}
}

console.log(res);