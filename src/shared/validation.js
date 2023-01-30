import { create, test, enforce } from 'vest';

const validation = create((data = {}) => {
  test('date', 'Username is required', () => {
    enforce(data.date).isNotBlank();
  });

});

export default validation;