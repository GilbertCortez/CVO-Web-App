function MMMMDDYYYY(i){
                         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                         var now = new Date(i);
                         return months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
                        
                       }

function MMMMDDYYYY_addYear(i,x){
                         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                         var now = new Date(i);
                         return months[now.getMonth()] + ' ' + now.getDate() + ', ' + (now.getFullYear()+x);
                        
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


function DDMMYYYY() {
            var d = new Date(),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
}


function PRETTYTIME(i){//HH:SS To HH:SS PM/AM
						var splitTime=i.split(":");
						var prettytime="";
						if(splitTime[0]==12){
							prettytime=("12"+":"+splitTime[1]+" NN");
						}
						else if(splitTime[0]>12 ){
							prettytime=((splitTime[0]-12)+":"+splitTime[1]+" PM");
						}
						else{
							 prettytime=splitTime[0]+":"+splitTime[1]+" AM";
						}
						
						return prettytime;
}

function HHSS(i){
   var now = new Date(i);
      var hour=now.getHours();
      var minutes=now.getMinutes();
      var time="AM";

      if(hour==12 && minutes==0){
         time="NN";
      }
      else if(hour>12 && hour!=0){
         time="PM";
         hour-=12;
      }
      else if(hour==0){
         hour=12;
      }


      return hour+":"+(("0"+minutes).slice(-2))+" "+time;

}