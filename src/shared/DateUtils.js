import moment from 'moment';

const parseMomentDate = (value) => moment(value, "YYYY-MM-DD HH:mm:ss");
const parseDate = (value) => parseMomentDate(value).toDate();

export { parseMomentDate, parseDate }