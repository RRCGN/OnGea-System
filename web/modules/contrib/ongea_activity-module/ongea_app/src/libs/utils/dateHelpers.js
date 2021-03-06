export const getDate = (date) => {
	const dateObject = new Date(date);
	return ((dateObject.getDate() < 10 ? '0':'') +dateObject.getDate()+'.'+((dateObject.getMonth()+1) < 10 ? '0':'')+(dateObject.getMonth()+1)+'.'+dateObject.getFullYear());
};

export const isInPeriod = (date,startDate,endDate) => {
	const dateObject = new Date(date);
	const startDateObj = new Date(startDate);
	const endDateObj = new Date(endDate);

	if(startDate && endDate){
		return (startDateObj.getTime() <= dateObject.getTime() && dateObject.getTime() <= endDateObj.getTime());
	}else if(!startDate){
		return (dateObject.getTime() <= endDateObj.getTime());
	}
	else if(!endDate){
		return (startDateObj.getTime() <= dateObject.getTime());
	}
	else{
		return true;
	}
	
}

export const getDateForObj = (date) => {
	const dateObject = new Date(date);
	const newDate = dateObject.getFullYear()+ '-' +((dateObject.getMonth()+1) < 10 ? '0':'')+(dateObject.getMonth()+1)+ '-' +(dateObject.getDate() < 10 ? '0':'') +dateObject.getDate();
	return (newDate);
};

export const getTime = (date) => {
	const dateObject = new Date(date);
	return (dateObject.getHours() < 10 ? '0':'')+dateObject.getHours()+':'+(dateObject.getMinutes() < 10 ? '0':'')+dateObject.getMinutes();
};

export const getElapsedTime = (start, end) => {
	const startDateObject = new Date(start);
	const endDateObject = new Date(end);

	return endDateObject.getTime() - startDateObject.getTime();
}

export const getEndTime = (start,duration) => {
	const startDateObject = new Date(start);
	const endDate = startDateObject.getTime()+duration;

	return new Date (endDate);
}  

export const getDaysOfPeriod = (start,end) => {
	
	Date.prototype.addDays = function(days) {
	    var date = new Date(this.valueOf());
	    date.setDate(date.getDate() + days);
	    return date;
	}


	const startDateObject = new Date(start);
	const endDateObject = new Date(end);
	const startDateStamp = startDateObject.getTime();
	const endDateStamp = endDateObject.getTime();
	var days = [];

	if(startDateStamp <= endDateStamp){
		var i = startDateObject.getTime();

		while (i <= endDateStamp){
			days.push(getDateForObj(i));
			i = new Date(i);
			i = i.addDays(1).getTime();
		}
	}
	


	return days;
}  

