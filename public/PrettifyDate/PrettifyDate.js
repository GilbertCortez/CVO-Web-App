function MMMMDDYYYY(i){
                         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                         var now = new Date(i);
                         return months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
                       }
					   
function YYYYMMDD() {
						var d = new Date(),
							month = '' + (d.getMonth() + 1),
							day = '' + d.getDate(),
							year = d.getFullYear();

						if (month.length < 2) month = '0' + month;
						if (day.length < 2) day = '0' + day;

						return [year, month, day].join('-');
}