// Runtime stand-ins for the types-only package: every property read goes
// to globalThis.browser or globalThis.chrome at access time.
function liveGlobal(name) {
  const current = () => globalThis[name];
  return new Proxy(Object.create(null), {
    get: (_, key) => {
      const target = current();
      return target == null ? undefined : Reflect.get(target, key, target);
    },
    has: (_, key) => {
      const target = current();
      return target != null && key in target;
    },
    ownKeys: () => {
      const target = current();
      return target == null ? [] : Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor: (_, key) => {
      const target = current();
      const descriptor = target == null ? undefined : Reflect.getOwnPropertyDescriptor(target, key);
      return descriptor && { ...descriptor, configurable: true };
    },
    set: (_, key, value) => {
      const target = current();
      return target != null && Reflect.set(target, key, value, target);
    },
    deleteProperty: (_, key) => {
      const target = current();
      return target != null && Reflect.deleteProperty(target, key);
    },
  });
}
export const browser = liveGlobal("browser");
export const chrome = liveGlobal("chrome");
export default browser;
