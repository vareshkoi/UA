var pnr = document.getElementById("pnrNbr");
var date = document.getElementById("pnrCreationDate");

if (pnr !== null && date !== null) {
  pnr = pnr.getAttribute("value");
  date = date.getAttribute("value");
  date = new Date(date).toISOString();
  visitor.setData("pnr", pnr);
  visitor.setData("date", date);
}