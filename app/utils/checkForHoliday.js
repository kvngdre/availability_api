const debug = require('debug')('app:checkHoliday');
const { getHolidays } = require('../controllers/holidayController');

async function checkForHoliday(dateTime, users) {
    try {
        let foundHoliday = false;

        for (let user of users) {
            const response = await getHolidays(
                user.country_code,
                dateTime.year,
                dateTime.month,
                dateTime.day
            );

            if (response.holidays[0]?.type[0] === 'National holiday')
                foundHoliday = true;

            if (foundHoliday) break;
        }

        if (foundHoliday) {
            dateTime = dateTime.plus({ days: 1 });

            checkForHoliday(dateTime, users);
        }

        return dateTime;
    } catch (error) {
        debug(error);
        return error;
    }
}

module.exports = checkForHoliday;
