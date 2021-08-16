import { StudentTypePipe } from './student-type.pipe';

describe('StudentTypePipe', () => {
  it('create an instance', () => {
    const pipe = new StudentTypePipe();
    expect(pipe).toBeTruthy();
  });
});
