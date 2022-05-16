const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
const dateTime = parseInt(date.split("-").join(""))
console.log(dateTime)
