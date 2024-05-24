module.exports = {
    dateInFuture1(date, hours) {
        return new Date(date.setTime(date.getTime() + (hours*60*60*1000)));
    },

    dateInFuture2(hours) {
        this.curDate = new Date();
        return new Date(this.curDate.setTime(this.curDate.getTime() + (hours*60*60*1000)));
    }
}