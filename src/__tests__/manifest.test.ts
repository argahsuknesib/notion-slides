import manifest from '../../manifest.config';

describe('Manifest Configuration', () => {
  it('should import manifest config without errors', () => {
    expect(manifest).toBeDefined();
  });

  it('should be an object that defines a manifest', () => {
    expect(typeof manifest).toBe('object');
  });
});
