function MMMMDDYYYY(i){
                         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                         var now = new Date(i);
                         return months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
                       }