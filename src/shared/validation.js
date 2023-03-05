import { create, test, enforce, only, warn, skipWhen } from "vest";

const validation = create((data = {}, currentField) => {
  only(currentField);

  test("date", "Date is required", () => {
    enforce(data.date).isNotEmpty();
  });
  test("amount", "Amount is required", () => {
    enforce(data.amount).isNotEmpty()
  });

  test("for", "For is required", () => {
    enforce(data.for).isNotEmpty()
  });
});

const validationChecks = create((data = {}, currentField) => {
  console.log(data, currentField)
  only(currentField);

  test("date", "Date is required", () => {
    enforce(data.date).isNotEmpty();
  });
  test("dateOfCheck", "Date of check is required", () => {
    enforce(data.dateOfCheck).isNotEmpty()
  });

  test("checkNum", "Number check is required", () => {
    enforce(data.checkNum).isNotEmpty().longerThanOrEquals(7).matches('^[0-9]+$')
  });

  test("amount", "Amount is required", () => {
    enforce(data.amount).isNotEmpty()
  });
  test("for", "For is required", () => {
    enforce(data.for).isNotEmpty()
  });


});

export {
  validation,
  validationChecks
}