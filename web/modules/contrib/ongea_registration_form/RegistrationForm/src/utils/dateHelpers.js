export const getDate = (date) => {
	const dateObject = new Date(date);
	return ((dateObject.getDate() < 10 ? '0':'') +dateObject.getDate()+'.'+((dateObject.getMonth()+1) < 10 ? '0':'')+(dateObject.getMonth()+1)+'.'+dateObject.getFullYear());
};

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