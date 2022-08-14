resultData = [];
var resultsWindow;

$(document).ready(function() {
	$("#resultsTab").css("width", ($("#rightSide").width() - 30)+"px");
	$("#runButtonWrapper").css("top", (window.innerHeight + $(window).scrollTop() - 433) + "px");
	
	$(window).resize(function(o) {
		$("#resultsTab").css("width", ($("#rightSide").width() - 30)+"px");
		$("#runButtonWrapper").css("top", (window.innerHeight + $(window).scrollTop() - 433) + "px");
	});
	
	$(document).scroll(function(o) {
		$("#runButtonWrapper").css("top", (window.innerHeight + $(window).scrollTop() - 433) + "px");
	});
	
	$("#M_slider").slider({
		value:1,
		min: 1,
		max: 2,
		step: 1,
		change: function( event, ui ) {
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
			$(newList).html('<ul></ul><input size="5" type="text" /><a class="itemAddButton" href="#">Добавить</a><a class="listClearButton" href="#">Очистить</a>');
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
	$("button#dataNewButton").button({icons: { primary: "ui-icon-document" }, text: false});
	$("button#dataLoadButton").button({icons: { primary: "ui-icon-folder-open" }, text: false});
	$("button#dataSaveButton").button({icons: { primary: "ui-icon-disk" }, text: false});
	$("button#dataDemoOneButton").button({icons: { primary: "ui-icon-script" }, text: false});
	$("button#dataDemoTwoButton").button({icons: { primary: "ui-icon-script" }, text: false});
	$("button#docsButton").button({icons: { primary: "ui-icon-help" }, text: false});
	
	$("input#datFile").change(function(e){
		document.forms["importData"].submit();
		$("input#datFile").val("");
	});
	
	/*$("#dataForm").on("submit", function(event) {
		event.preventDefault();
		
		loadingIcon(true);
		
		var inputsImage = $("#inputTab").clone();
		inputsImage.find(".pdfExclude").remove();
		inputsImage.find("span.ttIcon").each(function(i, o) {
			$(o).html($(o).attr("title"));
			$(o).css({
				"width": "auto",
				"background": "#ffffcc",
				"font-size": "11px"
			});
		});
		if($("#M_field").val() == "1") {
			inputsImage.find("span#M2Wrapper").remove();
		}
		inputsImage.find(".elementList").next().css("display", "inline-block");
		inputsImage.find(".elementList").remove();
		inputsImage.find(".ui-slider").remove();
		inputsImage.find("img").each(function(i, o) {
			$(o).attr("src", "http://www.simumath.net/tools/hydra/"+$(o).attr("src"));
			$(o).css("vertical-align", "middle");
		});
		inputsImage.find("input[type='text']").each(function(i, o) {
			var thisVal = $(o).val();
			$('<span style="border:1px solid gray;"><b>'+thisVal+'</b></span>').insertAfter(o);
			$(o).remove();
		});
		inputsImage = inputsImage.html();
		
		thisTime = Date.now();
		
		$("#M_field").prop('disabled', false);
		$.ajax({
			type: "POST",
			url: "ajaxHYDRA.php",
			dataType: "json",
			data: $(this).serializeArray()
		})
		.done(function(data) {
			$.ajax({
				type: "POST",
				url: "hydraOutput.php",
				dataType: "html",
				data: {
					d: encodeURI(JSON.stringify(data)),
					i: inputsImage,
					time: thisTime
				}
			})
			.done(function(data) {
				showResults($(data).find("span.data-title").html(), data, "results", thisTime);
				//$("#hydraResults-"+time).dialog( "option", "title", $(data).find("span.data-title").html());
				//$("#hydraResults-"+time).find("span.data-title").remove();
				
				$("#resultTabs-"+thisTime).tabs().css("width", "948px");
				$("div.tab-div").css("padding", "1em 10px");
				//resultsWindow = window.open("", 'hydraResults', 'width=1024, height=800');
				//resultsWindow.document.body.innerHTML = "";
				//resultsWindow.document.write(data);
				
				loadingIcon(false);
			});
		});
		$("#M_field").prop('disabled', true);
	});*/
	
	afterImportDataSubmit();
	
	window.gValuesArray = [];
	window.gTitlesArray = [];
	
	$("a.printButton").button({icons: { primary: "ui-icon-print" }, text: false});
});

function showResults(title, content, type, time) {
	if(type == "chart") {
		if($("#hydraChart-"+time).length > 0) {
			$("#hydraChart-"+time).dialog("close");
			$("#hydraChart-"+time).remove();
		}
	}
	
	var newDialog = document.createElement("div");
	$(newDialog).attr("id", type == "results" ? "hydraResults-"+time : "hydraChart-"+time);
	$(newDialog).attr("title", title);
	$(newDialog).addClass(type+"-"+time);
	$(newDialog).append(content);
	
	var thisButtons =  [{text: "Закрыть",
		icons: { primary: "ui-icon-check" },
		click: function() {
			$(this).dialog("close");
		}
	}];
	if(type == "chart") {
		thisButtons.unshift({text: "Распечатать",
			icons: { primary: "ui-icon-print" },
			click: function() {
				loadingIcon(true);
				
				tabNum = $("#chartWrapper-"+time).attr("tabNum");
				console.log($("#chartWrapper-"+time).attr("tabNum"));
				
				valuesArray = [];
				titlesArray = [];
				if($("div.hydraResults-"+time+" input.TAB"+tabNum+"_0:checked").length > 0) {
					$("div.hydraResults-"+time+" input.TAB"+tabNum+"_0:checked").each(function(i, o) {
						valuesArray.push($(o).attr("points"));
						if($(o).attr("pointsTwo") != "[]") {
							valuesArray.push($(o).attr("pointsTwo"));
						}
						
						colNum = $(o).attr("id").substring(7);
						if($(o).attr("pointsTwo") != "[]") {
							titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).text()+" (I),,");
							titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).text()+" (II),,");
						}
						else {
							titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).text()+",,");
						}
					});
					titlesArray[titlesArray.length-1] = titlesArray[titlesArray.length-1].substring(0, titlesArray[titlesArray.length-1].length-3);
					
					window.open("http://www.simumath.net/tools/utils/printChart.php?values="+btoa(valuesArray.toString())+"&titles="+encodeURIComponent(titlesArray.toString())+"&time="+btoa(time), "_blank");
				}
				loadingIcon(false);
			}
		});
	}
	
	$(newDialog).dialog({
		draggable: true,
		resizable: false,
		width: type == "results" ? 1024 : 800,
		closeOnEscape: false,
		closeText: "Закрыть",
		position: {my: "center top+2%", at: "center top+2%", of: "body"},
		buttons:thisButtons
	}).dialog("widget").draggable("option", "containment", "none");
}

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

function fillOutput(resultData, time) {
	graphArrayOne = [];
	graphArrayTwo = [];
	
	$("div.hydraResults-"+time+" div#resultsTab div.ui-widget-content").css("display", "inline-block");
			
	if(resultData[4]["KAV"] != "0") {
		if(typeof resultData[0] != 'undefined') {
			for(var i = 0; i < resultData[0].length; i++) {
				$("div.hydraResults-"+time+" div.KAV_0 span:eq("+i+")").html(repAll(resultData[0][i], "\n", "<br/>"));
			}
			$("div.hydraResults-"+time+" div.KAV_0").css("display", "block");
		}
	}
	else {
		$("div.hydraResults-"+time+" div.KAV_0").css("display", "none");
	}
	
	if(typeof resultData[1] != 'undefined') {
		var thisM = resultData[4]["M"];
		$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:not(:last)").remove();
		var cellsCount = $(".TAB1_0.NSW.M_1:last td").length;
		
		graphArrayOne[1] = [];
		graphArrayTwo[1] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArrayOne[1].push([]);
			graphArrayTwo[1].push([]);
		}
		
		for(var i = 0; i <= resultData[4]["NSW"]; i++) {
			$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last").clone().insertAfter("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last");
			for(var v = 0; v < cellsCount; v++) {
				$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last td:eq("+v+")").html(repAll(resultData[1][i][v], "\n", "<br/>"));
				graphArrayOne[1][v].push(deformat( resultData[1][i][v].split("\n")[0] ));
				if(resultData[1][i][v].split("\n").length > 1) {
					graphArrayTwo[1][v].push(deformat( resultData[1][i][v].split("\n")[1] ));
				}
			}
		}
		
		$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last").clone().insertAfter("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last");
		for(var v = 0; v < cellsCount; v++) {
			$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:last td:eq("+v+")").html('<input title="показать на графике" id="TAB1_cb'+(v+1)+'" class="TAB1_0" type="checkbox" points="['+graphArrayOne[1][v]+']" pointsTwo="['+graphArrayTwo[1][v]+']" />');
		}
		
		$("div.hydraResults-"+time+" .TAB1_0.NSW.M_1:first").remove();
		$("div.hydraResults-"+time+" .TAB1_0").css("display", "block");
		$("div.hydraResults-"+time+" tr.TAB1_0").css("display", "table-row");
		
		tIndex = 1;
		$("div.hydraResults-"+time+" tr.TAB1_0").each(function(i,o) {
			if(i < $("div.hydraResults-"+time+" tr.TAB1_0").length-1) {
				if($(o).hasClass("NSW")) {
					$(o).prepend("<td>"+tIndex+"</td>");
					tIndex++;
				}
				else {
					$(o).prepend("<th></th>");
				}
			}
			else {
				$(o).prepend("<td></td>");
			}
		});
	}
	
	if(typeof resultData[2] != 'undefined') {
		$("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:not(:last)").remove();
		var cellsCount = $("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:last td").length;
		
		graphArrayOne[2] = [];
		graphArrayTwo[2] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArrayOne[2].push([]);
			graphArrayTwo[2].push([]);
		}
		
		for(var i = 0; i <= resultData[4]["NSW"]; i++) {
			$("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:last").clone().insertAfter("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:last");
			for(var v = 0; v < cellsCount; v++) {
				$("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:last td:eq("+v+")").html(repAll(resultData[2][i][v], "\n", "<br/>"));
				graphArrayOne[2][v].push(deformat(resultData[2][i][v].split("\n")[0]));
				if(resultData[2][i][v].split("\n").length > 1) {
					graphArrayTwo[2][v].push(deformat( resultData[2][i][v].split("\n")[1] ));
				}
			}
		}
		
		$("div.hydraResults-"+time+" .TAB2_0.NSW.M_"+thisM+":last").clone().insertAfter("div.hydraResults-"+time+" .TAB2_0.NSW.M_"+thisM+":last");
		for(var v = 0; v < cellsCount; v++) {
			$("div.hydraResults-"+time+" .TAB2_0.NSW.M_"+thisM+":last td:eq("+v+")").html('<input title="показать на графике" id="TAB2_cb'+(v+1)+'" class="TAB2_0" type="checkbox" points="['+graphArrayOne[2][v]+']" pointsTwo="['+graphArrayTwo[2][v]+']" />');
		}
		
		$("div.hydraResults-"+time+" .TAB2_0.NSW.M_1:first").remove();
		$("div.hydraResults-"+time+" .TAB2_0").css("display", "block");
		$("div.hydraResults-"+time+" tr.TAB2_0").css("display", "table-row");
		
		tIndex = 1;
		$("div.hydraResults-"+time+" tr.TAB2_0").each(function(i,o) {
			if(i < $("div.hydraResults-"+time+" tr.TAB2_0").length-1) {
				if($(o).hasClass("NSW")) {
					$(o).prepend("<td>"+tIndex+"</td>");
					tIndex++;
				}
				else {
					$(o).prepend("<th></th>");
				}
			}
			else {
				$(o).prepend("<td></td>");
			}
		});
	}
	
	if(typeof resultData[3] != 'undefined') {
		$("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:not(:last)").remove();
		var cellsCount = $("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:last td").length;
		
		graphArrayOne[3] = [];
		graphArrayTwo[3] = [];
		for(var g = 0; g < cellsCount; g++) {
			graphArrayOne[3].push([]);
			graphArrayTwo[3].push([]);
		}
		
		for(var i = 0; i <= resultData[4]["NSW"]; i++) {
			$("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:last").clone().insertAfter("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:last");
			for(var v = 0; v < cellsCount; v++) {
				$("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:last td:eq("+v+")").html(repAll(resultData[3][i][v], "\n", "<br/>"));
				graphArrayOne[3][v].push(deformat(resultData[3][i][v].split("\n")[0]));
				if(resultData[3][i][v].split("\n").length > 1) {
					graphArrayTwo[3][v].push(deformat( resultData[3][i][v].split("\n")[1] ));
				}
			}
		}
		
		$("div.hydraResults-"+time+" .TAB3_0.NSW.M_"+thisM+":last").clone().insertAfter("div.hydraResults-"+time+" .TAB3_0.NSW.M_"+thisM+":last");
		for(var v = 0; v < cellsCount; v++) {
			$("div.hydraResults-"+time+" .TAB3_0.NSW.M_"+thisM+":last td:eq("+v+")").html('<input title="показать на графике" id="TAB3_cb'+(v+1)+'" class="TAB3_0" type="checkbox" points="['+graphArrayOne[3][v]+']" pointsTwo="['+graphArrayTwo[3][v]+']" />');
		}
		
		$("div.hydraResults-"+time+" .TAB3_0.NSW.M_2:first").remove();
		$("div.hydraResults-"+time+" .TAB3_0").css("display", "block");
		$("div.hydraResults-"+time+" tr.TAB3_0").css("display", "table-row");
		
		tIndex = 1;
		$("div.hydraResults-"+time+" tr.TAB3_0").each(function(i,o) {
			if(i < $("div.hydraResults-"+time+" tr.TAB3_0").length-1) {
				if($(o).hasClass("NSW")) {
					$(o).prepend("<td>"+tIndex+"</td>");
					tIndex++;
				}
				else {
					$(o).prepend("<th></th>");
				}
			}
			else {
				$(o).prepend("<td></td>");
			}
		});
	}
}

function createPDF(obj) {
	var page = document.documentElement.innerHTML;
	resultsWindow = window.open("http://www.simumath.net/tools/utils/pdf.php?c="+btoa(page), 'hydraPDF', 'width=1024, height=800');
	
	return false;
}

function showGraph(tabNum, time) {
	console.log("div.hydraResults-"+time+" input.TAB"+tabNum+"_0:checked");
	loadingIcon(true);
	
	valuesArray = [];
	titlesArray = [];
	if($("div.hydraResults-"+time+" input.TAB"+tabNum+"_0:checked").length > 0) {
		$("div.hydraResults-"+time+" input.TAB"+tabNum+"_0:checked").each(function(i, o) {
			valuesArray.push($(o).attr("points"));
			if($(o).attr("pointsTwo") != "[]") {
				valuesArray.push($(o).attr("pointsTwo"));
			}
			
			colNum = $(o).attr("id").substring(7);
			if($(o).attr("pointsTwo") != "[]") {
				titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).attr("gTitle")+" (I)");
				titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).attr("gTitle")+" (II)");
			}
			else {
				titlesArray.push($(o).closest("table").find("th.colTitle_"+colNum).attr("gTitle"));
			}
		});
		
		$.ajax({
			type: "POST",
			url: "hydraChart.php",
			dataType: "html",
			data: {
				values: valuesArray.toString(),
				titles: titlesArray,
				time: time,
				tabNum: tabNum
			}
		})
		.done(function(data) {
			showResults("График", data, "chart", time);
			//console.log(eval("gValuesArray_"+time));
			eval("chartRedraw_"+time+"("+time+");");
			
			//resultsWindow = window.open("", 'hydraChart', 'width=1024, height=800');
			//resultsWindow.document.body.innerHTML = "";
			//resultsWindow.document.write(data);
			
			loadingIcon(false);
		});
	}
}

function exportData() {
	var thisFile = window.prompt("Пожалуйста, назовите файл", "inputData");
	if (thisFile != null) {
		$("#exportData input[type='hidden']").remove();
		$("#exportData").append('<input type="hidden" name="newFilename" id="newFilename" value="'+thisFile+'" />');
		
		var dataFieldsStr = "";
		$("#dataForm input").each(function(i, o) {
			dataFieldsStr += "<input type=\"hidden\" name=\""+$(o).attr("name")+"\" value=\""+$(o).val()+"\" />";
		});
		$("#exportData").append(dataFieldsStr);
		
		document.forms["exportData"].submit();
	}
}

function afterImportDataSubmit() {
	$("#importReadFrame").load(function(event) {
		var fileData = $("#importReadFrame").contents().find("body").text();
		
		dataArray = fileData.split("\n");
		for(var i = 0; i < dataArray.length; i++) {
			thisPart = dataArray[i].split(" = ");
			if($("#dataForm input[name='"+thisPart[0]+"']").length > 0 || $("#dataForm input[name='"+thisPart[0]+"[]']").length > 0) {
				if($("#dataForm input[name='"+thisPart[0]+"']").hasClass("multi-value-field")) {
					//Variable is a multi value field.
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
						
						$("#dataForm input[name='"+thisPart[0]+"']").val(thisPart[1]);
					}
				}
				else if(thisPart[1].startsWith("[") && thisPart[1].endsWith("]")) {
					//Variable is an array.
					thisArray = JSON.parse(thisPart[1]);
					$("#dataForm input[name='"+thisPart[0]+"[]']").each(function(i, o) {
						console.log(thisPart[0]+" = "+thisArray[i]);
						$(o).val(thisArray[i]);
					});
				}
				else {
					//Variable is single.
					$("#dataForm input[name='"+thisPart[0]+"']").val(thisPart[1]);
				}
			}
		}
		
		$("#M_slider").slider("option", "value", $("#M_field").val());
		$("#M_slider").change();
		
	});
}

function resetData() {
	$("#dataForm input[type='text']:not([readonly])").val('');
	$("a.elemListDelButton").click();
}

function scrollToTop() {
	$("#leftSide").scrollTop(0);
	return false;
}

function deformat(strNum) {
	return strNum.replace(",", "");
}

function loadingIcon(sw) {
	switch(sw) {
		case true:
			$("div#loadingIcon").remove();
			var newLI = document.createElement("div");
			$(newLI).attr("id", "loadingIcon");
			$("body").append(newLI);
		break;
		case false:
			$("div#loadingIcon").remove();
		break;
	}
}

function repAll(string, oSub, nSub) {
	newStr = string;
	while(newStr.indexOf(oSub) > -1) {
		newStr = newStr.replace(oSub, nSub);
	}
	return newStr;
}