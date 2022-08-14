resultData = [];
var resultsWindow;

$(document).ready(function() {
	$("#resultsTab").css("width", ($("#rightSide").width() - 30)+"px");
	$("#runButtonWrapper").css("top", ($("#leftSide").scrollTop() + $(window).innerHeight() -58) + "px");
	
	$(window).resize(function(o) {
		$("#resultsTab").css("width", ($("#rightSide").width() - 30)+"px");
		$("#runButtonWrapper").css("top", ($("#leftSide").scrollTop() + $(window).innerHeight() -58) + "px");
	});
	
	$("#leftSide").scroll(function(o) {
		$("#runButtonWrapper").css("top", ($("#leftSide").scrollTop() + $(window).innerHeight() -58) + "px");
	});
	
	$("#M_slider").slider({
		value:1,
		min: 1,
		max: 2,
		step: 1,
		slide: function( event, ui ) {
			$("#M_field").val(ui.value);
			
			if(ui.value == 2) {
				$("#M2Wrapper").css("display", "inline");
			}
			else {
				$("#M2Wrapper").css("display", "none");
			}
		}
	}).css({
		"width": "40px",
		"height": "10px",
		"border": "1px solid gray"
	});
	$("#M_field").val($("#M_slider").slider("value"));
	
	$("input#runButton").button();
	$("input#runButton").button();
	$("a#jumpToTopButton").button({icons: { primary: "ui-icon-arrowthickstop-1-n" }, text: false});
	
	$(document).tooltip({tooltipClass: "ttWindow"});
	
	//Build sortable multivalue fields
	$(".multi-value-field").each(function(i, o) {
		var newList = document.createElement("div");
			$(newList).addClass("elementList")
			$(newList).html('<ul></ul><input size="5" type="text" /><a class="itemAddButton" href="#">Add</a><a class="listClearButton" href="#">Clear</a>');
		$(newList).insertBefore($(o));
		
		$(newList).find("a.itemAddButton").button({icons: { primary: "ui-icon-plusthick" }, text: false})
		.addClass("elemListButton").click(function() {
			var newValue = $(this).parent().find("input").val();
			if(!isNaN(parseFloat(newValue))) {
				$(this).parent().find("ul").append('<li class="ui-state-default">'+parseFloat(newValue)+' <a style="display:none;" onclick="removeItem(this);"></a></li>');
				$(this).parent().find("li:last a").button({icons: { primary: "ui-icon-close" }, text: false})
				.addClass("elemListDelButton");
				
				$(this).parent().find("li:last").mouseenter(function() {
					$(this).find("a").css("display", "inline-block");
				});
				$(this).parent().find("li:last").mouseleave(function() {
					$(this).find("a").css("display", "none");
				});
				
				rebuildMultivalField($(this).parent().find("ul"));
				$(this).parent().find("input").val("");
			}
			
			return false;
		});
		
		$(newList).find("a.listClearButton").button({icons: { primary: "ui-icon-trash" }, text: false})
		.addClass("elemListClear").click(function() {
			$(this).parent().find("ul li a").click();
			rebuildMultivalField($(this).parent().find("ul"));
			$(this).parent().find("input").val("");
			
			return false;
		});
		
		//Create Initial values
		if($(o).val() != "") {
			var initVals = $(o).val().split(", ");
			thisButton = $(newList).find("a");
			for(initValKey in initVals) {
				thisButton.parent().find("ul").append('<li class="ui-state-default">'+parseFloat(initVals[initValKey])+' <a style="display:none;" onclick="removeItem(this);"></a></li>');
				thisButton.parent().find("li:last a").button({icons: { primary: "ui-icon-close" }, text: false})
				.addClass("elemListDelButton");
				
				thisButton.parent().find("li:last").mouseenter(function() {
					$(this).find("a").css("display", "inline-block");
				});
				thisButton.parent().find("li:last").mouseleave(function() {
					$(this).find("a").css("display", "none");
				});
			}
		}
		$(o).css("display", "none");
	});
	$("div.elementList ul").sortable({
		placeholder: "ui-state-highlight sortingPlaceholder",
		stop: function(event, ui) {
			//if(sortableOut) {
			//	$(ui.item).find("a").click();
			//}
			rebuildMultivalField($(this));
		},
		cursorAt: {top: 10, left: 20}
	})
	$("div.elementList ul").disableSelection();
	
	$("div.elementList input").keydown(function(event) {
		//if($.inArray(event.keyCode, [48,49,50,51,52,53,54,55,56,57,173,190,110,96,97,98,99,100,101,102,103,104,105,109,144,13,8]) != -1) {
			if(event.keyCode == 13) {
				$(this).parent().find("a.itemAddButton").click();
				event.preventDefault();
			}
			return;
		//}
		//else {
		//	event.preventDefault();
		//}
    });
	
	//Toolbar buttons
	$("button#dataLoadButton").button({icons: { primary: "ui-icon-folder-open" }, text: false});
	$("button#dataSaveButton").button({icons: { primary: "ui-icon-disk" }, text: false});
	$("button#dataClearButton").button({icons: { primary: "ui-icon-trash" }, text: false});
	
	$("input#datFile").change(function(e){
		document.forms["importData"].submit();
		$("input#datFile").val("");
	});
	
	$("#dataForm").on("submit", function(event) {
		event.preventDefault();
		
		var inputsImage = $("body").clone();
		inputsImage.find(".pdfExclude").remove();
		inputsImage.find(".elementList").next().css("display", "inline-block");
		inputsImage.find(".elementList").remove();
		inputsImage.find(".ui-slider").remove();
		inputsImage.find("img").each(function(i, o) {
			$(o).attr("src", "http://guard:44444/php/DRAWN/"+$(o).attr("src"));
			$(o).css("vertical-align", "middle");
		});
		inputsImage.find("input[type='text']").each(function(i, o) {
			var thisVal = $(o).val();
			$('<span style="border:1px solid gray;"><b>'+thisVal+'</b></span>').insertAfter(o);
			$(o).remove();
		});
		inputsImage = inputsImage.html();
		
		$("#M_field").prop('disabled', false);
		$.ajax({
			type: "POST",
			url: "ajaxDRAWN.php",
			dataType: "json",
			data: $(this).serializeArray()
		})
		.done(function(data) {
			$.ajax({
				type: "POST",
				url: "drawnOutput.php",
				dataType: "html",
				data: {
					d: encodeURI(JSON.stringify(data)),
					i: inputsImage
				}
			})
			.done(function(data) {
				resultsWindow = window.open("", 'drawnResults', 'width=1024, height=800');
				resultsWindow.document.body.innerHTML = "";
				resultsWindow.document.write(data);
			});
		});
		$("#M_field").prop('disabled', true);
	});
	
	afterImportDataSubmit();
});

function removeItem(link) {
	var theList = $(link).closest("ul");
	$(link).parent().remove();
	rebuildMultivalField(theList);
	
	return false;
}

function rebuildMultivalField(ulElem) {
	ulElem.parent().next().val("");
	
	var newStrVal = "";
	ulElem.find("li").each(function(i,o) {
		newStrVal += $(o).text().trim() + ", ";
	});
	
	newStrVal = newStrVal.substring(0, newStrVal.length-2);
	ulElem.parent().next().val(newStrVal);
	
	//console.log(newStrVal);
}

function fillOutput(resultData) {
	graphArray = [];
	
	$("div#resultsTab div.ui-widget-content").css("display", "inline-block");
			
	if(resultData[4]["KAV"] != "0") {
		if(typeof resultData[0] != 'undefined') {
			for(var i = 0; i < resultData[0].length; i++) {
				$("div.KAV_0 span:eq("+i+")").html(resultData[0][i]);
			}
			$("div.KAV_0").css("display", "block");
		}
	}
	else {
		$("div.KAV_0").css("display", "none");
	}
	
	if(typeof resultData[1] != 'undefined') {
		var thisM = resultData[4]["M"];
		$(".TAB1_0.NSW.M_"+thisM+":not(:last)").remove();
		var cellsCount = $(".TAB1_0.NSW.M_"+thisM+":last td").length;
		
		graphArray[1] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArray[1].push([]);
		}
		
		for(var i = 0; i < resultData[4]["NSW"]; i++) {
			$(".TAB1_0.NSW.M_"+thisM+":last").clone().insertAfter(".TAB1_0.NSW.M_"+thisM+":last");
			for(var v = 0; v < cellsCount; v++) {
				$(".TAB1_0.NSW.M_"+thisM+":last td:eq("+v+")").html(resultData[1][i][v]);
				graphArray[1][v].push(deformat(resultData[1][i][v]));
			}
		}
		
		$(".TAB1_0.NSW.M_"+thisM+":last").clone().insertAfter(".TAB1_0.NSW.M_"+thisM+":last");
		for(var v = 0; v < cellsCount; v++) {
			$(".TAB1_0.NSW.M_"+thisM+":last td:eq("+v+")").html('<input title="Show in chart" id="TAB1_cb'+(v+1)+'" class="TAB1_0" type="checkbox" points="['+graphArray[1][v]+']" />');
		}
		
		$(".TAB1_0.NSW.M_"+thisM+":first").remove();
		$(".TAB1_0").css("display", "block");
		$("tr.TAB1_0").css("display", "table-row");
	}
	
	if(typeof resultData[2] != 'undefined') {
		$(".TAB2_0.NSW.M_1:not(:last)").remove();
		var cellsCount = $(".TAB2_0.NSW.M_1:last td").length;
		
		graphArray[2] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArray[2].push([]);
		}
		
		for(var i = 0; i < resultData[4]["NSW"]; i++) {
			$(".TAB2_0.NSW.M_1:last").clone().insertAfter(".TAB2_0.NSW.M_1:last");
			for(var v = 0; v < cellsCount; v++) {
				$(".TAB2_0.NSW.M_1:last td:eq("+v+")").html(resultData[2][i][v]);
				graphArray[2][v].push(deformat(resultData[2][i][v]));
			}
		}
		
		$(".TAB2_0.NSW.M_"+thisM+":last").clone().insertAfter(".TAB2_0.NSW.M_"+thisM+":last");
		for(var v = 0; v < cellsCount; v++) {
			$(".TAB2_0.NSW.M_"+thisM+":last td:eq("+v+")").html('<input title="Show in chart" id="TAB2_cb'+(v+1)+'" class="TAB2_0" type="checkbox" points="['+graphArray[1][v]+']" />');
		}
		
		$(".TAB2_0.NSW.M_1:first").remove();
		$(".TAB2_0").css("display", "block");
		$("tr.TAB2_0").css("display", "table-row");
	}
	
	if(typeof resultData[3] != 'undefined') {
		$(".TAB3_0.NSW.M_2:not(:last)").remove();
		var cellsCount = $(".TAB3_0.NSW.M_2:last td").length;
		
		graphArray[3] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArray[3].push([]);
		}
		
		for(var i = 0; i < resultData[4]["NSW"]; i++) {
			$(".TAB3_0.NSW.M_2:last").clone().insertAfter(".TAB3_0.NSW.M_2:last");
			for(var v = 0; v < cellsCount; v++) {
				$(".TAB3_0.NSW.M_2:last td:eq("+v+")").html(resultData[3][i][v]);
				graphArray[3][v].push(deformat(resultData[3][i][v]));
			}
		}
		
		$(".TAB3_0.NSW.M_"+thisM+":last").clone().insertAfter(".TAB3_0.NSW.M_"+thisM+":last");
		for(var v = 0; v < cellsCount; v++) {
			$(".TAB3_0.NSW.M_"+thisM+":last td:eq("+v+")").html('<input title="Show in chart" id="TAB3_cb'+(v+1)+'" class="TAB3_0" type="checkbox" points="['+graphArray[1][v]+']" />');
		}
		
		$(".TAB3_0.NSW.M_2:first").remove();
		$(".TAB3_0").css("display", "block");
		$("tr.TAB3_0").css("display", "table-row");
	}
}

function createPDF(obj) {
	var page = document.documentElement.innerHTML;
	resultsWindow = window.open("../tools/pdf.php?c="+btoa(page), 'drawnPDF', 'width=1024, height=800');
	
	return false;
}

function showGraph(tabNum) {
	valuesArray = [];
	titlesArray = [];
	if($("input.TAB"+tabNum+"_0:checked").length > 0) {
		$("input.TAB"+tabNum+"_0:checked").each(function(i, o) {
			valuesArray.push($(o).attr("points"));
			
			colNum = $(o).attr("id").substring(7);
			titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).text());
		});
		
		$.ajax({
			type: "POST",
			url: "drawnChart.php",
			dataType: "html",
			data: {
				values: valuesArray.toString(),
				titles: titlesArray
			}
		})
		.done(function(data) {
			resultsWindow = window.open("", 'drawnChart', 'width=1024, height=800');
			resultsWindow.document.body.innerHTML = "";
			resultsWindow.document.write(data);
		});
	}
}

function exportData() {
	$("#exportData input[type='hidden']").remove();
	
	var dataFieldsStr = "";
	$("#dataForm input").each(function(i, o) {
		dataFieldsStr += "<input type=\"hidden\" name=\""+$(o).attr("name")+"\" value=\""+$(o).val()+"\" />";
	});
	$("#exportData").append(dataFieldsStr);
}

function afterImportDataSubmit() {
	$("#importReadFrame").load(function(event) {
		var fileData = $("#importReadFrame").contents().find("body").text();
		
		dataArray = fileData.split("\n");
		for(var i = 0; i < dataArray.length; i++) {
			thisPart = dataArray[i].split(" = ");
			if($("#dataForm input[name='"+thisPart[0]+"']").length > 0) {
				if($("#dataForm input[name='"+thisPart[0]+"']").hasClass("multi-value-field")) {
					if(thisPart[1] != "") {
						var initVals = thisPart[1].split(", ");
						$("#dataForm input[name='"+thisPart[0]+"']").prev().find("ul li a").click();
						var thisButton = $("#dataForm input[name='"+thisPart[0]+"']").prev().find("a.itemAddButton");
						for(initValKey in initVals) { 
							thisButton.parent().find("ul").append('<li class="ui-state-default">'+parseFloat(initVals[initValKey])+' <a style="display:none;" onclick="removeItem(this);"></a></li>');
							thisButton.parent().find("li:last a").button({icons: { primary: "ui-icon-close" }, text: false})
							.addClass("elemListDelButton");
							
							thisButton.parent().find("li:last").mouseenter(function() {
								$(this).find("a").css("display", "inline-block");
							});
							thisButton.parent().find("li:last").mouseleave(function() {
								$(this).find("a").css("display", "none");
							});
						}
					}
				}
				else {
					$("#dataForm input[name='"+thisPart[0]+"']").val(thisPart[1]);
				}
			}
		}
	});
}

function resetData() {
	$("#dataForm input[type='text']").val('');
	$("a.elemListDelButton").click();
}

function scrollToTop() {
	$("#leftSide").scrollTop(0);
	return false;
}

function deformat(strNum) {
	return strNum.replace(",", "");
}