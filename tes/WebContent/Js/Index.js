/*  Method Name : $(document).bind("mobileinit", function());
 *  Uses for prvent default transaction for Mobile page .
 *
 *
 * */
$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = "none"
		$.mobile.defaultDialogTransition = 'none';
	$.mobile.useFastClick = true;
	$.mobile.touchOverflowEnabled = true;

});
//This is the url
//var dynaurl = "http://client.zolipe.com/flirtlife";// global url declaration
var dynaurl = "http://flirtlife.sourceedge.co.in/flirtlife_new";
/*  Method Name : $(document).ready();
 *  Parameter : None
 * uses for - At the Time of loading page. this method call .
 *
 *
 * */
$(document).ready(function() {
	//localStorage.clear();
	// popup close -
	$('#popupBoxClose').click(function() {
		unloadPopupBox();
	});
	$('#con').click(function() {
		unloadPopupBox();
	});

	$("#alnkProfile").bind("click",function(){//click event for profile link
		window.location="Profile_View.html";
	});
	$("#alnkMail").bind("click",function(){// click event for mailview link
		window.location="Mail_View.html";
	});
	$("#alnkBuddyLst").bind("click",function(){// click event for buddy list link
		window.location="BuddyList.html";
	});
	$("#alnksearch").bind("click",function(){// click event for search link
		window.location="Search.html";
	});
	$("#alnkLSearch").bind("click",function(){// click event for Location based flirt event
		window.location="LocationBasedFlirt.html";
	});
	$("#alnkTicker").bind("click",function(){// click event for ticker link
		window.location="Ticker.html";
	});
	$("#alnkUsrStatus").bind("click",function(){// click event for user status link.
		window.location="UserStatus.html";
	});
	$("#alnkPVisitor").bind("click",function(){// click event for profile visitors link
		window.location="PVisitor.html";
	});
	$("#alnkTag").bind("click",function(){// click event for tag link
		window.location="Tags.html";
	});
	$("#alnkNotice").bind("click",function(){ // click event for Notice link
		window.location="Notice.html";
	});

	$('#sideNav').addClass('ui-panel-closed');
	$('#sideNav').removeClass('ui-panel-open');
	/*
	 *  Method Name :tooltipster()
	 *  Parameter: Optional fileds
	 *
	 * */
	$('.notif-tooltip').tooltipster({
		animation : 'fade',
		content : 'Loading...',
		arrowColor : '#FFFFFF',
		position : 'bottom',
		theme : '.tooltipster-custom',
		trigger : 'click',
		interactive : true,
		interactiveHoverClose : false,
		updateAnimation : false,
		functionBefore : function(origin,continueTooltip) {
			var userid = localStorage.getItem("userid");// get the login user id from localstorage
			var tooltiplist = "";// used for contain all the notifiations
			var tooltipcount = "";// for notification count
			var username = "";// notification user name
			var notifytitle = "";// notification title
			var image = ""; // notification user image
			var time = ""; // notification received time differnece from current time
			var notificationbody = ""; // notification buddy
			var notificationlist = []; // array of contain notification id and buddy
			var stringarr = []; // contains notification data string in array
			var notifyid = ""; // notification id
			var uid = ''; // notification user id
			continueTooltip();
			if (origin.data('ajax') !== 'cached') {
				$.ajax({
					type : 'POST',
					url : dynaurl
					+ '/notifications/index.php',
					data : {
						user_id : userid
					},
					success : function(data) {
						data = JSON.parse(data.trim());
						$.each(data.notifications,function(key,value) {
							$.each(value,function(key1,value1) {
								if (key1 === "id") {
									notifyid = value1;
								}
								if (key1 === "timestamp") {
									time = dateMinuteDiff(value1);
									
								}
								if (key1 === "notification_title") {
									notifytitle = value1;
								}
								if (key1 === "notification") {
									notificationbody = value1;
								}
								if (key1 === "from_user_data") {
									$.each(value1,function(k,v) {
										if (k === "username") {
											username = v;
										}
										if (k === "image") {
											image = v;
										}
										if (k === "user_id") {
											uid = v;
										}
									});
								}
							});
							// datastring create string format of notifications with '@' is split content  
							var datastring = notifyid
							+ "@"
							+ notificationbody
							+ "@"
							+ image
							+ "@"
							+ username
							+ "@"
							+ time
							+ "@"
							+ notifytitle
							+ "@"
							+ uid;

							stringarr.push(datastring);
						});
						localStorage["notificationarr"] = JSON.stringify(stringarr);
						var c = 0;// for restrict the notification with 5 
						for ( var k = stringarr.length - 1; k >= 0; k--) {
							if (c < 5) {
								var arr = stringarr[k]
								.split("@");
								tooltiplist += "<div style='width:100%;padding:0 2% 5px;border-bottom:1px dashed #CCC;float:left;'>"
									+ "<div style='width:18%;float:left;'><a href='javascript:onlineprofileclick("
									+ arr[6]
								+ ")' class='ui-link' ><img src='"
								+ arr[2]
								+ "' height='30px' width='30px'/></a>"
								+ "</div><div style='width:78%;float:left;padding-top:10px;color: #555555;'>"
								+ "<div>"
								+ arr[3]
								+ "</div><div style='text-align:right;' class='ticker-time'>"
								+ arr[4]
								+ " ago</div>"
								+ "</div><a href='#popup' id='add' data-position-to='window' data-transition='pop' data-rel='popup' class='ui-link' onclick='ClickNotification("
								+ arr[0]
								+ ");'>"
								+ "<div id='notifytitle' style='width:78%;float:left;margin-left:50px'>"
								+ arr[5]
								+ "</div></a></div><div style='clear:both;'></div>";

								notificationlist.push({
									"id" : arr[0],
									"body" : arr[1]
								});
							}
							c = c + 1;

						}
						tooltiplist += "<div align='center'><a href='javascript:onclick=notification(); ' class='ui-link' >See All</a></div>"

						localStorage["notlist"] = JSON.stringify(notificationlist);// store the notification list in a localstorage with name 'notlist'
						origin.tooltipster('update',tooltiplist).data('ajax');
						if (data.notif_count !== 0) {

							$.ajax({
								type : 'POST',
								url : dynaurl
								+ '/notifications/index.php',
								data : {
									user_id : userid,
									notification_is_read : "1"
								},
								success : function(data) {
								}
							});

						}

					}
				});
			}

		}
	});
	/*
	 * Method Name : click();
	 * Parameter : none
	 * Uses : for Show and Hide of tool tip
	 *
	 * */
	$(document).click(function(event) {

		if ($(event.target).closest(
				".notif-tooltip").length == 0) {

			if ($(event.target).closest(
			".tooltipster-content").length == 0) {
				if ($('.tooltipster-base').is(":visible")) {
					$('.notif-tooltip').tooltipster('hide');
				}
			}
		}

	});

	$('.sidenav-has-submenu').click(function() {
		var liIndex = $(this).parent('li').index() + 1;

		$('#sidePanel li').removeClass('isSubMenuOpen');

		$('#sidePanel li .sidenav-has-submenu').addClass('plus-img');
		$('#sidePanel li .sidenav-has-submenu').removeClass('minus-img');
		$('#sidePanel li .sidenav-has-submenu').parent().css("padding","10px 5px 10px 15px");

		$('#sidePanel li:nth-child('+ liIndex + ')').addClass('isSubMenuOpen');

		$('#sidePanel  :not(.isSubMenuOpen) ul').hide();

		$('#sidePanel li:nth-child('+ liIndex + ') ul').toggle();

		if ($('#sidePanel li:nth-child('+ liIndex + ') ul').is(":visible")) {
			$('#sidePanel li:nth-child('+ liIndex+ ') .sidenav-has-submenu').addClass('minus-img');
			$(
					'#sidePanel li:nth-child('
					+ liIndex
					+ ') .sidenav-has-submenu')
					.removeClass('plus-img');
			$(
					'#sidePanel li:nth-child('
					+ liIndex
					+ ') .sidenav-has-submenu')
					.parent()
					.css("padding",
					"10px 5px 0px 15px");
		} else {
			$(
					'#sidePanel li:nth-child('
					+ liIndex
					+ ') .sidenav-has-submenu')
					.addClass('plus-img');
			$(
					'#sidePanel li:nth-child('
					+ liIndex
					+ ') .sidenav-has-submenu')
					.removeClass('minus-img');
			$(
					'#sidePanel li:nth-child('
					+ liIndex
					+ ') .sidenav-has-submenu')
					.parent()
					.css("padding",
					"10px 5px 10px 15px");
			$(
					'#sidePanel li:nth-child('
					+ liIndex + ')')
					.removeClass(
					'isSubMenuOpen');
		}
	});
});

/*
 * Method Name : unloadPopupBox();
 * Parameter: None
 * Uses: close the popup window
 *
 * */
function unloadPopupBox() { // TO Unload the Popupbox
	$('#popup_box').fadeOut("slow");
	$("#page1").css({ // this is just for style
		"opacity" : "1"
	});
}
/*
 * Method Name : loadPopupBox();
 * Parameter: None
 * Uses: open the popup window
 *
 * */
function loadPopupBox() { // To Load the Popupbox
	$('#popup_box').fadeIn("slow");
	$("#page1").css({ // this is just for style
		"opacity" : "0.3"
	});
}
var imageset = [];// is an array of images with index id
/*
 * Method Name : ClickNotification();
 * Parameter: notification id
 * Uses: Show the notification content on the popup
 *
 * */
function ClickNotification(nid) {
	var notlist = JSON.parse(localStorage["notlist"]);// get the notification list from localStorage
	var text = ""; // for contain the notification buddy of particular user
	for ( var i = 0; i < notlist.length; i++) {

		if (notlist[i].id == nid) {
			text = notlist[i].body;
		}
	}

	$('.notif-tooltip').tooltipster('hide');
	$("#textcontent").html(text);
	/*
	 * This below content using for design the popup window
	 * Start
	 */
	var page = $('#page1');
	var popup = $('<div id="popup" data-role="popup" data-theme="c"></div>')
	.appendTo(page), header = $(
	'<div data-role="header"> <h1>Notification</h1><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right" onclick="ClosePopUp();">Close</a> </div>')
	.appendTo(popup), content = $(
			'<div data-role="content" > <p id="textcontent">' + text
			+ '</p> </div>').appendTo(popup);
	popup.popup();
	page.page('destroy').page();
	/*
	 * 
	 * End
	 */
}

function notification(){
	window.location="Notification.html";
}
/*
 * Method Name : ClosePopup();
 * Parameter: None
 * Uses: close the popup window
 *
 * */
function ClosePopUp() {
	$('.notif-tooltip').tooltipster('show');
}
//getting the notification count
/*
 * Method Name : notificationShow();
 * Parameter: None
 * Uses: Getting the Notification count
 *
 * */
function notificationShow() {
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : 'POST',
		url : dynaurl + '/notifications/index.php',
		data : {
			user_id : userid
		},
		success : function(data) {
			data = JSON.parse(data.trim());
			localStorage.setItem("notifycount", data.notif_count);// set notification count in localStorage
		}
	});
}
/*
 * Method Name : shoeImage();
 * Parameter: image id
 * Uses: Show image in popup window
 *
 * */
function showImage(val) {
	var imgsrc = "";
	var vid ="";
	for ( var i = 0; i < imageset.length; i++) {
		if (imageset[i].key == val) {
			imgsrc = imageset[i].value;
			vid = i;
		}
	}
	/*alert(vid);
     /*$("#popup_box").width($(window).width() - 50).height(
     $(window).height() - 60);*/
	//var str = "<img src='" + imgsrc + "' id='image"+vid+"'></img>";

	//var img = $("imgFull")[0]; // Get my img elem
	//  var real_width, real_height;
	//$("#con").html(str);
	// $("#image"+vid+"").load(function() {
	//       alert( $("#image"+vid+"").height()); // work for in memory images.
	//    });
	//;
	//loadPopupBox();
	$('<img id="imgFull" />').bind('load',
			function(){
		if ( !this.complete || this.naturalWidth == 0 ) {
			$( this ).trigger('load');
		} else {
			//$( this ).appendTo('#con');
			$("#con").html($( this ));
			var width ="";//content width
			var height ="";// content height
			if(this.naturalWidth > $(window).width()){
				width = $(window).width()-20;

			}else{
				width = this.naturalWidth;
			}
			if(this.naturaltHeight > $(window).height()){
				height = $(window).height()-50;
			}else{
				height = this.naturaltHeight;
			}
			$('#con').width(width).height(height);
		}
	}).attr("src",imgsrc);

	loadPopupBox();
}

/*
 * Method Name : logout();
 * Parameter: None
 * Uses: session closed and logged out ythe user from app
 *
 * */
function logout() {
	var userid = localStorage.getItem("userid");
	var logoutsuccess = false;
	$.ajax({
		type : "GET",
		url : dynaurl + '/logout/index.php',
		data : {
			userId : userid,
		},
		dataType : "json",
		success : function(data) {
			
			$.each(data, function(k, v){
				if(k === "success"){
					logoutsuccess = v;
				}
			});
			if(logoutsuccess){
				localStorage.clear();// clear all local Storages
				window.location = "index.html";
			}
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			 //alert("No Connection Established");
		}
	});
}
/*
 * Method Name : loadloginpage();
 * Parameter: None
 * Uses:  unload function at the time of login page load
 *
 * */

function loadloginpage() {
	document.addEventListener("deviceready", loginPage, false);
}

//at the time of loading login page check the if session exist or not
/*
 * Method Name :loginPage();
 * Parameter: None
 * Uses: Callback function for loading login page
 *
 * */
function loginPage() {
	document.addEventListener("backbutton", onBackKey1, false);
//	if (localStorage.getItem("sess") != null) {
//		window.location = "Home.html";
//	}
}

function openInApp(link){
		if( navigator.app ) // Android
			navigator.app.loadUrl( link, {openExternal:true} )
			else {// iOS and others
				window.open( link, "_system" ) ;
			}
	}


/*
 * Method Name : onBackKey1();
 * Parameter: None
 * Uses: prervent the Back key press through hardware
 *
 * */
function onBackKey1() {
	navigator.notification.confirm(("Do you want to Exit?"), // message
			alertexit, // callback
			'Flirt Life', // title
			'YES,NO' // buttonName
	);

}
/*
 * Method Name : alertexit();
 * Parameter: number button
 * Uses: Exit the app
 *
 * */
function alertexit(button) {
	if (button == "1" || button == 1) {
		navigator.app.exitApp();// exit the application
	}

}

var rString = "";// used for random string
//checking for login credential
/*
* Method Name : loginCheck();
* Parameter: None
* Uses: Check credential for login
*
* */
function loginCheck() {
	var valid = false;
	var user = $("#user").val();
	var password = $("#password").val();
	if(user == ""){
		navigator.notification.alert("Please Enter Username", function(){
			$("#user").val("");
			$("#user").focus();
			valid = false;
		}, " ", "OK");

		/*alert("Please enter Username ");
		$("#user").val("");
		$("#user").focus();
		valid = false;*/

	}
	else if(password == ""){
		navigator.notification.alert("Please Enter Password", function(){
			$("#password").val("");
			$("#password").focus();
			valid = false;
		}, " ", "OK");
		/*alert("Please enter Password ");
		$("#password").val("");
		$("#password").focus();
		valid = false;
*/

	}
	else{
		valid = true;
	}
	if(valid){
		
		$.mobile.showPageLoadingMsg(true);
		var formvalue = $("#form_login").serialize();
		
		$.ajax({
			type : "POST",
			url : dynaurl + '/login/index.php',
			data : formvalue,
			dataType : "json",
			success : function(data) {
				
				$.each(data, function(key, value) {
					if (key === "success") {
						localStorage.setItem("login", value);
					}
					if(key === "data"){
						$.each(value, function(k,v){
							if (k === "username") {
								localStorage.setItem("username", v);
							}
							if (k === "user_id") {
								localStorage.setItem("userid", v);
							}
						});
					}
					
				});
				var s = localStorage.getItem("login");
				//console.log(s);
				if (s) {
					rString = randomString(32,
					'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
					sessionStoreforUser();


				} else if (s === "0") {
					navigator.notification.alert("Invalid Username and Password", function(){
						$("#user").val("");
						$("#password").val("");
						$("#user").focus();

					}, "Error", "OK");
					alert("Invalid Username and Password");
					$("#user").val("");
					$("#password").val("");
					$("#user").focus();
					//$("#errormessage").show();
					//window.location = "LoginError.html";
				}
			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
				 //alert("No Connection Established");
			}
		});
	}
	$.mobile.hidePageLoadingMsg();
}

/*
* Method Name : openInApp();
* Parameter:Url of site
* Uses: after clicking the link of flirtlife.de from loginpage , it will open in browsr
*
* */




//This is the function for storing the user session
/*
* Method Name : sessionStoreforUser();
* Parameter: None
* Uses: send session value to database and store session in localstorage
*
* */
function sessionStoreforUser() {
	var ip = gettingIp();// get the system ip in ipv6 format
	var username = $("#user").val();
	var url = dynaurl + "/login/index.php?user=" + username + "&ipaddress="
	+ ip + "&sessid=" + rString + "&saveLogin=1&online_status=1";

	$.get(url, function(data) {
		localStorage.setItem("sess", rString);// store the session in localStorage
		window.location = "Home.html";
	});
}
//This function used for getting the ip of the device

/*
* Method Name : gettingIp();
* Parameter: None
* Uses: Getting the ip of device in ipv6 format
*
* */
function gettingIp() {
	if (window.XMLHttpRequest)
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false); // http://jsonip.appspot.com/?asp.net
	xmlhttp.send();

	hostipInfo = xmlhttp.responseText.split("\n");

	for (i = 0; hostipInfo.length >= i; i++) {
		ipAddress = hostipInfo[i].split(":");
		if (ipAddress[0] == "IP") {
			return getIPv6(ipAddress[1].replace(/\s+/, ""));
		}
	}
}
//generating random string
/*
* Method Name : randoemString();
* Parameter: int length and string chars
* Uses: generating random number given  the length and characters.
*
* */
function randomString(length, chars) {
	var result = '';
	for ( var i = length; i > 0; --i)
		result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}
//phonegap method for loading the Home page
function loadHomepage() {
	document.addEventListener("deviceready", homePage, false);
}
/*
* Method Name : onBackKey();
* Parameter: None
* Uses: prevent for hardware back key press
*
* */
function onBackKey(e) {
	var home_path = "/android_asset/www/Home.html";
	var pathname = window.location.pathname;
	if (pathname == home_path) {
		e.preventDefault();
	} else {
		navigator.app.backHistory();// go to the previous page
	}

}



//At the time of loading Home page ,
/*
* Method Name : homePage();
* Parameter: None
* Uses: callback function at the time of loading Home page , getting the data for 'flirtlifer of the day' and 'tickers'
*
* */
function homePage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);

	$("#notifycount").hide();
	$.mobile.showPageLoadingMsg(true);
	notificationShow();

	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0 || notyfycount == null) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}
	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0 || notyfycount == null) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var statusstring = "<select  id='onstatus'  class='select'> <option value='' selected>-Not Specified-</option><option value='1'>schlank</option><option value='2'>vollschlank</option><option value='3'>athletisch</option></select>";
	$("#onstatusdiv").html(statusstring);
	$.ajax({
		type : "GET",
		url : dynaurl + "/flirtlifer/index.php",
		data : " ",
		dataType : "json",
		success : function(data) {
			var single = ""; // used for store  single/non single 
			var manwomen = "";// used for store  man/women
			var application = "";//  which purpose looking for user
			var image = ""; // image of user
			var username = ""; // username of user
			var uid = ""; //userid of user
			$.each(data, function(key, value) {
				if(key === "data"){
					$.each(value, function(key1, value1) {
						if (key1 === "image_url") {
							image = value1;
						}
						if (key1 === "username") {
							username = value1;
						}
						if (key === "single") {
							single1 = checkSingle(value1);
						}
						if (key1 === "mannfrau") {
							manwomen = checkManwomen(value1);
						}
						/*if (key1 === "application") {
							application = value1;
						}*/
						if (key1 === "user_id") {
							uid = value1;
						}
					});
				}
				
			});

			var flirtofday = "";// store filterlife of the day data
			flirtofday += "<div class='flirtlifer-image'>"
				+ "<a href='javascript:onlineprofileclick(" + uid
				+ ")' class='ui-link' ><img src='" + image
				+ "' class='flirtlifer-img' /></a></div>"
				+ "<div class='flirt-info font-13'>"
				+ "<div class='inner'>"
				+ "<div class='flirt-title' >FLIRTLIFER OF THE DAY</div>"
				+ "<div><span class='ticker-name'>" + username + " </span>"
				+ "<span class='ticker-status'>" + single + "</span></div>"
				+ "<div style='color:#666666'>"
				+ "<span>I am looking for a " + manwomen + " for/to "
				+ application + "</span></div></div></div>";
			$(".flirtlifer").html(flirtofday);
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			// alert("No Connection Established");
		}
	});

	
	$
	.ajax({
		type : "GET",
		url : dynaurl + "/ticker/index.php",
		data : "",
		dataType : "json",
		success : function(data) {
			var image = "";
			var username = "";
			var message = "";// tickermessage
			var tstart = "";// ticker start time difference
			var ticketString = "";// create string for tivkers details
			//var c = 0;
			var successticker = false;
			var uid1 = ""; //userid of user
			$
			.each(data,function(key, value) {
				//alert(key === "data");
				//alert(value);
				if(key == "success"){
					successticker = value;
				}
				if(key === "data"){
					$.each(value, function(k, v) {
						$.each(v, function(key1, value1){
								if (key1 === "username") {
									username = value1;
								}
								/*if (key1 === "image") {
									image = value1;
								}*/
								if (key1 === "ticker_text") {
									message = value1;
									//console.log(value1);
								}
								if (key1 === "ticker_start") {
									tstart = value1;
								}
								if (key === "user_id") {
									uid1 = value;
								}
							});
		                    // //console.log(message);
							ticketString += "<li class='font-13'>"
								+ "<p class='ticker'><a href='javascript:onlineprofileclick("
								+ uid1
								+ "); return false;' class='ui-link'>"
								+ "<img src='"
								+ image
								+ "' class='tickers-image' /></a></p>"
								+ "<div class='ticker-info'><div class='ticker-inner'>"
								+ "<div class='ticker-head'><span class='ticker-name'>"
								+ "<a>"
								+ username
								+ "</a></span>"
								+ "</div>"
								+ "<div class='ticker-body'>"
								+ "<span>"
								+ message
								+ "</span>"
								+ "</div></div></div></li>"
								+ "<div class='clear dashedBottomBorder'></div>";;
					});
				 
				}
				
			});
           // //console.log(successticker);
			//$("#hometicker").html(ticketString);
            if(successticker){
            	$("#hometicker").html(ticketString);
            }else{
            	$("#hometicker").html("");
            }
			$.mobile.hidePageLoadingMsg();
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");
			//alert("No Connection Established");

		}

	});

}

//phonegap method for loading Notice page
function loadNoticepage() {
	document.addEventListener("deviceready", noticePage, false);
}
//At the time of loading notice page
/*
 * Method Name : noticePage();
 * Parameter: None
 * Uses: callback function at the time of loading Notice page,
 *
 * */
function noticePage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
}
//phopnegap method for loading Tags page
function loadTagsPage() {
	document.addEventListener("deviceready", tagPage, false);
}
//At the time of loading Tags page
/*
 * Method Name : tagPage();
 * Parameter: None
 * Uses: callback function for loading tag page ,
 *
 * */
function tagPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var userid = localStorage.getItem("userid"); //get login userid from localStorage
	var image = ""; // store user image
	var uname = "";// store user name 
	var age = "";// store user age
	var single = "";// store user single/non single value

	var tagname = ""; // store tagname 
	var uid = ""; // store user id 
	$("#tagviewcolapse")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				var viewtaglist = "";// contain all the tags in a list string
				viewtaglist = "<div><ul class='nav-list' >";
				var tagmatchsuccess = false;
				$
				.ajax({
					type : "Post",
					url : dynaurl + "/tag/index.php",
					data : {
						user_id : userid,
						view_tags : "1"
					},
					dataType : "json",
					success : function(data) {
						$.each(data, function(k1,v1){
							if(k1 === "success"){
								tagmatchsuccess = v1;
							}
							if(k1 === "data"){
								$
								.each(
										v1,
										function(key, value) {
											$
											.each(
													value,
													function(
															k,
															v) {
														if (k === "tag") {
															tagname = v;
															localStorage
															.setItem(
																	"tag",
																	tagname); // set the localStorage vlaue if a tag present in the database for that user
														}
													});
											viewtaglist += "<li class='font-13'>"

												+ "<div class='ticker-info'>"
												+ "<div class='ticker-inner'>"
												+ "<div class='ticker-head'>"
												+ "<span class='ticker-name'>"
												+ "<a href='' >"
												+ tagname
												+ "</a>"
												+ "</span></div></div></div>"
												+ "</li><div class='clear dashedBottomBorder'></div>";

										});
								viewtaglist += "</ul>";
								if (localStorage.getItem("tag") != null) {
									viewtaglist += " <button class='button button2 text-decor-none  font-13' data-role='none' onclick='deleteAllTag(); return false;'> " +
									"<span style='vertical-align:top'>DELETE ALL TAGS</span></button>";

									viewtaglist +="</div>";
								} else {
									localStorage.removeItem("tag");// remove tag from localStorage
								}
							}
						});
						if(tagmatchsuccess){
							$("#viewtag").html(viewtaglist);
						}else{
							$("#viewtag").html("");
						}
						
						$.mobile.hidePageLoadingMsg();

					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");
						//alert("No Connection Established");
					}
				});

			});
	$("#tagmatchcolapse")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				var tagmatchlist = ""; // string for matchig tags of user details
				var tagsuccess = false;
				$
				.ajax({
					type : "Post",
					url : dynaurl + "/tag_matching/index.php",
					data : {
						user_id : userid,

					},
					dataType : "json",
					success : function(data) {
						$.each(data, function(k1,v1){
							if(k1 === "success"){
								tagsuccess = v1;
							}
							if(k1 === "data"){
								$
								.each(
										v1,
										function(key, value) {
											$
											.each(
													value,
													function(
															key1,
															value1) {
														if (key1 === "username") {
															uname = value1;
														}
														if (key1 === "image") {
															image = value1;
														}
														if (key1 === "age") {
															age = value1;
														}
														if (key1 === "single") {
															single = checkSingle(value1);
														}
														if (key1 === "user_id") {
															uid = value1;
														}
													});
											tagmatchlist += "<li class='font-13'>"
												+ "<p class='profile-visitor'>"
												+ "<a href='' class='ui-link' onclick='onlineprofileclick("
												+ uid
												+ ")'>"
												+ "<img src='"
												+ image
												+ "' class='tickers-image'/></a></p>"
												+ "<div class='profile-visitor-info'><div class='ticker-inner'>"
												+ "<div class='ticker-head'><span class='ticker-name'>"
												+ "<a href='' onclick='onlineprofileclick("
												+ uid
												+ ")'>"
												+ uname
												+ "</a></span></div>"
												+ "<div class='ticker-body'><span>Age : "
												+ age
												+ " </span>"
												+ "<span class='ticker-status'>"
												+ single
												+ "</span></div></div></div></li>"
												+ "<div class='clear dashedBottomBorder'></div>";

										});
								tagmatchlist += "<div class='clear'></div>";
							}
						});
						if(tagsuccess){
							$("#tagmatch").html(tagmatchlist);
						}else{
							$("#tagmatch").html("");
						}
						
						$.mobile.hidePageLoadingMsg();

					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");             
						//alert("No Connection Established");
					}
				});

			});
}
/*
 * Method Name : deleteAllTag();
 * Parameter: None
 * Uses: Delete alltags from taglist
 *
 * */
function deleteAllTag() {
	var userid = localStorage.getItem("userid");
	var tagsdeletedsuccess = false;
	$.ajax({
		type : "Post",
		url : dynaurl + "/tag/index.php",
		data : {
			user_id : userid,
			delete_tags : "1"
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(k,v){
				if(k === "success"){
					tagsdeletedsuccess = v;
				}
			});
			if(tagsdeletedsuccess){
				navigator.notification.alert("Successfull deleted Tags.", function(){}, "Tag Delete", "OK");         
				//alert("Successfull deleted Tags.");
				window.location = "Tags.html";
			}
			
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//function for create tags
/*
 * Method Name : createTag();
 * Parameter: None
 * Uses: Craete a tag for user
 *
 * */
function createTag() {
	var name = $("#tag1").val();
	var userid = localStorage.getItem("userid");
	var tagcreatedsuccess = false;
	$.ajax({
		type : "Post",
		url : dynaurl + "/tag/index.php",
		data : {
			user_id : userid,
			tags : name
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(k,v){
				if(k === "success"){
					tagcreatedsuccess = v;
				}
			});
			if(tagcreatedsuccess){
				navigator.notification.alert("Tag Created Successfully", function(){}, "Tag Creation", "OK");           
			}
			
			/*alert("Tag creation Successfull.");
			$("#tag1").val("");
			$("#tag1").focus();*/
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//phonegap function for load profile view page
function loadProfileViewPage() {
	document.addEventListener("deviceready", profileviewPage, false);
}
//At the time of loading profilrvieww page
/*
 * Method Name : profileViewPage();
 * Parameter: None
 * Uses: callback function for at the time of loading profile page , getting the profile detail of user
 *
 * */
function profileviewPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	imageset = [];
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var email = "";// email id of user
	var gender = "";// Gender of user
	var dob = ""; // date of birth of user in yyyy-mm-dd format
	var age = ""; // age of user
	var dob1 = "";// date of birth of user in orginal format
	var imgset = ""; //string format of image list for user
	var c = 0;
	var pviewsuccess = false;
	var username ="";
	var userid = localStorage.getItem("userid");
	$.mobile.showPageLoadingMsg(true);
	$
	.ajax({
		type : "POST",
		url : dynaurl + "/profile/index.php",
		data : {
			user_id : userid
		},
		dataType : 'json',
		success : function(data) {
			$.each(data, function(k,v){
				if(k === "success"){
					pviewsuccess = v;
				}
				if(k === "data"){
					$.each(v,function(key, value) {
						if (key === "username") {
							username = value;
						}
						if (key === "user_id") {
							localStorage.setItem("userid",
									value);
						}
						/*if (key === "user_password") {
							password = value;
						}*/
						/*if (key === "user_email") {
							email = value;
						}*/
						if (key === "user_geschlecht") {
							if (value == 'm') {
								gender = "Male"
							} else if (value == 'w') {
								gender = "Female";
							}
						}
						if (key === "user_birth") {
							dob1 = value;
							dob = dbbrkup(value);
						}
						/*if (key === "alter") {
							age = value;
						}*/
						/*if (key === "image_set") {
							$
							.each(
									value,
									function(key1,
											value1) {
										imageset
										.push({
											"key" : key1,
											"value" : value1
										});
										c = c + 1;
										if (c % 3 === 0) {
											imgset += "<div class='profil-photo-last'>"
												+ "<a href='' onclick='showImage("
												+ key1
												+ "); return false;' class='ui-link'><img src='"
												+ value1
												+ "' class='photo' /></a></div>";
										} else {
											imgset += "<div class='profil-photo'>"
												+ "<a href='' onclick='showImage("
												+ key1
												+ "); return false;' class='ui-link'><img src='"
												+ value1
												+ "' class='photo' /></a></div>";
										}

									});
						}*/

					});
					
				}
			});
			
		    if(pviewsuccess){
		    	var divcontent = ""; // String format  for users profile view content
				divcontent += "<div class='font-13 profil-head'><span class='profil-title'>Username :</span>"
					+ "<span class='profil-space'>|</span><span  class='profil-field' >"
					+ username
					+ "</span></div><div class='clear'></div>";
				divcontent += "<div class='font-13 profil-head'><span class='profil-title'>Email :</span>"
					+ "<span class='profil-space'>|</span><span  class='profil-field' >"
					+ email + "</span></div><div class='clear'></div>";
				divcontent += "<div class='font-13 profil-head'><span class='profil-title'>Gender :</span>"
					+ "<span class='profil-space'>|</span><span  class='profil-field' >"
					+ gender + "</span></div><div class='clear'></div>";
				divcontent += "<div class='font-13 profil-head'><span class='profil-title'>DOB :</span>"
					+ "<span class='profil-space'>|</span><span  class='profil-field' >"
					+ dob + "</span></div><div class='clear'></div>";
				divcontent += "<div class='font-13 profil-head'><span class='profil-title'>Age :</span>"
					+ "<span class='profil-space'>|</span><span  class='profil-field' >"
					+ age + "</span></div><div class='clear'></div>";

				$("#profile").html(divcontent);

				var editpcontent = ""; // string format for profile edit content
				editpcontent += "<div class='font-13 profil-head'>"
					+ "<span class='form-text'>Username :</span>"
					+ "<span class='form-space'></span>"
					+ "<span class='form-field'>"
					+ "<input type='text' id='name' class='textinput' name='name' value='"
					+ username + "' data-role='none'  readonly/>"
					+ "</span>" + "</div><div class='clear'></div>";
				editpcontent += "<div class='font-13 profil-head'>"
					+ "<span class='form-text'>Email :</span>"
					+ "<span class='form-space'></span>"
					+ "<span class='form-field'>"
					+ "<input type='text' class='textinput' name='email'  id='email' value='"
					+ email + "' data-role='none'  />" + "</span>"
					+ "</div><div class='clear'></div>";
				editpcontent += "<div class='font-13 profil-head'>"
					+ "<span class='form-text'>Gender :</span><span class='form-space'></span>"
					+ "<span class='form-field profil-radio-btn'>"
					+ "<input type='radio' data-role='none' value='m' id='r1' name='gender' />"
					+ "	<label for='r1'><span></span>Male</label>	"
					+ "<input type='radio' data-role='none' value='w' id='r2' name='gender' />"
					+ " <label for='r2'><span></span>Female</label>"
					+ "</span></div>" + "<div class='clear'></div>";
				editpcontent += "<div class='font-13 profil-head'>"
					+ "<span class='form-text'>DOB :</span>"
					+ "<span class='form-space'></span>"
					+ "<span class='form-field'>"
					+ "<input type='text' class='textinput' name='dob'  id='dob' value='"
					+ dob1 + "' data-role='none'  />" + "</span>"
					+ "</div><div class='clear'></div>";
				editpcontent += "<div class='font-13 profil-head'>"
					+ "<span class='form-text'></span><span class='form-space'></span>"
					+ "<span class='form-field'>"
					+ "<input type='submit' class='button button2 text-decor-none btn-no-icon' value='SAVE' data-role='none' onclick='profileSave();'/></span>"
					+ "</div><div class='clear'></div>";
				$("#editp").html(editpcontent);

				if (gender === "Male") {
					$("#r1").attr("checked", true);
				} else if (gender === "Female") {
					$("#r2").attr("checked", true);
				}
				$("#profilephoto").html(imgset);
		    }else{
		    	$("#profile").html("");
		    	$("#editp").html("");
		    	$("#profilephoto").html("");
		    }
			
			$.mobile.hidePageLoadingMsg();
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}

	});
}
//function for save the edited profile
/*
 * Method Name : profileSave();
 * Parameter: None
 * Uses: Save the edited profile data
 *
 * */
function profileSave() {
	var uid = localStorage.getItem("userid"); // get the user id from localStorage
	var email = $("#email").val();
	var gender = $("input[name=gender]:checked").val();
	var dob = $("#dob").val();
	var profilesavesuccess = false;
	$.ajax({
		type : "GET",
		url : dynaurl + "/profile/index.php",
		data : {
			user_id : uid,
			user_email : email,
			user_gender : gender,
			user_birth : dob,
			mode : "edit"
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(k,v){
				if(k === "success"){
					profilesavesuccess = v;
				}
			});
			if (profilesavesuccess) {
				window.location = "Profile_View.html";
			}
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");   
			//alert("No Connection Established");
		}

	});
}
//phonegap function for loading profile visitos page
function loadPVisitorpage() {
	document.addEventListener("deviceready", pvisitorPage, false);
}
//At the time of loading profile visitors page
/*
 * Method Name : pvisitoerPage();
 * Parameter: None
 * Uses: callback function for profile visitor page , gettimg the list of profile visitors
 *
 * */
function pvisitorPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var userid = localStorage.getItem("userid");
	var visitingtime = "";
	var image = "";
	var username = "";
	var profileuserid = "";
	var pvisitorslist = "";
	var pvisitorsuccess = "";
	$
	.ajax({
		type : "POST",
		url : dynaurl + "/profile-visitors/index.php",
		data : {
			user_id : userid
		},
		dataType : 'json',
		success : function(data) {
			/*if (data.length == 0) {
				navigator.notification.alert("No One Visited Your Profile.", function(){}, "Profile Visit", "OK");          
				//alert("No One Visited Your Profile.");

			} else {*/
				$.mobile.showPageLoadingMsg(true);
				$ .each( data, function(k, v) {
					if(k === "success"){
						pvisitorsuccess = v;
					}
					if(k === "data"){
						$
						.each(
								v,
								function(key, value) {
									$
									.each(
											value,
											function(key1,
													value1) {
												if (key1 === "username") {
													username = value1;
												}
												if (key1 === "user_id") {
													profileuserid = value1;

												}
												if (key1 === "image_url") {
													image = value1;
												}
												if (key1 === "mtime") {
													visitingtime = dateMinuteDiff(value1);

												}
											});
									pvisitorslist += "<li class='font-13'>"
										+ "<p class='profile-visitor'>"
										+ "<a href='' class='ui-link' onclick='onlineprofileclick("
										+ profileuserid
										+ ")'>"
										+ "<img src='"
										+ image
										+ "' class='tickers-image' /></a></p>"
										+ "<div class='profile-visitor-info'>"
										+ "<div class='ticker-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='ticker-name'>"
										+ "<a href='' onclick='onlineprofileclick("
										+ profileuserid
										+ ")'>"
										+ username
										+ "</a></span></div>"
										+ "<div class='ticker-body'>"
										+ "<span class='ticker-time'>"
										+ visitingtime
										+ " ago</span>"
										+ "</div></div></div></li>"
										+ "<div class='clear dashedBottomBorder'></div>";

								});
						pvisitorslist += "<div class='clear'></div>";
					}
				});
		        if(pvisitorsuccess){
		        	$("#profilevisitorslist").html(pvisitorslist);
		        }else{
		        	navigator.notification.alert("No One Visited Your Profile.", function(){}, "Profile Visit", "OK");
		        	$("#profilevisitorslist").html("");
		        } 
				
				$.mobile.hidePageLoadingMsg();
			//}
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");         
			//alert("No Connection Established");
		}

	});

}
//phonegap function for loading search result page
function loadsearchresultpage() {
	document.addEventListener("deviceready", searchResultPage, false);
}
//At the time of loading search result page
/*
 * Method Name : searchResultPage();
 * Parameter: None
 * Uses: display all the search result list
 *
 * */
function searchResultPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var dynastring = "";
	var searchlist = "";
	var parameters = {};
	var uname = "";
	var age = "";
	var single = "";
	var image = "";
	var uid = "";
	var successsearch = false;
	var userid = localStorage.getItem("userid");
	if (localStorage.getItem("searchattribute") !== "1") {
		$.mobile.showPageLoadingMsg(true);
		var name = localStorage.getItem("searchname");
		$
		.ajax({
			type : "GET",
			url : dynaurl + "/search/index.php",
			data : {
				login_user_id : userid,
				username : name
			},
			dataType : "json",
			success : function(data) {
				/*if (data.length == 0) {
					navigator.notification.alert("No matched results found.", function(){}, "Search results", "OK");              
					//alert("No matched Results !");
					window.location = "Search.html";
				} else {*/
					$.each(data,function(k, v) {
						if(k === "success"){
							successsearch = v;
						}
						if(k === "data"){
							$.each(v, function(key, value) {
								$.each(value,function(key1,
												value1) {
											if (key1 === "username") {
												uname = value1;
											}
											/*if (key1 === "image") {
												image = value1;
											}*/
											/*if (key1 === "age") {
												age = value1;
											}*/
											if (key1 === "single") {
												single = checkSingle(value1);
											}
											if (key1 === "user_id") {
												uid = value1;
											}

										});
								searchlist += "<li class='font-13'>"
									+ "<p class='profile-visitor'>"
									+ "<a href='javascript:onlineprofileclick("
									+ uid
									+ ");' class='ui-link'>"
									+ "<img src='"
									+ image
									+ "' class='tickers-image'/></a></p>"
									+ "<div class='profile-visitor-info'><div class='ticker-inner'>"
									+ "<div class='ticker-head'><span class='ticker-name'>"
									+ "<a href='' onclick='onlineprofileclick("
									+ uid
									+ ")'>"
									+ uname
									+ "</a></span></div>"
									+ "<div class='ticker-body'><span>Age : "
									+ age
									+ " </span>"
									+ "<span class='ticker-status'>"
									+ single
									+ "</span></div></div></div></li>"
									+ "<div class='clear dashedBottomBorder'></div>";
							});
							searchlist += "<div class='clear'></div>";
						}
					});
					if(successsearch){
						$("#searchresult").html(searchlist);
					}else{
						navigator.notification.alert("No matched results found.", function(){}, "Search results", "OK");              
						//alert("No matched Results !");
						window.location = "Search.html";
					}
					
					$.mobile.hidePageLoadingMsg();
				//}
			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");             
				 //alert("No Connection Established");
			}
		});

	} else {
		dynastring += "login_user_id=" + userid + "&"
		var gender = localStorage.getItem("g");
		if (gender != null && gender != "") {
			dynastring += "gender=" + gender + "&";
		}
		var age1 = localStorage.getItem("age1");
		if (age1 != null && age1 != "") {
			dynastring += "age_to=" + age1 + "&";
		}
		var hairarray = JSON.parse(localStorage["hair"]);
		if (hairarray != null && hairarray != "") {
			for ( var i = 0; i < hairarray.length; i++) {
				dynastring += "hair_color[]=" + hairarray[i] + "&";
			}
		}
		var status = localStorage.getItem("status");
		if (status != null && status != "") {
			dynastring += "single=" + status + "&";
		}
		var heightfrom = localStorage.getItem("heightfrom");
		if (heightfrom != null && heightfrom != "") {
			dynastring += "height_from=" + heightfrom + "&";
		}
		var heightto = localStorage.getItem("heightto");
		if (heightto != null && heightto != "") {
			dynastring += "height_to=" + heightto + "&";
		}
		var figurearray = JSON.parse(localStorage["figure"]);
		if (figurearray != null && figurearray != "") {
			for ( var i = 0; i < figurearray.length; i++) {
				dynastring += "figure[]=" + figurearray[i] + "&";
			}
		}
		var pics = localStorage.getItem("pics");
		if (pics != null && pics != "") {
			dynastring += "pic=" + pics + "&";
		}
		dynastring = dynastring.substring(0, dynastring.length - 1);
		$.mobile.showPageLoadingMsg(true);
		$
		.ajax({
			type : "GET",
			url : dynaurl + "/search/index.php",
			data : dynastring,
			dataType : "json",
			success : function(data) {
				/*if (data.length == 0) {
					navigator.notification.alert("No matched results found", function(){}, "Search results", "OK");             
					//alert("No matched Results !");
					window.location = "Search.html";
				} else {*/
					$.each(data,function(k, v) {
						if(k === "success"){
							successsearch = v;
						}
						if(k === "data"){
					$
					.each(
							data,
							function(key, value) {
								$
								.each(
										value,
										function(key1,
												value1) {
											if (key1 === "username") {
												uname = value1;
											}
											if (key1 === "image") {
												image = value1;
											}
											if (key1 === "age") {
												age = value1;
											}
											if (key1 === "single") {
												single = checkSingle(value1);
											}
											if (key1 === "user_id") {
												uid = value1;
											}

										});
								searchlist += "<li class='font-13'>"
									+ "<p class='profile-visitor'>"
									+ "<a href='' class='ui-link'>"
									+ "<img src='"
									+ image
									+ "' class='tickers-image'/></a></p>"
									+ "<div class='profile-visitor-info'><div class='ticker-inner'>"
									+ "<div class='ticker-head'><span class='ticker-name'>"
									+ "<a href='' onclick='onlineprofileclick("
									+ uid
									+ ")'>"
									+ uname
									+ "</a></span></div>"
									+ "<div class='ticker-body'><span>Age : "
									+ age
									+ " </span>"
									+ "<span class='ticker-status'>"
									+ single
									+ "</span></div></div></div></li>"
									+ "<div class='clear dashedBottomBorder'></div>";
							});
					        searchlist += "<div class='clear'></div>";
						}
					});
					if(successsearch){
						$("#searchresult").html(searchlist);
					}else{
						navigator.notification.alert("No matched results found.", function(){}, "Search results", "OK");              
						//alert("No matched Results !");
						window.location = "Search.html";
					}
					
					$.mobile.hidePageLoadingMsg();
				//}
			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");             
				//alert("No Connection Established");
			}
		});
	}

}
//phonegap for loading search page
function loadSearchpage() {
	document.addEventListener("deviceready", searchPage, false);
}
//phonegap callback function for loading Search page
/*
 * Method Name : serachPage();
 * Parameter: None
 * Uses: callback function for search page load ,
 *
 * */
function searchPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	$.mobile.showPageLoadingMsg(true);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);

	var haircolors = "";
	var figures = "";
	var haircolor = "";
	var figure = "";
	var hid = "";
	var fid = "";
	var onstatus = "";
	var onstatusid = "";
	var onstatuses = "";
	$.ajax({
		type : "GET",
		url : dynaurl + "/fields/index.php",
		data : {
			hair_color : "",
			body_type : "",
			online_status : ""
		},
		dataType : "json",
		success : function(data) {
			$.each(data.hair_color, function(key, value) {

				$.each(value, function(k, v) {
					if (k === "color_name") {
						haircolor = capitaliseFirstLetter(v);
					}
					if (k === "id") {
						hid = v;
					}

				});
				haircolors += "<option value='" + hid + "'>" + haircolor
				+ "</option>";
			});
			$.each(data.body_type, function(key, value) {
				$.each(value, function(k, v) {
					if (k === "body_type") {
						figure = capitaliseFirstLetter(v);
					}
					if (k === "id") {
						fid = v;
					}

				});
				figures += "<option value='" + fid + "'>" + figure
				+ "</option>";
			});
			$.each(data.online_status, function(key, value) {
				$.each(value, function(k, v) {
					if (k === "name") {
						onstatus = capitaliseFirstLetter(v);
					}
					if (k === "id") {
						onstatusid = v;
					}

				});
				onstatuses += "<option value='" + onstatusid + "'>" + onstatus
				+ "</option>";
			});
			$("#select-choice-minhaircolor").html(haircolors);
			$("#select-choice-minfigure").html(figures);
			$("#select-choice-minstatus").html(onstatuses);
			$.mobile.hidePageLoadingMsg();

		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");           
			//alert("No Connection Established");
		}
	});

}
var searchlistarray = [];
//function for searching by username
/*
 * Method Name : searchByUsername();
 * Parameter: None
 * Uses: search by given username
 *
 * */
function searchByUsername() {
	var name = $("#username").val();
	localStorage.setItem("searchattribute", 0);
	localStorage.setItem("searchname", name);
	window.location = "SearchResults.html";

}
var hairarray = [];
var figurearray = [];
//function for searching bu attributes
/*
 * Method Name : searchByAttribute();
 * Parameter: None
 * Uses: search user by given attribute
 *
 * */
function searchByAttribute() {

	localStorage.setItem("searchattribute", 1);
	var gender = $("input[name=gender]:checked").val();
	localStorage.setItem("g", gender);
	var selectedhaircolor = document
	.getElementById("select-choice-minhaircolor");
	for ( var i = 0; i < selectedhaircolor.options.length; i++) {
		if (selectedhaircolor.options[i].selected == true) {
			hairarray.push(selectedhaircolor.options[i].value);

		}
	}
	localStorage["hair"] = JSON.stringify(hairarray);
	var selectedfigure = document.getElementById("select-choice-minfigure");
	for ( var i = 0; i < selectedfigure.options.length; i++) {
		if (selectedfigure.options[i].selected == true) {
			figurearray.push(selectedfigure.options[i].value);

		}
	}
	localStorage["figure"] = JSON.stringify(figurearray);
	var selectedstatus = $('#select-choice-minstatus option:selected').val();
	localStorage.setItem("status", selectedstatus);
	var pics = $("input[name=picture]:checked").val();
	localStorage.setItem("pics", pics);
	var heightfrom = $("input[name=groesse_von]").val();
	localStorage.setItem("heightfrom", heightfrom);
	var heightto = $("input[name=groesse_bis]").val();
	localStorage.setItem("heightto", heightto);
	var age1 = $("input[name=slider-fill]").val();
	localStorage.setItem("age1", age1);
	window.location = "SearchResults.html";
}
//phonegap function for loading user status page
function loadUserstatuspage() {
	document.addEventListener("deviceready", userstatusPage, false);
}
//phonegap callback function for loading user status page
/*
 * Method Name : userstatusPage();
 * Parameter: None
 * Uses: callback function for user status page load , get the user status from database
 *
 * */
function userstatusPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var username = "";
	var uid = "";
	var onlinelist = "";
	var idlestatus = "";
	var time = "";
	var c = 0;
	var valid = true;
	var userid = localStorage.getItem("userid");
	var count = 0;
	var userstatusuccess = false;
	$.mobile.showPageLoadingMsg(true);
	$
	.ajax({
		type : "POST",
		url : dynaurl + "/online/index.php",
		data : {
			user_id : userid,
			minage : "20",
			maxage : "80"
		},
		dataType : 'json',
		success : function(data) {
			$.each(data,function(k,v){
				if(k === "success"){
					   userstatusuccess = v;
				   }
				   if(k === "data"){
					   $
						.each(
								v,
								function(key, value) {
									$.each(value, function(key1, value1) {

										if (key1 === "username") {
											username = value1;
										}
										if (key1 === "user_id") {
											uid = value1;
											if (uid === userid) {
												valid = false;
											} else {
												valid = true;
											}

										}
										if (key1 === "last_action") {
											time = getMinutesDiff(value1);
										}
									});
									if (valid) {
										if (time < 15) {
											count = count + 1;
											onlinelist += "<li data-icon='false' style='font-size:15px;'>"
												+ "<a href='' data-transition='slide' onclick='onlineprofileclick("
												+ uid
												+ ")' style='color:#0000FF;'>"
												+ username
												+ "</a></li>";
										} else {
											c = c + 1;
											idlestatus += "<li data-icon='false' style='font-size:15px;'>"
												+ "<a href='' data-transition='slide' onclick='onlineprofileclick("
												+ uid
												+ ")' style='color:#0000FF;'>"
												+ username
												+ "</a></li>";
										}

									}

								});
						/*$("#onlinestatus").html("ONLINE(" + count + ")");

						$("#ulplist1").html(onlinelist);
						$("#away").html("AWAY / IDLE(" + c + ")");

						$("#ulplist2").html(idlestatus);*/
				   }
			});
			   if(userstatusuccess){
				   $("#onlinestatus").html("ONLINE(" + count + ")");

					$("#ulplist1").html(onlinelist);
					$("#away").html("AWAY / IDLE(" + c + ")");

					$("#ulplist2").html(idlestatus);
			   }else{
				   $("#onlinestatus").html("");

					$("#ulplist1").html("");
					$("#away").html("");

					$("#ulplist2").html("");
			   }
			
			$.mobile.hidePageLoadingMsg();
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}

	});

}
//function for navigate user profile page
/*
 * Method Name : onlineprofileclick();
 * Parameter: profileid
 * Uses: navigate the userprofile page
 *
 * */
function onlineprofileclick(val) {
	localStorage.setItem("userprofileid", val);
	window.location = "User_Profile.html";
}
//phonegap function for loading user profile page
function loadUserprofilepage() {
	document.addEventListener("deviceready", userprofilePage, false);
}
//callback function for loading user profile page
/*
 * Method Name : userprofilePage();
 * Parameter: None
 * Uses: callback function for user profile page , set the profile details.
 *
 * */
function userprofilePage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var username = "";
	var email = "";
	var dob = "";
	var gender = "";
	var age = "";
	var residence = "";
	var weight = "";
	var school = "";
	var image = "";
	var height = "";
	var uid = localStorage.getItem("userid");
	var userprofileid = localStorage.getItem("userprofileid");
	// temporary set
	
	/*localStorage.setItem("userprofileid","1199787");
	var userprofileid = localStorage.getItem("userprofileid");*/
	
	////
    var userprofilesuccess = false;
	$.mobile.showPageLoadingMsg(true);
	$
	.ajax({
		type : "POST",
		url : dynaurl + "/profile/index.php",
		data : {
			user_id : userprofileid,
			src_user_id :uid
		},
		dataType : 'json',
		success : function(data) {
			$.each(data, function(k, v) {
				if(k === "success"){
					userprofilesuccess = v;
				}
				if(k === "data"){
					$.each(v, function(key, value) {
						if (key === "username") {
							username = value;
						}
						/*if (key === "user_email") {
							email = value;
						}*/
						if (key === "user_geschlecht") {
							if (value == 'm') {
								gender = "Male"
							} else if (value == 'w') {
								gender = "Female";
							}
						}
						if (key === "user_birth") {
							dob1 = value;
							dob = dbbrkup(value);
						}
						/*if (key === "alter") {
							age = value;
						}*/
						if (key === "user_country") {
							residence = value;
						}
						if (key === "user_gewicht") {
							weight = value;
						}
						/*if (key === "school") {
							school = value;
						}*/
						/*if (key === "image") {
							image = value;
						}*/
						if (key === "user_groesse") {
							height = value + " cm";
						}

					});
					
				}
			});
			localStorage.setItem("userprofilename", username);
			var addinfoimage = "";
			addinfoimage += "<div class='flirtlifer-image'>"
				+ "<img src='"
				+ image
				+ "' class='flirtlifer-img img-border' /></div>"
				+ "<div class='flirt-info'><div class='inner'>"
				+ "<div class='user-name font-13' >"
				+ username
				+ "</div>"
				+ "<div class='user-head'>"
				+ "<div class='user-profile current'>"
				+ "<a href='User_Profile.html' target='_self' class='user-profile-button'>Profile</a></div>"
				+ "<div class='user-pics'>"
				+ "<a href='User_Photos.html' target='_self' class='user-profile-button'>Pictures</a></div>"
				+ "</div></div></div>";
			
			var userprofilecontent = "";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Username :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + username
				+ "</span>" + "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Email :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + email + "</span>"
				+ "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Gender :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + gender
				+ "</span>" + "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>DOB :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + dob + "</span>"
				+ "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Age :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + age + "</span>"
				+ "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Residence :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + residence
				+ "</span>" + "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Weight :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + weight
				+ "</span>" + "</div><div class='clear'></div>";
			userprofilecontent += "<div class='font-13 profil-head'>"
				+ "<span class='profil-title'>Height :</span>"
				+ "<span class='profil-space'>|</span>"
				+ "<span class='profil-field'>" + height
				+ "</span>" + "</div><div class='clear'></div>";
			if (school != "") {
				userprofilecontent += "<div class='font-13 profil-head'>"
					+ "<span class='profil-title'>School/University :</span>"
					+ "<span class='profil-space'>|</span>"
					+ "<span class='profil-field'>"
					+ school
					+ "</span>" + "</div><div class='clear'></div>";

			}
			if (localStorage.getItem("wantbudyrequest") !== "no") {
				if (localStorage.getItem("userid") !== userprofileid) {
					userprofilecontent += "<br><div class='font-12 form-head'>"
						+ "<div class='form-text'></div>"
						+ "<div class='form-field'>"
						+ "<a id='bdr' href='' onclick='callBuddyRequest("
						+ userprofileid
						+ ");'>"
						+ "<button class='button button2 text-decor-none font-12 btn-no-icon' data-role='none'> "
						+ "<span style='vertical-align:top'>BUDDY REQUEST</span> </button></a> </div>"
						+ "<div class='form-space'></div></div><div class='clear'></div>";
				}

			} else {
				localStorage.removeItem("wantbudyrequest");
			}
	         if(userprofilesuccess){
	        	 $(".user-profile-details").html(userprofilecontent);
	        	 $("#infoimage").html(addinfoimage);
	         }else{
	        	 $(".user-profile-details").html(""); 
	        	 $("#infoimage").html("");
	         }

			
			$.mobile.hidePageLoadingMsg();

		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});

}
//function for navigate buddy request page
/*
 * Method Name : callBuddyRequest();
 * Parameter: buddy id
 * Uses: navigate to the buddy request page.
 *
 * */
function callBuddyRequest(val) {
	window.location = "BuddyRequest.html";
}
//function for loading user photo page
function loadUserphotespage() {
	document.addEventListener("deviceready", userphotesPage, false);
}
//phonegap callback function for user photos page
/*
 * Method Name : userphotesPage();
 * Parameter: None
 * Uses: callback function for user photo page, get the user photoes from database
 *
 * */
function userphotesPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	imageset = [];
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var username = "";
	var userid = localStorage.getItem("userprofileid");
	var imgset = "";
	imageset = [];
	var image = "";
	var imgarr = [];
	$.mobile.showPageLoadingMsg(true);
	$
	.ajax({
		type : "POST",
		url : dynaurl + "/profile/index.php",
		data : {
			user_id : userid
		},
		dataType : 'json',
		success : function(data) {
			$
			.each(
					data,
					function(key, value) {
						if (key === "username") {
							username = value;
						}
						if (key === "image") {
							image = value;
						}
						if (key === "image_set") {
							$
							.each(
									value,
									function(key1,
											value1) {
										imageset
										.push({
											"key" : key1,
											"value" : value1
										});
										if (key1 % 2 === 0) {

											imgset += "<div class='user-photo2'>"
												+ "<a href='' onclick='showImage("
												+ key1
												+ "); return false;' class='ui-link'><img src='"
												+ value1
												+ "' class='flirtlifer-img' height='100px'/></a></div>"
												+ "<div class='clear'></div>";

										} else {
											imgset += "<div class='user-photo'>"
												+ "<a href='' onclick='showImage("
												+ key1
												+ "); return false;' class='ui-link'><img src='"
												+ value1
												+ "' class='flirtlifer-img' height='100px' /></a></div>";
										}
									});
						}

					});
			var addinfoimage = "";
			addinfoimage += "<div class='flirtlifer-image'>"
				+ "<img src='"
				+ image
				+ "' class='flirtlifer-img img-border' /></div>"
				+ "<div class='flirt-info'><div class='inner'>"
				+ "<div class='user-name font-13' >"
				+ username
				+ "</div>"
				+ "<div class='user-head'>"
				+ "<div class='user-profile current'>"
				+ "<a href='User_Profile.html' target='_self' class='user-profile-button'>Profile</a></div>"
				+ "<div class='user-pics'>"
				+ "<a href='User_Photos.html' target='_self' class='user-profile-button'>Pictures</a></div>"
				+ "</div></div></div>";
			$("#profilephotoinfo").html(addinfoimage);
			$(".user-photo-details").html(imgset);
			$.mobile.hidePageLoadingMsg();
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//function for loading tickers page
function loadTickerpage() {
	document.addEventListener("deviceready", ticketPage, false);
}
//callback function for loading ticker page
/*
 * Method Name : ticketPage();
 * Parameter: None
 * Uses: callback function for loading ticker page, and get the tickers list from database
 *
 * */
function ticketPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	
	$.mobile.showPageLoadingMsg(true);
	$.ajax({
		type : "GET",
		url : dynaurl + "/ticker/index.php",
		data : "",
		dataType : "json",
		success : function(data) {
			var image = "";
			var username = "";
			var message = "";// tickermessage
			var tstart = "";// ticker start time difference
			var ticketString = "";// create string for tivkers details
			//var c = 0;
			var successticker = false;
			var uid1 = ""; //userid of user
			$
			.each(data,function(key, value) {
				//alert(key === "data");
				//alert(value);
				if(key == "success"){
					successticker = value;
				}
				if(key === "data"){
					$.each(value, function(k, v) {
						$.each(v, function(key1, value1){
								if (key1 === "username") {
									username = value1;
								}
								/*if (key1 === "image") {
									image = value1;
								}*/
								if (key1 === "ticker_text") {
									message = value1;
									//console.log(value1);
								}
								if (key1 === "ticker_start") {
									tstart = getMinutesDiff(value1);
									if(tstart < 0){
										tstart = 0;
									}
								}
								if (key === "user_id") {
									uid1 = value;
								}
							});
		                    // //console.log(message);

						ticketString += "<li class='font-13'>"
							+ "<p class='ticker'><a href='' class='ui-link'>"
							+ "<img src='" + image
							+ "' class='tickers-image'/></a></p>"
							+ "<div class='ticker-info'><div class='ticker-inner'>"
							+ "<div class='ticker-head'><span class='ticker-name'>"
							+ "<a>" + username + "</a></span>"
							+ "<span class='ticker-time'> " + tstart
							+ " mins ago</span></div>" + "<div class='ticker-body'>"
							+ "<span>" + message + "</span>"
							+ "</div></div></div></li>"
							+ "<div class='clear dashedBottomBorder'></div>";
					});
				 
				}
				
			});
           // //console.log(successticker);
			//$("#hometicker").html(ticketString);
            if(successticker){
            	$("#tickerlist").html(ticketString);
            }else{
            	$("#tickerlist").html("");
            }
			$.mobile.hidePageLoadingMsg();
			
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");

		}

	});
	
}
//function for sending ticket
/*
 * Method Name : sentTicker();
 * Parameter: None
 * Uses: Sending the ticker
 *
 * */
function sendTicker() {
	var userid = localStorage.getItem("userid");
	var text = $("#textarea1").val();
	alert(text);
	alert(dynaurl + "/ticker/index.php?user_id="+userid+"&tickertext="+text+"&send=send");
	$.ajax({
		type : "GET",
		url : dynaurl + "/ticker/index.php",
		data : {
			user_id : userid,
			tickertext : text,
			send : "send"
		},

		success : function(data) {
			/*navigator.notification.alert(data, function(){
				$("#textarea1").focus();
				$("#textarea1").val(" ");
				ticketPage();
			}, "Alert", "OK");   */
			$.mobile.showPageLoadingMsg(true);
			$("#tickerresponsedata").html(" ");
			$.ajax({
				type : "GET",
				url : dynaurl + "/ticker/index.php",
				data : "",
				dataType : "json",
				success : function(data) {
					var image = "";
					var username = "";
					var message = "";// tickermessage
					var tstart = "";// ticker start time difference
					var ticketString = "";// create string for tivkers details
					//var c = 0;
					var successticker = false;
					var uid1 = ""; //userid of user
					$.each(data,function(key, value) {
						//alert(key === "data");
						//alert(value);
						if(key == "success"){
							successticker = value;
						}
						if(key === "data"){
							$.each(value, function(k, v) {
								$.each(v, function(key1, value1){
										if (key1 === "username") {
											username = value1;
										}
										/*if (key1 === "image") {
											image = value1;
										}*/
										if (key1 === "ticker_text") {
											message = value1;
											//console.log(value1);
										}
										if (key1 === "ticker_start") {
											tstart = getMinutesDiff(value1);
											if(tstart < 0){
												tstart = 0;
											}
										}
										if (key === "user_id") {
											uid1 = value;
										}
									});
				                    // //console.log(message);

								ticketString += "<li class='font-13'>"
									+ "<p class='ticker'><a href='' class='ui-link'>"
									+ "<img src='" + image
									+ "' class='tickers-image'/></a></p>"
									+ "<div class='ticker-info'><div class='ticker-inner'>"
									+ "<div class='ticker-head'><span class='ticker-name'>"
									+ "<a>" + username + "</a></span>"
									+ "<span class='ticker-time'> " + tstart
									+ " mins ago</span></div>" + "<div class='ticker-body'>"
									+ "<span>" + message + "</span>"
									+ "</div></div></div></li>"
									+ "<div class='clear dashedBottomBorder'></div>";
							});
						 
						}
						
					});
		           // //console.log(successticker);
					//$("#hometicker").html(ticketString);
		            if(successticker){
		            	$("#tickerlist").html(ticketString);
		            }else{
		            	$("#tickerlist").html("");
		            }
					$.mobile.hidePageLoadingMsg();
				},
				error : function(xhr, status, error) {
					navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");                      
					//alert("No Connection Established");

				}

			});
			//$("#tickerresponsedata").html(data);

		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");           
			//alert("No Connection Established");
		}
	});
}
//function for loading mail view page
function loadmailviewpage() {
	document.addEventListener("deviceready", mailviewPage, false);
}
//callback function for loading MailView page
/*
 * Method Name : mailviewPage();
 * Parameter: None
 * Uses: call back function for loading mail view page. And get read, unread & sent messages from database
 *
 * */
function mailviewPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var uname = "";
	var uid = "";
	var userid = localStorage.getItem("userid");
	var show = "buddies";
	var userlist = [];
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			show : show
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(key, value) {
				$.each(value, function(k, v) {
					if (k === "username") {
						uname = v;
					}
					if (k === "user_id") {
						uid = v;
					}

				});
				userlist.push({
					"uname" : uname,
					"userid" : uid
				});
			});
			localStorage["userlist"] = JSON.stringify(userlist);
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");           
			//alert("No Connection Established");
		}
	});
	$("#read")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				var readliststring = "";
				var subread = [];
				var uname = "";
				var msgid = "";
				var message = "";
				var time = "";
				var uid = localStorage.getItem("userid");
				var count = 0;
				var usercount = 0;
				var image = "";
				var sub = "";
				var sentuserid = "";
				var sentlist = [];
				var msgtype = "";
				var userlist = JSON.parse(localStorage["userlist"]);
				var msg = "";
				$
				.ajax({
					type : "GET",
					url : dynaurl + "/mail/index.php",
					data : {
						user_id : uid,
						mails_view : "1",
						type : "read",
					},
					dataType : "json",
					success : function(data) {
						count = data.length;
						$
						.each(
								data,
								function(key, value) {

									$
									.each(
											value,
											function(
													key1,
													value1) {
												count++;

												if (key1 === "from_userid") {

													sentuserid = value1;
												}
												if (key1 === "username") {
													uname = value1;
												}
												if (key1 === "msg_type") {
													msgtype = value1;
												}

												if (key1 === "msg_text") {
													message = value1;
												}
												if (key1 === "time_sent") {
													time = dateMinuteDiff(value1);
												}
												if (key1 === "image") {
													image = value1;
												}
												if (key1 === "msg_id") {
													msgid = value1;
												}
												if (key1 === "theme") {
													sub = value1;
												}
											});
									readliststring += "<li class='font-13 readli'>"
										+ "<p class='profile-visitor'>"
										+ "<a href='' class='ui-link'>"
										+ "<img src='"
										+ image
										+ "' class='tickers-image'/></a></p>"
										+ "<div class='profile-visitor-info'>"
										+ "<div class='mail-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='mailer-name'>"
										+ uname
										+ "</span>"
										+ "<span class='mail-time'>"
										+ time
										+ " ago</span></div>";
									/*
									 * if(message.length >
									 * 15){ msg
									 * =message.substring(0,15);
									 * readliststring += "<div
									 * class='mail-body'><span>"+msg+"</span></div>" + "<div
									 * class='mail-subject'><span><a
									 * href=''
									 * onclick='clickReadUnread(1,"+msgid+")'>REPLY</a></span>" + "<span
									 * style='float:right'><a
									 * href=''
									 * onclick='viewMoremsg("+msgid+",1)'>More</a>" + "</span></div></div></div></li><div
									 * class='clear
									 * dashedBottomBorder'></div>";
									 * //}else{
									 */
									msg = message
									readliststring += "<div id='mailbody' class='mail-body'><span onclick='viewMoremsg("
										+ msgid
										+ ",1)'>"
										+ msg
										+ "</span></div><div class='mail-subject'>"
										+ "<span><button class='button button2 text-decor-none' data-role='none' onclick='clickReadUnread(1,"
										+ msgid
										+ ","
										+ msgtype
										+ "); return false;'><span style='vertical-align:top'>REPLY</span> </button></span></div>"
										+ "</div></div></li><div class='clear dashedBottomBorder'></div>";
									// }

									subread
									.push({
										"msgid" : msgid,
										"subject" : sub,
										"touid" : sentuserid,
										"message" : message,
										"uname" : uname
									});
								});
						localStorage["subjectreadlist"] = JSON
						.stringify(subread);
						$("#mailread").html(readliststring);
						$.mobile.hidePageLoadingMsg();
					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");             
						//alert("No Connection Established");
					}
				});

				$(this).data("previous-state", "expanded");
			});
	$("#unread")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				var unreadliststring = "";
				var subunread = [];
				var uname = "";
				var msgid = "";
				var message = "";
				var time = "";
				var uid = localStorage.getItem("userid");
				var count = 0;
				var usercount = 0;
				var image = "";
				var sub = "";
				var sentuserid = "";
				var sentlist = [];
				var msgtype = "";
				var userlist = JSON.parse(localStorage["userlist"]);
				var msg = "";
				$
				.ajax({
					type : "GET",
					url : dynaurl + "/mail/index.php",
					data : {
						user_id : uid,
						mails_view : "1",
						type : "unread",
					},
					dataType : "json",
					success : function(data) {
						count = data.length;
						$
						.each(
								data,
								function(key, value) {
									$
									.each(
											value,
											function(
													key1,
													value1) {

												if (key1 === "from_userid") {

													sentuserid = value1;
												}
												if (key1 === "username") {
													uname = value1;
												}
												if (key1 === "msg_type") {
													msgtype = value1;
												}

												if (key1 === "msg_text") {
													message = value1;
												}
												if (key1 === "time_sent") {
													time = dateMinuteDiff(value1);
												}
												if (key1 === "image") {
													image = value1;
												}
												if (key1 === "msg_id") {
													msgid = value1;
												}
												if (key1 === "theme") {
													sub = value1;
												}
											});
									unreadliststring += "<li class='font-13'>"
										+ "<p class='profile-visitor'>"
										+ "<a href='' class='ui-link'>"
										+ "<img src='"
										+ image
										+ "' class='tickers-image'/></a></p>"
										+ "<div class='profile-visitor-info'>"
										+ "<div class='mail-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='mailer-name'>"
										+ uname
										+ "</span>"
										+ "<span class='mail-time'>"
										+ time
										+ " ago</span></div>";

									/*
									 * if(message.length >
									 * 15){ msg =
									 * message.substring(0,15);
									 * unreadliststring += "<div
									 * class='mail-body'><span>"+msg+"</span></div>" + "<div
									 * class='mail-subject'><span><a
									 * href=''
									 * onclick='clickReadUnread(0,"+msgid+")'>REPLY</a></span>" + "<span
									 * style='float:right'><a
									 * href=''
									 * onclick='viewMoremsg("+msgid+",0)'>More</a>" + "</span></div></div></div></li><div
									 * class='clear
									 * dashedBottomBorder'></div>";
									 * }else{
									 */
									msg = message
									unreadliststring += "<div id='mailbody' class='mail-body'><span onclick='viewMoremsg("
										+ msgid
										+ ",0)'>"
										+ msg
										+ "</span></div><div class='mail-subject'>"
										+ "<span><button class='button button2 text-decor-none' data-role='none' onclick='clickReadUnread(0,"
										+ msgid
										+ ","
										+ msgtype
										+ "); return false;'><span style='vertical-align:top'>REPLY</span> </button></span></div>"
										+ "</div></div></li><div class='clear dashedBottomBorder'></div>";
									// }

									subunread
									.push({
										"msgid" : msgid,
										"subject" : sub,
										"touid" : sentuserid,
										"message" : message,
										"uname" : uname
									});
								});
						//console.log(subunread.length);
						localStorage["subjectunreadlist"] = JSON
						.stringify(subunread);
						$("#mailunread").html(unreadliststring);
						$.mobile.hidePageLoadingMsg();

					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              
						//alert("No Connection Established");
					}
				});

				$(this).data("previous-state", "expanded");
			});
	$("#sent")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				var sentliststring = "";
				var msg = "";

				var uname = "";
				var msgid = "";
				var message = "";
				var time = "";
				var uid = localStorage.getItem("userid");
				var count = 0;
				var usercount = 0;
				var image = "";
				var sub = "";
				var sentuserid = "";
				var subsent = [];
				var sentlist = [];
				var userlist = JSON.parse(localStorage["userlist"]);
				$
				.ajax({
					type : "GET",
					url : dynaurl + "/mail/index.php",
					data : {
						user_id : uid,
						mails_view : "1",
						type : "sent",
					},
					dataType : "json",
					success : function(data) {
						count = data.length;
						$
						.each(
								data,
								function(key, value) {
									$
									.each(
											value,
											function(
													key1,
													value1) {
												if (key1 === "to_userid") {

													sentuserid = value1;
												}
												if (key1 === "username") {
													uname = value1;
												}

												if (key1 === "msg_text") {
													message = value1;
												}
												if (key1 === "time_sent") {
													time = dateMinuteDiff(value1);
												}
												if (key1 === "image") {
													image = value1;
												}
												if (key1 === "msg_id") {
													msgid = value1;
												}
												if (key1 === "theme") {
													sub = value1;
												}
											});
									sentliststring += "<li class='font-13'>"
										+ "<p class='profile-visitor'>"
										+ "<a href='' class='ui-link'>"
										+ "<img src='"
										+ image
										+ "' class='tickers-image'/></a></p>"
										+ "<div class='profile-visitor-info'>"
										+ "<div class='mail-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='mailer-name'>"
										+ uname
										+ "</span>"
										+ "<span class='mail-time'>"
										+ time
										+ " ago</span></div>";
									/*
									 * if(message.length >
									 * 15){ msg =
									 * message.substring(0,15);
									 * sentliststring += "<div
									 * class='mail-body'><span>"+msg+"</span></div><div
									 * class='mail-subject'>" + "<span
									 * style='float:right'><a
									 * href=''
									 * onclick='viewMoremsg("+msgid+")'>More</a>" + "</span></div></div></div></li><div
									 * class='clear
									 * dashedBottomBorder'></div>";
									 * }else{
									 */
									msg = message
									sentliststring += "<div class='mail-body' id='mailbody'><span onclick='viewMoremsg("
										+ msgid
										+ ",2)'>"
										+ msg
										+ "</span></div>"
										+ "</div></div></li><div class='clear dashedBottomBorder'></div>";

									subsent
									.push({
										"msgid" : msgid,
										"subject" : sub,
										"touid" : sentuserid,
										"message" : message,
										"uname" : uname
									});
									// }
								});
						localStorage["subjectsentlist"] = JSON
						.stringify(subsent);
						$("#mailsent").html(sentliststring);
						$.mobile.hidePageLoadingMsg();
					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              
						//alert("No Connection Established");
					}
				});
				$(this).data("previous-state", "expanded");
			});
}
/*
 * Method Name : sendMail();
 * Parameter: None
 * Uses: Send mai to the budies
 *
 * */
function sendMail() {
	var userlist = JSON.parse(localStorage["userlist"]);
	var uname = $("#toname").val();
	var usertoid = "";
	var temp = "";
	var tempuname = "";
	var subject = $("#sub").val();
	var message = $("#message").val();
	var userchk = false;
	var userid = localStorage.getItem("userid");
	var ip = gettingIp();
	for ( var i = 0; i < userlist.length; i++) {
		if (userlist[i].uname === uname) {
			usertoid = userlist[i].userid;
			userchk = true;
		}
	}
	if (userchk) {
		$.ajax({
			type : "GET",
			url : dynaurl + "/mail/index.php",
			data : {
				user_id : userid,
				to_user_id : usertoid,
				message : message,
				title : subject,
				logged_ip : ip,
				send_mail : "1"
			},
			dataType : "json",
			success : function(data) {
				$.each(data, function(key, value) {
					if (key === "result") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");                    
						//alert(value);
					}
				});

			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              
				//alert("No Connection Established");
			}
		});

	} else {
		navigator.notification.alert("Username Not Available, Try again!", function(){}, "Error!", "OK");		
		//alert("Username not available! try again.");
	}

}
//checking for read,unread message and navigate to the Email answer page
/*
 * Method Name : clickReadUnread();
 * Parameter: isread, message id, message type
 * Uses: based on the the p[arameter values , corresponding data display in the Email answer page
 *
 * */
function clickReadUnread(isread, msgid, msgtype) {
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : "GET",
		url : dynaurl + "/mail/index.php",
		data : {
			user_id : userid,
			msg_id : msgid,
			is_read : isread,
		},
		dataType : "json",
		success : function(data) {
			localStorage.setItem("messageid", msgid);
			localStorage.setItem("isread", isread);
			localStorage.setItem("msgtype", msgtype);
			window.location = "Email_Answer1.html";

		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");           
			//alert("No Connection Established");
		}
	});

}
//loading the popup after click on the messages
/*
 * Method Name : viewMoremsg();
 * Parameter: value1, value2
 * Uses: This is optional method
 *
 * */
function viewMoremsg(val, val2) {
	var msgid = val;
	var isread = val2;
	var message = "";
	var readureadlist = "";
	$("#popup_box").width($(window).width() - 50).height(
			$(window).height() - 60);
	$(".user-status-info").css("height", $(window).height() - 100);
	$(".user-status-info").css("width", $(window).width() - 80);
	// $("#moremsg").css("height",$(window).height()-190);
	if (isread == 0) {
		readureadlist = JSON.parse(localStorage["subjectunreadlist"]);
	} else if (isread == 1) {
		readureadlist = JSON.parse(localStorage["subjectreadlist"]);
	} else {
		readureadlist = JSON.parse(localStorage["subjectsentlist"]);
	}

	for ( var i = 0; i < readureadlist.length; i++) {
		if (readureadlist[i].msgid == msgid) {

			$("#moremsg").html(readureadlist[i].message);
			$("#fromusename").html(readureadlist[i].uname);
			$("#fromsubject").html(readureadlist[i].subject);
		}
	}
	// window.location = "More.html";
	loadPopupBox();
}
//function for loading email page
function loadEmailpage() {
	document.addEventListener("deviceready", emailPage, false);
}
//callback function for loading email page
/*
 * Method Name : emailPage();
 * Parameter: None
 * Uses: callback function for email page loading and display the corresponding data
 *
 * */
function emailPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	$("#normal").hide();
	$("#yesno").hide();
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var messageid = localStorage.getItem("messageid");
	var isread = localStorage.getItem("isread");
	var readureadlist = "";
	if (isread == 0) {
		readureadlist = JSON.parse(localStorage["subjectunreadlist"]);
	} else {
		readureadlist = JSON.parse(localStorage["subjectreadlist"]);
	}
	var username = "";
	var subject = "";
	var emailtext = "";
	var touserid = "";
	for ( var i = 0; i < readureadlist.length; i++) {
		if (readureadlist[i].msgid == messageid) {
			username = readureadlist[i].uname;
			emailtext = readureadlist[i].message;
			subject = readureadlist[i].subject;
			touserid = readureadlist[i].touid;
		}
	}
	localStorage.setItem("emailsubject", subject);
	localStorage.setItem("touserid", touserid);
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	$("#emailcurtime").html(strTime);
	$("#emailansusename").html(username);
	$("#subject").html(subject);
	
   //  //console.log(msgtype);
	if (localStorage.getItem("msgtype") == 0) {
		$("#normal").show();
		$("#yesno").hide();
		$("#emailmsgarea").html(emailtext);
		$("#subject").html(subject);
		// $("#yesno").hide();
	} else if (localStorage.getItem("msgtype") == 49) {
		$("#normal").hide();
		$("#yesno").show();
		$("#emailmsgarea").html(emailtext);
	} else if (localStorage.getItem("msgtype") == 48) {
		$("#normal").hide();
		$("#yesno").hide();
		$("#subject").html("Buddy Request");
		var useridlist = JSON.parse(localStorage["userlist"]);
		for ( var m = 0; m < useridlist.length - 1; m++) {
			if (useridlist[m].userid === touserid) {
				localStorage.setItem("yes", "1");
			}
		}
		if (localStorage.getItem("yes") != null) {
			$("#emailmsgarea").html("Already buddy request accepted ");

		} else {
			$("#emailmsgarea").html("Already buddy request rejected");

		}

	}
}
//function used for Answer email
/*
 * Method Name : emailAnswer();
 * Parameter: value
 * Uses: depend upon the parameter value buddy request allow , disallow and pending information shows , 
 * with corresponding message and button 
 * 
 * */
function emailAnswer(val) {
	if (val == 0) {
		var userid = localStorage.getItem("userid");
		var touserid = localStorage.getItem("touserid");
		$.ajax({
			type : "GET",
			url : dynaurl + "/buddy/index.php",
			data : {
				user_id : userid,
				buddy_id : touserid,
				action : "allow",
			},
			dataType : "json",
			success : function(data) {
				$.each(data, function(key, value) {
					if (key === "success") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");                      
						//alert(value);
						window.location = "Mail_View.html";
					}
					if (key === "error") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");                      
						//alert(value);
						window.location = "BuddyList.html";
					}
				});
			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");               
				//alert("No Connection Established");
			}
		});
	} else if (val == 1) {
		var userid = localStorage.getItem("userid");
		var touserid = localStorage.getItem("touserid");
		$.ajax({
			type : "GET",
			url : dynaurl + "/buddy/index.php",
			data : {
				user_id : userid,
				buddy_id : touserid,
				action : "disallow",
			},
			dataType : "json",
			success : function(data) {
				$.each(data, function(key, value) {
					if (key === "success") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");                     
						//alert(value);
						window.location = "Mail_View.html";
					}
					if (key === "error") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");                     
						//alert(value);
						window.location = "BuddyList.html";
					}
				});
			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              
				// alert("No Connection Established");
			}
		});
	} else if (val == 2) {

		var username = localStorage.getItem("username");
		var touserid = localStorage.getItem("touserid");
		var subject = localStorage.getItem("emailsubject");
		var fromuserid = localStorage.getItem("userid");
		var text = $("#emailmsgarea").val();
		var ip = gettingIp();
		$.ajax({
			type : "GET",
			url : dynaurl + "/mail/index.php",
			data : {
				user_id : fromuserid,
				to_user_id : touserid,
				message : text,
				title : subject,
				logged_ip : ip,
				send_mail : "1"
			},
			dataType : "json",
			success : function(data) {
				$.each(data, function(key, value) {
					if (key === "result") {
						navigator.notification.alert(value, function(){}, "Alert", "OK");
						//alert(value);
						window.location = "Mail_View.html";
					}
				});

			},
			error : function(xhr, status, error) {
				navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");            
				//alert("No Connection Established");
			}
		});
	}
}
//function for loading buddy request page
function loadbuddyrequestpage() {
	document.addEventListener("deviceready", bodyrequestPage, false);
}
//callback function for loading buddy request page
/*
 * Method Name : buddyRequestpage();
 * Parameter: None
 * Uses: callback function for loading buddy request page 
 * 
 * */
function bodyrequestPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	//console.log(localStorage.getItem("userprofilename"));
	var username = localStorage.getItem("userprofilename");
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	$("#bodyreqtime").html(strTime);
	$("#bodyrequestusename").html(username);
	var uname = localStorage.getItem("username");
	var sub = "User " + uname + " wants to be added to your buddy list!"
	$("#bsubject").html(sub);

}
//function used for sending buddy request
/*
 * Method Name : buddyRequestSend();
 * Parameter: None
 * Uses: This method used for sending buddy request 
 * 
 * */
function buddyRequestSend() {
	var bodyid = localStorage.getItem("userprofileid");
	var message = $("#textarea2").val();
	var username = localStorage.getItem("username");
	if (message == "") {
		message = "User " + username
		+ " wants to be added to your buddy list! Do you agree?";
	}
	var userid = localStorage.getItem("userid");
	var ip = gettingIp();
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			buddy_id : bodyid,
			action : "add",
			/*message : message,
			logged_ip : ip*/
		},
		dataType : "json",
		success : function(data) {
			//alert(data);
			$.each(data, function(key, value) {
				if (key === "data") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                 
					//alert(value);
					window.location = "User_Profile.html";
				}
				if (key === "error") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                
					// alert(value);
					window.location = "User_Profile.html";
				}
			});
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//function for loading buddy list page
function loadBuddylistpage() {
	document.addEventListener("deviceready", buddylistPage, false);
}

var listuser = [];
var useridlist = [];
//callback function for loading buddylist page
/*
 * Method Name : buddylistPage();
 * Parameter: None
 * Uses: callback function for loading buddy list page and get the buddy list, pending list and waiting list users .
 * 
 * */
function buddylistPage() {
	document.addEventListener("backbutton", onBackKey, false);
	//document.addEventListener("pause", onPause, false);
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	budylistexpand();
	$("#buddylistcolapse").on("expand", function() {

		budylistexpand();
	});
	$("#pendinglistcolapse")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				useridlist = [];
				var pendinglist = "<ul class='nav-list' >";
				var c = 0;
				var image = "";
                var pendingsuccess = false;
				var uid = localStorage.getItem("userid");
				var show = "pending";
				var userimg = [];
				$
				.ajax({
					type : "GET",
					url : dynaurl + "/buddy/index.php",
					data : {
						user_id : uid,
						show : show
					},
					dataType : "json",
					success : function(data) {
						$.each(data, function(k1, v1){
							if(k1 === "success"){
								pendingsuccess = v1;
							}
							if(k1 === "data"){
								$
								.each(
										v1,
										function(key, value) {
											$
											.each(
													value,
													function(
															k,
															v) {
														if (k === "username") {
															userimg
															.push({
																key1 : "username",
																value1 : v
															});

														}
														if (k === "user_id") {

															useridlist
															.push({
																key1 : key,
																value1 : v
															});

														}
														/*if (k === "image") {

															userimg
															.push({
																key1 : "image",
																value1 : v
															});

														}*/
													});
											pendinglist += "<li class='font-13'>"
												+ "<p class='ticker'><a href='' class='ui-link' onclick='clickProfile("
												+ key
												+ ");'>"
												+ "<img src='"
												+ userimg[1].value1
												+ "' class='tickers-image'/></a></p>";
											pendinglist += "<div class='ticker-info'>"
												+ "<div class='ticker-inner'>"
												+ "<div class='ticker-head'>"
												+ "<span class='ticker-name'>"
												+ "<a href='' onclick='clickProfile("
												+ key
												+ ");'>"
												+ userimg[0].value1
												+ "</a>"
												+ "</span></div></div></div>"
												+ "<span class='form-field'>"
												+ "<input type='button' class='button button2 text-decor-none btn-no-icon' value='ALLOW' data-role='none' data-mini='true' onclick='allowBuddy("
												+ key
												+ ");'/>"
												+

												"<input type='button' class='button button2 text-decor-none btn-no-icon' value='DISALLOW' data-role='none' data-mini='true' onclick='disallowBuddy("
												+ key
												+ ");'/>"
												+ "</span>"
												+ "</li><div class='clear dashedBottomBorder'></div>";

											userimg = [];

										});
								pendinglist += "</ul>";
							}
						});
						if(pendingsuccess){
							$("#pendinglist").html(pendinglist);
						}else{
							$("#pendinglist").html("");
						}
						
						$.mobile.hidePageLoadingMsg();

					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              //alert("No Connection Established");
					}
				});
			});
	$("#waitinglistcolapse")
	.on(
			"expand",
			function() {
				$.mobile.showPageLoadingMsg(true);
				useridlist = [];
				var waitinglist = "";
				var c = 0;
				var image = "";
				var uid = localStorage.getItem("userid");
				var show = "waiting";
                var waitingsuccess = false;
				var userimg = [];
				$
				.ajax({
					type : "GET",
					url : dynaurl + "/buddy/index.php",
					data : {
						user_id : uid,
						show : show
					},
					dataType : "json",
					success : function(data) {
						$.each(data, function(k1, v1){
							if(k1 === "success"){
								waitingsuccess = v1;
							}
							if(k1 === "data"){
						$
						.each(
								data,
								function(key, value) {
									$
									.each(
											value,
											function(
													k,
													v) {
												if (k === "username") {

													userimg
													.push({
														key1 : "username",
														value1 : v
													});
												}
												if (k === "user_id") {

													useridlist
													.push({
														key1 : key,
														value1 : v
													});

												}
												/*if (k === "image") {

													userimg
													.push({
														key1 : "image",
														value1 : v
													});

												}*/
											});
									waitinglist += "<li class='font-13'>"
										+ "<p class='ticker'><a href='' class='ui-link' onclick='clickProfile("
										+ key
										+ ");'>"
										+ "<img src='"
										+ userimg[1].value1
										+ "' class='tickers-image'/></a></p>";
									waitinglist += "<div class='ticker-info'>"
										+ "<div class='ticker-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='ticker-name'>"
										+ "<a href='' onclick='clickProfile("
										+ key
										+ ");'>"
										+ userimg[0].value1
										+ "</a>"
										+ "</span></div></div></div>"
										+ "<span class='form-field'>"
										+ "<input type='button' class='button button2 text-decor-none btn-no-icon' value='DELETE' data-role='none' onclick='deleteRequestedBuddy("
										+ key
										+ ");'/>"
										+ "</span>"
										+ "</li><div class='clear dashedBottomBorder'></div>";

									userimg = [];

								});
							}
						});
						if(waitingsuccess){
							$("#waitinglist").html(waitinglist);
						}else{
							$("#waitinglist").html("");
						}
						
						$.mobile.hidePageLoadingMsg();

					},
					error : function(xhr, status, error) {
						navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");              
						//alert("No Connection Established");
					}
				});
			});

}
/*
 * Method Name : buddylistexpand();
 * Parameter: None
 * Uses: getting the list of buddies of login users
 * 
 * */
function budylistexpand() {
	$.mobile.showPageLoadingMsg(true);
	var budylist = "<ul class='nav-list' >";
	var c = 0;
	var image = "";
	useridlist = [];
	var uid = localStorage.getItem("userid");
	var show = "buddies";
	var userimg = [];
	var successbudies = false;
	$
	.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : uid,
			show : show
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(k, v){
				if(k === "success"){
					successbudies = v;
				}
				if(k === "data"){
					$
					.each(
							data,
							function(key, value) {
								$.each(value, function(k, v) {

									if (k === "user_id") {

										useridlist.push({
											key1 : key,
											value1 : v
										});
									}
									if (k === "username") {

										userimg.push({
											key1 : "username",
											value1 : v
										});
									}

									/*if (k === "image") {

										userimg.push({
											key1 : "image",
											value1 : v
										});

									}*/

								});
								if (userimg[0].value1 !== null) {
									budylist += "<li class='font-13'>"
										+ "<p class='ticker'><a href='' class='ui-link' onclick='clickProfile("
										+ key
										+ ");'>"
										+ "<img src='"
										+ userimg[1].value1
										+ "' class='tickers-image'/></a></p>";
									budylist += "<div class='ticker-info'>"
										+ "<div class='ticker-inner'>"
										+ "<div class='ticker-head'>"
										+ "<span class='ticker-name'>"
										+ "<a href='' onclick='clickProfile("
										+ key
										+ ");'>"
										+ userimg[0].value1
										+ "</a>"
										+ "</span></div></div></div>"
										+ "<span class='form-field'>"
										+ "<input type='button' class='button button2 text-decor-none btn-no-icon' value='DELETE' data-role='none' onclick='deleteBuddy("
										+ key
										+ ");'/>"
										+ "</span></li><div class='clear dashedBottomBorder'></div>";

									userimg = [];
								}

							});
					budylist += "</ul>";
				}
			});
		    if(successbudies){
		    	$("#buddylist").html(budylist);
		    }else{
		    	$("#buddylist").html("");
		    }
			
			$.mobile.hidePageLoadingMsg();

		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//navigate user profile page 
/*
 * Method Name : clickProfile();
 * Parameter: id
 * Uses: depend upon the id navigate the corresponding users profile page
 * 
 * */
function clickProfile(k) {
	var id = useridlist[k].value1;
	localStorage.setItem("userprofileid", id);
	localStorage.setItem("wantbudyrequest", "no");
	window.location = "User_Profile.html";
}
//function for deletge buddy
/*
 * Method Name : deleteBuddy();
 * Parameter: buddyid
 * Uses: delete the buddy from buddy list
 * 
 * */
function deleteBuddy(val) {
	var buddyid = useridlist[val].value1;
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			buddy_id : buddyid,
			action : "del",
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(key, value) {
				if (key === "success") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                  //alert(value);
					window.location = "BuddyList.html";
				}
				if (key === "error") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                  //alert(value);
					window.location = "BuddyList.html";
				}
			});
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//function for allowimg buddy request
/*
 * Method Name : allowBuddy();
 * Parameter: buddyid
 * Uses: allowing the buddy request from pending list
 * 
 * */
function allowBuddy(val) {
	var budyid = useridlist[val].value1;
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			buddy_id : budyid,
			action : "allow",
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(key, value) {
				if (key === "success") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                 
					// alert(value);
					window.location = "BuddyList.html";
				}
				if (key === "error") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                  
					//alert(value);
					window.location = "BuddyList.html";
				}
			});
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");           
			//alert("No Connection Established");
		}
	});
}
//function for disallow buddy request page
/*
 * Method Name : disallowBuddy();
 * Parameter: buddyid
 * Uses: disallow the  buddy request from pending list
 * 
 * */
function disallowBuddy(val) {
	var budyid = useridlist[val].value1;
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			buddy_id : budyid,
			action : "disallow",
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(key, value) {
				if (key === "success") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                  
					//alert(value);
					window.location = "BuddyList.html";
				}
				if (key === "error") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                 
					//alert(value);
					window.location = "BuddyList.html";
				}
			});
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");          
			//alert("No Connection Established");
		}
	});
}
//function for deleteing requested buddy
/*
 * Method Name : deleteRequestedbuddy();
 * Parameter: buddyid
 * Uses: delete the requested buddy from waiting list
 * 
 * */
function deleteRequestedBuddy(val) {
	var budyid = useridlist[val].value1;
	var userid = localStorage.getItem("userid");
	$.ajax({
		type : "GET",
		url : dynaurl + "/buddy/index.php",
		data : {
			user_id : userid,
			buddy_id : budyid,
			action : "del_waiting",
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(key, value) {
				if (key === "success") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");                 
					//alert(value);
					window.location = "BuddyList.html";
				}
				if (key === "error") {
					navigator.notification.alert(value, function(){}, "Alert", "OK");
					//alert(value);
					window.location = "BuddyList.html";
				}
			});
		},
		error : function(xhr, status, error) {
			navigator.notification.alert("No Connection Established", function(){}, "Connection Error!", "OK");
			//alert("No Connection Established");
		}
	});
}

// Notification buddy unload function 
function loadNotificationpage(){
	document.addEventListener("deviceready", notificationPage, false);
	
}

/*
 * Method Name : notificationPage();
 * Paramenter : None
 * use : phonegap callback function , Here showing the all notification list.
 */

function notificationPage(){
	notificationShow();
	var notyfycount = localStorage.getItem("notifycount");
	if (notyfycount == 0) {
		$("#notifycount").hide();
	} else {
		$("#notifycount").show();
		$("#notifycount").html(notyfycount);
	}

	setInterval(function() {
		notificationShow();
		var notyfycount = localStorage.getItem("notifycount");
		if (notyfycount == 0) {
			$("#notifycount").hide();
		} else {
			$("#notifycount").show();
			$("#notifycount").html(notyfycount);
		}
	}, 5000);
	var notificationarr = JSON.parse(localStorage["notificationarr"]);
	var notificationlist  = "";
	$.mobile.showPageLoadingMsg(true);
	for(var m =notificationarr.length-1; m >= 0 ; m--){
		var notarr = notificationarr[m].split("@");

		notificationlist += "<li class='font-13'>"
			+ "<p class='ticker'><a href='javascript:onclick=notificationProfile("+notarr[6]+"); ' class='ui-link'>"
			+ "<img src='"
			+ notarr[2]
			+ "' class='tickers-image'/></a></p>"
			+ "<div class='ticker-info'><div class='ticker-inner'>"
			+ "<div class='ticker-head'><span class='ticker-name'>"
			+ "<a>"
			+ notarr[3]
			+ "</a></span>"
			+ "<span class='ticker-time'>"
			+ notarr[4]

			+ " ago</span></div>"
			+ "<div class='ticker-body'>"
			+ "<span> Title:"
			+ notarr[5]
			+ "</span> <br><span>Body : "+notarr[1]+"</span>"
			+ "</div></div></div></li>"
			+ "<div class='clear dashedBottomBorder'></div>";

	
	}
	$("#notificationlist").html(notificationlist)
	$.mobile.hidePageLoadingMsg();
	
}

/*
 * method Name : notificationProfile( profileid)
 * parameter : Profile id
 * use : click on user image , user proifile should be load
 */
function notificationProfile(profileid){
	localStorage.setItem("userprofileid", profileid);
	window.location = "User_Profile.html";
}
//function for dateof birth break ups
/*
 * Method Name : dbbrkup();
 * Parameter: date
 * Uses: breaks the date and set with required format
 *
 * */
function dbbrkup(birth) {
	var d = birth.split("-");
	var month = '';
	if (d[1] == 01) {
		month = "January";
	} else if (d[1] == 02) {
		month = "February";
	} else if (d[1] == 03) {
		month = "March";
	} else if (d[1] == 04) {
		month = "April";
	} else if (d[1] == 05) {
		month = "May";
	} else if (d[1] == 06) {
		month = "June";
	} else if (d[1] == 07) {
		month = "July";
	} else if (d[1] == 08) {
		month = "August";
	} else if (d[1] == 09) {
		month = "September";
	} else if (d[1] == 10) {
		month = "October";
	} else if (d[1] == 11) {
		month = "November";
	} else if (d[1] == 12) {
		month = "December";
	}
	return d[2] + "  " + month + "  " + d[0];
}
//function for age calculate
/*
 * Method Name : ageCalculate();
 * Parameter: date of birth
 * Uses: for age calculate from given date of birth
 *
 * */
function ageCalculate(dobage) {
	var agearr = dobage.split("-");
	var bday = agearr[2];
	var bmo = agearr[1];
	var byr = agearr[0];
	var age;
	var now = new Date();
	tday = now.getDate();
	tmo = (now.getMonth());
	tyr = (now.getFullYear());
	if ((tmo > bmo) || (tmo == bmo & tday >= bday)) {
		age = byr;
	} else {
		age = byr + 1;
	}
	return (tyr - age) + " of years old";
}
//checking for single, non single
/*
* Method Name : checkSingle();
* Parameter: value
* Uses: check for single , non single
*
* */
function checkSingle(val) {
	if (val === "1") {
		return "[Single]";
	} else if (val === "2") {
		return "[No Single]";
	} else {
		return "";
	}
}
//loking for man, women , Noce people
/*
* Method Name : checkManwomen();
* Parameter: value
* Uses: checking for Man, Women or Nice people
*
* */
function checkManwomen(val) {
	if (val === 1) {
		return "Man";
	} else if (val === 2) {
		return "Women";
	} else {
		return "Nice People";
	}
}
//navigate home p[age after flirtlife de image click
/*
 * Method Name : homeImageClick();
 * Parameter: None
 * Uses: navigate home page
 * 
 * */
function homeImageClick() {
	window.location = "Home.html";
}
//function for get minuted difference from current
/*
 * Method Name : getMiutesdiff();
 * Parameter: value in unix time stamp format
 * Uses: calculate the time differnece in minute
 * 
 * */
function getMinutesDiff(uts) {
	var date = new Date(uts * 1000);
	var hours = date.getHours();
	var minutes = getminutes(date.getMinutes());
	var start = hours + "" + minutes;
	var date1 = new Date();
	var ehours = date1.getHours();
	var eminutes = getminutes(date1.getMinutes());
	var end = ehours + "" + eminutes;
	var start_hour = start.slice(0, -2);
	var start_minutes = start.slice(-2);
	var end_hour = end.slice(0, -2);
	var end_minutes = end.slice(-2);
	var startDate = new Date(0, 0, 0, start_hour, start_minutes);
	var endDate = new Date(0, 0, 0, end_hour, end_minutes);
	var millis = endDate - startDate;
	var minutes = millis / 1000 / 60;
	return minutes;
}
//get minutes
/*
 * Method Name : getminutes();
 * Parameter: minute
 * Uses: getting the minutes in string format
 * 
 * */
function getminutes(min) {
	if (min >= 0 && min <= 9) {
		return min = "0" + min;
	} else {
		return min;
	}
}
//gettinmg ipv6 from ipv4
/*
 * Method Name : getIpv6();
 * Parameter: ip
 * Uses: convert ipv4 value to ipv6
 * 
 * */
function getIPv6(ip) {
	var value, val1, val2, val3, val4;
	var octets = ip.split(".");
	var a1 = octets[0];
	var a2 = octets[1];
	var a3 = octets[2];
	var a4 = octets[3];
	val1 = getvalue(a1);
	val2 = getvalue(a2);
	val3 = getvalue(a3);
	val4 = getvalue(a4);
	value = val1 + val2 + ":" + val3 + val4;
	return value;
}
function getvalue(b) {
	var val = "";
	var r1 = b % 16;
	var q1 = Math.floor(b / 16);
	val += convertipv6(q1);
	val += convertipv6(r1);
	return val;
}
function convertipv6(a) {
	var result = "";
	if (a < 10) {
		result = a;
	} else {
		if (a === 10) {
			result = "A";
		}
		if (a === 11) {
			result = "B";
		}
		if (a === 12) {
			result = "C";
		}
		if (a === 13) {
			result = "D";
		}
		if (a === 14) {
			result = "E";
		}
		if (a === 15) {
			result = "F";
		}

	}

	return result;
}
///end///
//getting date min difference is date,hour, mins
/*
 * Method Name : dateMinuteDiff();
 * Parameter: value in unix time stamp format
 * Uses: differ time in date, hour, minute format
 * 
 * */
function dateMinuteDiff(uts) {
	var s = new Date(uts * 1000);
	var e = new Date();
	return dateDiff(s, e);
}

function dateDiff(date1, date2) {
	var one_day = 1000 * 60 * 60 * 24;
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();
	var difference_ms = date2_ms - date1_ms;
	difference_ms = difference_ms / 1000;
	//alert(difference_ms);
	var seconds = Math.floor(difference_ms % 60);
	difference_ms = difference_ms / 60;
	var minutes = Math.floor(difference_ms % 60);
	difference_ms = difference_ms / 60;
	var hours = Math.floor(difference_ms % 24);
	var days = Math.floor(difference_ms / 24);
  //  alert(days);
	if (days != 0) {
		return days + ' Days';
	} else if (hours != 0) {
		return hours + ' Hours';
	} else if (minutes != 0) {
		return minutes + ' Min';
	} else {
		return seconds + ' Seconds';
	}

}
//function for 1st letter capital  
/*
 * Method Name : capitalFirstLetter();
 * Parameter: value
 * Uses: convert first letter in capital
 * 
 * */
function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


